import * as Vis from "vis-network";
import { Palette } from "./Palette";
import { getPackageFromFilePath } from "./getPackageFromFilePath";
import { default as Color } from "color";
import {
  GeneratedGraphData,
  ModuleGraphNode,
  ModuleGraph,
  BundleStats,
} from "../reducers/schema";

import { formatByteSize, formatByteSizeChange } from "../utils/formatByteSize";
import { GOOD_COLOR, BAD_COLOR } from "../utils/colors";
import md5 from "md5";

const getDependencies = (maybeNode: ModuleGraphNode | undefined) =>
  maybeNode ? maybeNode.dependencies || [] : [];

const getReasonChildren = (maybeNode: ModuleGraphNode | undefined) =>
  maybeNode ? maybeNode.reasonChildren || [] : [];

const getNodeId = (
  oldGraphNode: number | undefined,
  newGraphNode: number | undefined,
): string => {
  if (oldGraphNode) {
    return `old-${oldGraphNode}`;
  } else if (newGraphNode) {
    return `new-${newGraphNode}`;
  } else {
    throw new Error("neither new or old graph node was initialized");
  }
};

const diffEdge = (
  from: string,
  { target, inNew, inOld }: DiffEdgeInfo,
): Vis.Edge => {
  return ({
    from: from,
    to: target,
    color: inNew && inOld ? "#000" : inNew ? BAD_COLOR : GOOD_COLOR,
    id: md5(`${from}-->${target}`),
  });
};


const edgeFor = (
  from: string,
  to: string,
): Vis.Edge => {
  return ({
    from: from,
    to: to,
    color: "#000",
    id: md5(`${from}-->${to}`),
  });
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
  "#000000",
]);

const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  var _union = new Set<T>();
  setA.forEach((elem) => {
    _union.add(elem);
  });
  setB.forEach((elem) => {
    _union.add(elem);
  });
  return _union;
};

const uniq = <T>(a: T[]) => {
  return Array.from(new Set(a));
};

export function getNodeNames(data: BundleStats): string[] {
  return data.baselineGraph ?
    uniq(
      Object.keys(data.baselineGraph).concat(Object.keys(data.graph)),
    ) : Object.keys(data.graph)
}


const wasHoisted = (
  node: ModuleGraphNode | undefined,
  graph: ModuleGraph,
): boolean =>
  !!node &&
  node.parents.length === 1 &&
  graph[node.parents[0]].containsHoistedModules === true;


type DiffEdgeInfo = {
  target: number,
  inNew: boolean,
  inOld: boolean,
}

function getDiffEdgeInfo(
  newGraph: ModuleGraph,
  newNode: ModuleGraphNode,
  oldGraph: ModuleGraph,
  oldNode: ModuleGraphNode,
  getEdgeTargets: (maybeNode: ModuleGraphNode | undefined) => string[],
): DiffEdgeInfo[] {
  const oldEdgeTargets: Set<number> = new Set(getEdgeTargets(oldNode).map(
    nodeName => oldGraph[nodeName].id
  ));
  const newEdgeTargets: Set<number> = new Set(getEdgeTargets(newNode).map(
    nodeName => newGraph[nodeName].id
  ));

  for (let x of getEdgeTargets(newNode).map(
    nodeName => newGraph[nodeName].id
  )) {
    newEdgeTargets.add(x)
  }
  for (let x of getEdgeTargets(oldNode).map(
    nodeName => oldGraph[nodeName].id
  )) {
    newEdgeTargets.add(x)
  }

  let result: DiffEdgeInfo[] = [];
  union(oldEdgeTargets, newEdgeTargets).forEach((id) => {
    const inNew = newEdgeTargets.has(id);
    const inOld = oldEdgeTargets.has(id);

    let dependencyId = getNodeId(
      inNew ? id : undefined,
      inOld ? id : undefined,
    )

    result.push({
      target: id,
      inNew: inNew,
      inOld: inOld,
    })
  });

  return result
}

