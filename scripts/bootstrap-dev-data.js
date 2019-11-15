#!/usr/bin/env node
//@ts-check
const fs = require("fs");
const path = require("path");
const deriveBundleData = require("webpack-bundle-diff").deriveBundleData;
const getModuleGraphWithChildren = require("webpack-bundle-diff-add-children")
  .getModuleGraphWithChildren;
const getModuleGraphWithReasons = require("webpack-bundle-diff-add-reasons")
  .getModuleGraphWithReasons;

console.log("reading example data");
const exampleDataDir = path.join(__dirname, "..", "example-data");
const baselineStatsJson = JSON.parse(
  fs.readFileSync(
    path.join(exampleDataDir, "bonsai-stats-baseline.json"),
    "utf-8"
  )
);
const prStatsJson = JSON.parse(
  fs.readFileSync(path.join(exampleDataDir, "bonsai-stats-pr.json"), "utf-8")
);
const baselineBundleData = deriveBundleData(baselineStatsJson);
const prBundleData = deriveBundleData(prStatsJson);

console.log("adding extra data");
const baselineGraph = getModuleGraphWithReasons(
  getModuleGraphWithChildren(baselineBundleData.graph),
  baselineStatsJson
);
const pullRequestGraph = getModuleGraphWithReasons(
  getModuleGraphWithChildren(prBundleData.graph),
  prStatsJson
);

const distDir = path.join(__dirname, "..", "public");
const outFilePath = path.join(distDir, "demo-stats.json");
const fileContent = JSON.stringify(
  {
    baselineGraph,
    pullRequestGraph
  },
  null,
  2
);

if (!fs.existsSync(distDir)) {
  console.log("making directory", distDir);
  fs.mkdirSync(distDir);
}
console.log("writing output to", outFilePath);
fs.writeFileSync(outFilePath, fileContent, "utf-8");
