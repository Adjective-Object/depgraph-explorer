import {
  BothBundleStats,
  BundleSizeSummary,
  SizeSummary
} from "../reducers/schema";
import { getPackageFromFilePath } from "./getPackageFromFilePath";

const uniq = <T>(a: T[]) => {
  return Array.from(new Set(a));
};

export const getBundleSizeSummary = (
  resultGraph: BothBundleStats
): BundleSizeSummary => {
  const packages: { [key: string]: SizeSummary } = {};

  const allNodeNames = uniq(
    Object.keys(resultGraph.baselineGraph).concat(
      Object.keys(resultGraph.pullRequestGraph)
    )
  );

  const ensurePackage = (name: string) => {
    const [packageName] = getPackageFromFilePath(name);
    if (packages[packageName] === undefined) {
      packages[packageName] = {
        numFilesAfter: 0,
        numFilesDelta: 0,
        totalBytesAfter: 0,
        totalBytesDelta: 0
      };
    }
    return packages[packageName];
  };

  for (let name of allNodeNames) {
    const oldGraphNode = resultGraph.baselineGraph[name];
    const newGraphNode = resultGraph.pullRequestGraph[name];
    const currentPackage = ensurePackage(name);
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

  const total: SizeSummary = {
    numFilesAfter: 0,
    numFilesDelta: 0,
    totalBytesAfter: 0,
    totalBytesDelta: 0
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
