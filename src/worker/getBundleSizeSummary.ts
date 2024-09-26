import {
  BundleSizeSummary,
  BundleStats,
  SizeSummary,
} from "../reducers/schema";
import { getNodeNames } from "./buildGraphVisualization";
import { getPackageFromFilePath } from "./getPackageFromFilePath";

const uniq = <T>(a: T[]) => {
  return Array.from(new Set(a));
};

export const getBundleSizeSummary = (
  resultGraph: BundleStats,
): BundleSizeSummary => {
  const packages: { [key: string]: SizeSummary } = {};

  const allNodeNames = getNodeNames(resultGraph)

  const ensurePackage = (name: string) => {
    const [packageName] = getPackageFromFilePath(name);
    if (packages[packageName] === undefined) {
      packages[packageName] = {
        numFilesAfter: 0,
        numFilesDelta: 0,
        totalBytesAfter: 0,
        totalBytesDelta: 0,
      };
    }
    return packages[packageName];
  };

  if (resultGraph.baselineGraph) {
    for (let name of allNodeNames) {
      const currentPackage = ensurePackage(name);
      const oldGraphNode = resultGraph.baselineGraph[name];
      const newGraphNode = resultGraph.graph[name];
      if (oldGraphNode === undefined) {
        currentPackage.numFilesDelta += 1;
        currentPackage.totalBytesDelta += newGraphNode.size;
        currentPackage.totalBytesAfter += newGraphNode.size;
      } else if (newGraphNode === undefined) {
        currentPackage.numFilesDelta -= 1;
        currentPackage.numFilesAfter += 1;
        currentPackage.totalBytesDelta -= oldGraphNode.size;
      } else {
        currentPackage.numFilesAfter += 1;
        currentPackage.totalBytesDelta += newGraphNode.size - oldGraphNode.size;
        currentPackage.totalBytesAfter += newGraphNode.size;
      }
    }
  } else {
    for (let name of allNodeNames) {
      const currentPackage = ensurePackage(name);
      const node = resultGraph.graph[name];

      currentPackage.numFilesAfter += 1
      currentPackage.totalBytesAfter += node.size;
    }
  }

  const total: SizeSummary = {
    numFilesAfter: 0,
    numFilesDelta: 0,
    totalBytesAfter: 0,
    totalBytesDelta: 0,
  };

  for (let packageName in packages) {
    const currentPackage = packages[packageName];
    total.numFilesAfter += currentPackage.numFilesAfter;
    total.numFilesDelta += currentPackage.numFilesDelta;
    total.totalBytesAfter += currentPackage.totalBytesAfter;
    total.totalBytesDelta += currentPackage.totalBytesDelta;
  }

  return { packages, total };
};
