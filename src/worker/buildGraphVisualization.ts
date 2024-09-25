import * as Vis from "vis-network";
import { Palette } from "./Palette";
import { getPackageFromFilePath } from "./getPackageFromFilePath";
import { default as Color } from "color";
import {
  BothBundleStats,
  GeneratedGraphData,
  ModuleGraphNode,
  ModuleGraph
} from "../reducers/schema";

import { formatByteSize, formatByteSizeChange } from "../utils/formatByteSize";
import { GOOD_COLOR, BAD_COLOR } from "../utils/colors";
import md5 from "md5";

const getDependencies = (maybeNode: ModuleGraphNode | undefined) =>
  maybeNode ? maybeNode.dependencies || [] : [];

const getReasonChildren = (maybeNode: ModuleGraphNode | undefined) =>
  maybeNode ? maybeNode.reasonChildren || [] : [];

const getNodeId = (
  oldGraphNode: ModuleGraphNode | undefined,
  newGraphNode: ModuleGraphNode | undefined
): string => {
  if (oldGraphNode) {
    return `old-${oldGraphNode.id}`;
  } else if (newGraphNode) {
    return `new-${newGraphNode.id}`;
  } else {
    throw new Error("neither new or old graph node was initialized");
  }
};

const getOutgoingEdges = (
  filteredBundleStats: BothBundleStats,
  oldGraphNode: ModuleGraphNode,
  newGraphNode: ModuleGraphNode,
  getEdgeTargets: (maybeNode: ModuleGraphNode | undefined) => string[]
): Vis.Edge[] => {
  const oldEdgeTargets: Set<string> = new Set(getEdgeTargets(oldGraphNode));
  const newEdgeTargets: Set<string> = new Set(getEdgeTargets(newGraphNode));

  const allDependencies: Set<string> = union(oldEdgeTargets, newEdgeTargets);

  const fromNodeId: string = getNodeId(oldGraphNode, newGraphNode);
  const edges: Vis.Edge[] = [];

  allDependencies.forEach(dependencyName => {
    const oldDependencyNode = filteredBundleStats.baselineGraph[dependencyName];
    const newDependencyNode =
      filteredBundleStats.pullRequestGraph[dependencyName];
    if (!newDependencyNode && !oldDependencyNode) {
      return;
    }
    const dependencyId = getNodeId(oldDependencyNode, newDependencyNode);
    const inNew = newEdgeTargets.has(dependencyName);
    const inOld = oldEdgeTargets.has(dependencyName);

    edges.push({
      from: fromNodeId,
      to: dependencyId,
      color: inNew && inOld ? "#000" : inNew ? BAD_COLOR : GOOD_COLOR,
      id: md5(`${fromNodeId}-->${dependencyId}`)
    });
  });

  return edges;
};

// Uses the NES colour palette by default.
const palette = new Palette([
  "#7C7C7C",
  "#0000FC",
  "#0000BC",
  "#4428BC",
  "#940084",
  "#A80020",
  "#A81000",
  "#881400",
  "#503000",
  "#007800",
  "#006800",
  "#005800",
  "#004058",
  "#000000",
  "#000000",
  "#000000",
  "#BCBCBC",
  "#0078F8",
  "#0058F8",
  "#6844FC",
  "#D800CC",
  "#E40058",
  "#F83800",
  "#E45C10",
  "#AC7C00",
  "#00B800",
  "#00A800",
  "#00A844",
  "#008888",
  "#000000",
  "#000000",
  "#000000",
  "#F8F8F8",
  "#3CBCFC",
  "#6888FC",
  "#9878F8",
  "#F878F8",
  "#F85898",
  "#F87858",
  "#FCA044",
  "#F8B800",
  "#B8F818",
  "#58D854",
  "#58F898",
  "#00E8D8",
  "#787878",
  "#000000",
  "#000000",
  "#FCFCFC",
  "#A4E4FC",
  "#B8B8F8",
  "#D8B8F8",
  "#F8B8F8",
  "#F8A4C0",
  "#F0D0B0",
  "#FCE0A8",
  "#F8D878",
  "#D8F878",
  "#B8F8B8",
  "#B8F8D8",
  "#00FCFC",
  "#F8D8F8",
  "#000000",
  "#000000"
]);

const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  var _union = new Set<T>();
  setA.forEach(elem => {
    _union.add(elem);
  });
  setB.forEach(elem => {
    _union.add(elem);
  });
  return _union;
};

