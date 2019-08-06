#!/usr/bin/env node
//@ts-check
const fs = require("fs");
const path = require("path");
const getModuleGraphWithChildren = require("webpack-bundle-diff-add-children").getModuleGraphWithChildren;

console.log("reading example data");
const exampleDataDir = path.join(__dirname, "..", "example-data");
const baselineStats = JSON.parse(
  fs.readFileSync(
    path.join(exampleDataDir, "bundlestats-baseline.json"),
    "utf-8"
  )
);
const pullRequestStats = JSON.parse(
  fs.readFileSync(path.join(exampleDataDir, "bundlestats-pr.json"), "utf-8")
);

console.log("traversing dependencies");
const baselineGraph = getModuleGraphWithChildren(
  baselineStats.bundleData.graph
);
const pullRequestGraph = getModuleGraphWithChildren(
  pullRequestStats.bundleData.graph
);

const distDir = path.join(__dirname, "..", "public");
const outFilePath = path.join(distDir, "stats.json");
const fileContent = JSON.stringify({
  baselineGraph,
  pullRequestGraph
}, null, 2);

if (!fs.existsSync(distDir)) {
  console.log("making directory", distDir);
  fs.mkdirSync(distDir);
}
console.log("writing output to", outFilePath);
fs.writeFileSync(outFilePath, fileContent, "utf-8");
