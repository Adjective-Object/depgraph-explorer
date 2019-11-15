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
const statsJson = JSON.parse(
  fs.readFileSync(path.join(exampleDataDir, "bonsai-stats.json"), "utf-8")
);
const bundleData = deriveBundleData(statsJson);

console.log("adding children");
const graphWithChildren = getModuleGraphWithChildren(bundleData.graph);
const graphWithChildrenAndReasons = getModuleGraphWithReasons(
  graphWithChildren,
  statsJson
);

const distDir = path.join(__dirname, "..", "public");
const outFilePath = path.join(distDir, "stats.json");
const fileContent = JSON.stringify(
  {
    baselineGraph: graphWithChildrenAndReasons,
    pullRequestGraph: graphWithChildrenAndReasons
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
