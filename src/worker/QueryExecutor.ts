import { BothBundleStats } from "../reducers/schema";
import { Query } from "../utils/Query";
import {
  ModuleGraphWithChildren,
  ModuleGraphNodeWithChildren
} from "webpack-bundle-diff-add-children";

const traverseGraph = (
  startingNodes: ModuleGraphNodeWithChildren[],
  getSucessors: (
    node: ModuleGraphNodeWithChildren
  ) => ModuleGraphNodeWithChildren[]
) => {
  const visitedIds = new Set();
  startingNodes.forEach(node => visitedIds.add(node.id));

  const frontier: ModuleGraphNodeWithChildren[] = startingNodes.slice();
  const result: ModuleGraphNodeWithChildren[] = [];
  while (frontier.length) {
    const current: ModuleGraphNodeWithChildren | undefined = frontier.pop();
    if (!current) {
      return result;
    }
    visitedIds.add(current.id);

    // add to result
    result.push(current);

    // add successors to frontier
    getSucessors(current)
      .filter(node => !visitedIds.has(node.id))
      .forEach(node => frontier.unshift(node));
  }

  return result;
};

const fileNamePathToRegex = (
  fileName: string,
  options: { caseSensitive: boolean }
): RegExp => {
  const splitOnStar = fileName.split(/\*/g);
  return new RegExp(
    splitOnStar.join(".*"),
    options.caseSensitive ? undefined : "i"
  );
};

function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  var _intersection = new Set<T>();
  setB.forEach(elem => {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  });
  return _intersection;
}

const applyQuery = (
  bothGraphs: BothBundleStats,
  graph: ModuleGraphWithChildren,
  query: Query
): ModuleGraphNodeWithChildren[] => {
  switch (query.type) {
    case "FILENAME":
      const filterRegex = fileNamePathToRegex(query.fileName, {
        caseSensitive: query.caseSensitive
      });
      return Object.values(graph).filter(node => {
        return filterRegex.exec(node.name);
      });
    case "INCLUDES":
      const innerIncludeQueryResults = applyQuery(
        bothGraphs,
        graph,
        query.target
      );
      return traverseGraph(innerIncludeQueryResults, node =>
        node.dependants.map(parentNodeName => graph[parentNodeName])
      );
    case "INCLUDEDBY":
      const innerIncludedByQueryResults = applyQuery(
        bothGraphs,
        graph,
        query.target
      );
      return traverseGraph(innerIncludedByQueryResults, node =>
        node.dependencies.map(childNodeName => graph[childNodeName])
      );
    case "AND":
      const andLeftNames = applyQuery(bothGraphs, graph, query.left).map(
        node => node.name
      );
      const andRightNames = applyQuery(bothGraphs, graph, query.right).map(
        node => node.name
      );
      return Array.from(
        intersection(new Set(andLeftNames), new Set(andRightNames))
      ).map(name => graph[name]);
    case "OR":
      const orLeftNames = applyQuery(bothGraphs, graph, query.left).map(
        node => node.name
      );
      const orRightNames = applyQuery(bothGraphs, graph, query.right).map(
        node => node.name
      );
      // use set for uniqueness
      return Array.from(new Set(orLeftNames.concat(orRightNames))).map(
        name => graph[name]
      );
    case "ADDED":
      const newNames = new Set(Object.keys(bothGraphs.pullRequestGraph));
      for (let name of Object.keys(bothGraphs.baselineGraph)) {
        newNames.delete(name);
      }
      return Array.from(newNames)
        .map(name => graph[name])
        .filter(Boolean);
    case "REMOVED":
      const oldNames = new Set(Object.keys(bothGraphs.baselineGraph));
      for (let name of Object.keys(bothGraphs.pullRequestGraph)) {
        console.log("remove", name);
        oldNames.delete(name);
      }
      return Array.from(oldNames)
        .map(name => graph[name])
        .filter(Boolean);
    case "CHANGED":
      return Object.keys(graph)
        .filter(
          nodeName =>
            bothGraphs.pullRequestGraph[nodeName] === undefined ||
            bothGraphs.baselineGraph[nodeName] === undefined ||
            bothGraphs.pullRequestGraph[nodeName].size !=
              bothGraphs.baselineGraph[nodeName].size
        )
        .map(key => graph[key]);
    case "INTERPOLATE":
      return (() => {
        console.log("starting interpolation");
        console.log("running inner query");
        const queryToInterpolateResults = applyQuery(
          bothGraphs,
          graph,
          query.innerQuery
        );
        const originalNodeNames = new Set(
          queryToInterpolateResults.map(x => x.name)
        );
        console.log("getting union of all parents");
        const unionOfAllParents = new Set<string>();
        const parentsToOriginalNode = new Map<string, Set<string>>();
        for (let node of queryToInterpolateResults) {
          console.log("traverse from", node.name);
          traverseGraph([node], node =>
            node.dependants
              .map(parentNodeName => graph[parentNodeName])
              .filter(
                node =>
                  // do not ascend through other nodes in the starting set
                  !originalNodeNames.has(node.name)
              )
          ).forEach(parent => {
            unionOfAllParents.add(parent.name);
            if (!parentsToOriginalNode.has(parent.name)) {
              parentsToOriginalNode.set(parent.name, new Set());
            }
            parentsToOriginalNode.get(parent.name)!.add(node.name);
          });
        }
        console.log(unionOfAllParents);

        console.log("starting descendants of each node");
        const result = new Set<string>();
        for (let startingNode of queryToInterpolateResults) {
          console.log("traverse from", startingNode.name);
          const descendantsInUnion = traverseGraph(
            [startingNode],
            currentChildNode =>
              currentChildNode.dependencies
                .filter(childName => unionOfAllParents.has(childName))
                .filter(childName => {
                  const inParentSetsOf = parentsToOriginalNode.get(childName);
                  return (
                    // do not descend through other nodes in the starting set
                    !originalNodeNames.has(childName) &&
                    // If it was not seen in the parent pass, ignore it
                    inParentSetsOf != null &&
                    // Only include it in the graph if it is not a circular dependency.
                    // e.g. its only parent set is the same node it is in the child set of
                    !(
                      inParentSetsOf.size == 1 &&
                      inParentSetsOf.has(startingNode.name)
                    )
                  );
                })
                .map(childNodeName => graph[childNodeName])
          );
          descendantsInUnion.forEach(descendant => result.add(descendant.name));
        }

        console.log("got resulting nodes", result);

        return Array.from(result).map(name => graph[name]);
      })();
    case "NOT":
      const notQueryInnerResultNames = new Set<string>(
        applyQuery(bothGraphs, graph, query.innerQuery).map(x => x.name)
      );
      return Object.values(graph).filter(
        node => !notQueryInnerResultNames.has(node.name)
      );
  }
};

export class QueryExecutor {
  private bundleData: BothBundleStats | undefined;

  setData(blob: BothBundleStats) {
    this.bundleData = blob;
  }

  filter(query: Query): BothBundleStats {
    if (this.bundleData === undefined) {
      throw new Error("query executed before bundle data initialized");
    }

    const toGraph = (data: ModuleGraphNodeWithChildren[]) =>
      Object.fromEntries(data.map(x => [x.name, x]));
    const queriedData: BothBundleStats = {
      baselineGraph: toGraph(
        applyQuery(this.bundleData, this.bundleData.baselineGraph, query)
      ),
      pullRequestGraph: toGraph(
        applyQuery(this.bundleData, this.bundleData.pullRequestGraph, query)
      )
    };
    return queriedData;
  }
}