const uniq = <T>(a: T[]) => {
  return Array.from(new Set(a));
};

export function buildGraphVisualization(
  filteredBundleStats: BothBundleStats,
  fullBundleStats: BothBundleStats
): GeneratedGraphData {
  const allNodeNames = uniq(
    Object.keys(filteredBundleStats.baselineGraph).concat(
      Object.keys(filteredBundleStats.pullRequestGraph)
    )
  );

  const nodes: (Vis.Node & Pick<Required<Vis.Node>, "id">)[] = [];
  const reasonChildrenEdges: Vis.Edge[] = [];
  const dependencyEdges: Vis.Edge[] = [];

  for (let nodeName of allNodeNames) {
    const oldGraphNode = filteredBundleStats.baselineGraph[nodeName];
    const newGraphNode = filteredBundleStats.pullRequestGraph[nodeName];
    const nodeId = getNodeId(oldGraphNode, newGraphNode);

    const isRemoved: boolean = !!(oldGraphNode && !newGraphNode);
    const isNewlyAdded: boolean = !!(!oldGraphNode && newGraphNode);

    let labelStub: string = "";
    const [packageName, inPackagePath] = getPackageFromFilePath(nodeName);
    let nodeColor: string = palette.getColorForName(packageName);
    const isLight: boolean = new Color(nodeColor).hsl().object().l > 50;
    let borderColor = isLight ? "#000" : nodeColor;
    if (isNewlyAdded) {
      labelStub = "NEW";
      borderColor = BAD_COLOR;
    } else if (isRemoved) {
      labelStub = "REMOVED";
      borderColor = GOOD_COLOR;
    }

    const wasHoisted = (
      node: ModuleGraphNode | undefined,
      graph: ModuleGraph
    ) =>
      node &&
      node.parents.length === 1 &&
      graph[node.parents[0]].containsHoistedModules === true;

    if (
      wasHoisted(oldGraphNode, fullBundleStats.baselineGraph) ||
      wasHoisted(newGraphNode, fullBundleStats.pullRequestGraph)
    ) {
      labelStub = "*HOISTED*" + (labelStub.length ? " " : "") + labelStub;
    }

    const isRootNode = (oldGraphNode || newGraphNode).parents.length == 0;
    if (isRootNode) {
      labelStub += " ROOT";
    }

    const nodeSize: string = !!(oldGraphNode && newGraphNode)
      ? `${formatByteSize(newGraphNode.size)}${newGraphNode.size === oldGraphNode.size
        ? ""
        : ", " + formatByteSizeChange(newGraphNode.size - oldGraphNode.size)
      }`
      : oldGraphNode
        ? `${formatByteSize(oldGraphNode.size)}`
        : `${formatByteSize(newGraphNode.size)}`;

    const addedOrRemoved = isNewlyAdded || isRemoved;

    const node = {
      id: nodeId,
      label: labelStub
        ? `${labelStub} ${inPackagePath} (${nodeSize})`
        : `${inPackagePath} (${nodeSize})`,
      title: "<div>AAAHHHH</div>",
      color: {
        background: nodeColor,
        border: borderColor,
        highlight: {
          background: nodeColor,
          border: borderColor
        }
      },
      scaling: {
        max: 1000
      },
      font: {
        size: addedOrRemoved || isRootNode ? 18 : 14
      },
      margin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      borderWidth: addedOrRemoved || isRootNode ? 2 : 1
    };

    if (isRootNode) {
      (node as any).shape = "diamond";
    } else {
      (node as any).font.color = isLight ? "#000" : "#FFF";
    }

    nodes.push(node);

    const thisNodeDependencyEdges = getOutgoingEdges(
      filteredBundleStats,
      oldGraphNode,
      newGraphNode,
      getDependencies
    );
    thisNodeDependencyEdges.forEach((x: Vis.Edge) => dependencyEdges.push(x));

    const thisNodeReasonChildrenEdges = getOutgoingEdges(
      filteredBundleStats,
      oldGraphNode,
      newGraphNode,
      getReasonChildren
    );
    thisNodeReasonChildrenEdges.forEach((x: Vis.Edge) =>
      reasonChildrenEdges.push(x)
    );
  }

  return { nodes, reasonChildrenEdges, dependencyEdges };
}
