"use strict";

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const runtimeDir = path.join(rootDir, "runnable_wechat_project");
const readableDir = path.join(rootDir, "readable_project");
const targetAppId = process.env.WECHAT_APPID || "wxf5df710b4d8b61af";

function assertExists(relativePath) {
  const fullPath = path.join(runtimeDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required path: ${relativePath}`);
  }
}

function main() {
  assertExists("game.js");
  assertExists("app-config.json");
  assertExists("game.json");
  assertExists("project.config.json");
  assertExists("src");
  assertExists("subpackages/main/game.js");
  assertExists("subpackages/DuckBundle/game.js");
  assertExists("subpackages/Game2Bundle/game.js");
  assertExists("subpackages/HomeBundle/game.js");
  assertExists("subpackages/aniBundle/game.js");
  assertExists("subpackages/audioBundle/game.js");
  assertExists("subpackages/resources/game.js");
  assertExists("subpackages/uiBundle/game.js");

  const appConfig = JSON.parse(
    fs.readFileSync(path.join(runtimeDir, "app-config.json"), "utf8")
  );
  const projectConfig = JSON.parse(
    fs.readFileSync(path.join(runtimeDir, "project.config.json"), "utf8")
  );
  if (projectConfig.appid !== targetAppId) {
    throw new Error(`Unexpected appid: ${projectConfig.appid}`);
  }
  for (const subPackage of appConfig.subPackages || []) {
    const rootPath = String(subPackage.root || "").replace(/^\/+/, "");
    if (!rootPath) {
      throw new Error(`Invalid subpackage root: ${JSON.stringify(subPackage)}`);
    }
    assertExists(rootPath);
  }

  let fileCount = 0;
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        fileCount += 1;
      }
    }
  };
  walk(runtimeDir);

  const readableSummaryPath = path.join(readableDir, "summary.json");
  if (!fs.existsSync(readableSummaryPath)) {
    throw new Error(`Missing readable summary: ${readableSummaryPath}`);
  }

  console.log("Runnable project validation passed.");
  console.log(
    JSON.stringify({ runtimeDir, readableDir, fileCount, appid: projectConfig.appid }, null, 2)
  );
}

main();