function getNodeProps(
  data: BundleStats,
  fullGraph: BundleStats,
  nodeName: string,
): ({
  nodeId: string,
  isRemoved: boolean,
  isNewlyAdded: boolean,
  wasHoisted: boolean
  isRootNode: boolean
  oldSize: number,
  newSize: number,
  edges: ({
    isDiff: false,
    reasons: number[],
    dependencies: number[]
  }) | ({
    isDiff: true,
    reasons: DiffEdgeInfo[],
    dependencies: DiffEdgeInfo[]
  })
}) {
  if (data.baselineGraph) {
    const oldGraphNode = data.baselineGraph[nodeName];
    const newGraphNode = data.graph[nodeName];
    const nodeId = getNodeId(oldGraphNode?.id, newGraphNode?.id);

    const isRemoved: boolean = !!(oldGraphNode && !newGraphNode);
    const isNewlyAdded: boolean = !!(!oldGraphNode && newGraphNode);


    return {
      nodeId, isRemoved, isNewlyAdded,
      wasHoisted: wasHoisted(oldGraphNode, fullGraph.baselineGraph!) || wasHoisted(newGraphNode, fullGraph.graph),
      isRootNode: oldGraphNode.parents.length == 0 || newGraphNode.parents.length == 0,
      oldSize: oldGraphNode.size,
      newSize: newGraphNode.size,
      edges: {
        isDiff: true,
        reasons: getDiffEdgeInfo(
          data.graph,
          newGraphNode, data.baselineGraph,
          oldGraphNode, getReasonChildren),
        dependencies: getDiffEdgeInfo(
          data.graph,
          newGraphNode, data.baselineGraph,
          oldGraphNode, getDependencies),
      },
    }
  } else {
    let node = data.graph[nodeName]
    return {
      nodeId: getNodeId(node.id, node.id),
      isNewlyAdded: false,
      isRemoved: false,
      wasHoisted: wasHoisted(node, fullGraph.graph),
      isRootNode: node.parents.length == 0,
      oldSize: node.size,
      newSize: node.size,
      edges: {
        isDiff: false,
        reasons: node.dependencies.map(
          nodeName => data.graph[nodeName].id
        ),
        dependencies: node.dependencies.map(
          nodeName => data.graph[nodeName].id
        ),
      }
    }
  }
}

export function buildGraphVisualization(
  filteredBundleStats: BundleStats,
  fullBundleStats: BundleStats,
): GeneratedGraphData {
  const allNodeNames = getNodeNames(filteredBundleStats)

  const nodes: (Vis.Node & Pick<Required<Vis.Node>, "id">)[] = [];
  const reasonChildrenEdges: Vis.Edge[] = [];
  const dependencyEdges: Vis.Edge[] = [];

  for (let nodeName of allNodeNames) {
    let labelStub: string = "";
    const [packageName, inPackagePath] = getPackageFromFilePath(nodeName);
    let { nodeId, isNewlyAdded, isRemoved, wasHoisted, isRootNode, oldSize, newSize, edges } = getNodeProps(
      filteredBundleStats,
      fullBundleStats,
      nodeName)

    let namespace = packageName.startsWith('@')
      ? packageName.slice(0, packageName.indexOf('/'))
      : undefined;

    let [nodeColor, secondNodeColor] = namespace != undefined
      ? [palette.getColorForName(namespace), palette.getColorForName(packageName)]
      : [palette.getColorForName(packageName), undefined]

    const isLight: boolean = new Color(nodeColor).hsl().object().l > 50;
    let borderColor = isLight ? "#000" : nodeColor;
    if (isNewlyAdded) {
      labelStub = "NEW";
      borderColor = BAD_COLOR;
    } else if (isRemoved) {
      labelStub = "REMOVED";
      borderColor = GOOD_COLOR;
    }

    if (wasHoisted) {
      labelStub = "*HOISTED*" + (labelStub.length ? " " : "") + labelStub;
    }

    if (isRootNode) {
      labelStub += " ROOT";
    }

    const nodeSize: string = oldSize == newSize
      ? formatByteSize(newSize)
      : formatByteSize(oldSize) + ", " + formatByteSizeChange(newSize - oldSize)

    const addedOrRemoved = isNewlyAdded || isRemoved;

    const node: Vis.Node & Pick<Required<Vis.Node>, "id"> = {
      id: nodeId,
      label: labelStub
        ? `${labelStub} ${packageName}/${inPackagePath} (${nodeSize})`
        : `${packageName}/${inPackagePath} (${nodeSize})`,
      title: "<div>AAAHHHH</div>",
      color: {
        background: nodeColor,
        border: secondNodeColor ?? borderColor,
        highlight: {
          background: nodeColor,
          border: secondNodeColor ?? borderColor,
        },
      },
      scaling: {
        max: 1000,
      },
      font: {
        size: addedOrRemoved || isRootNode ? 18 : 14,
      },
      margin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
      borderWidth: secondNodeColor ? 4 : addedOrRemoved || isRootNode ? 2 : 1,
    };

    if (isRootNode) {
      (node as any).shape = "diamond";
    } else {
      (node as any).font.color = isLight ? "#000" : "#FFF";
    }

    nodes.push(node);
    if (edges.isDiff) {
      for (let targetId of edges.reasons) {
        reasonChildrenEdges.push(diffEdge(
          nodeId,
          targetId,
        ))
      }
      for (let targetId of edges.dependencies) {
        dependencyEdges.push(diffEdge(
          nodeId,
          targetId,
        ))
      }
    } else {
      for (let targetId of edges.reasons) {
        reasonChildrenEdges.push(edgeFor(
          nodeId,
          getNodeId(targetId, targetId),
        ))
      }
      for (let targetId of edges.dependencies) {
        dependencyEdges.push(edgeFor(
          nodeId,
          getNodeId(targetId, targetId),
        ))
      }
    }
  }

  return { nodes, reasonChildrenEdges, dependencyEdges };
}
