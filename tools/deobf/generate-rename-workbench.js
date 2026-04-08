"use strict";

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const RESTORED_ROOT = path.join(PROJECT_ROOT, "restored", "start-scene");
const OUTPUT_ROOT = path.join(RESTORED_ROOT, "rename-workbench");
const ALIAS_MAP_PATH = path.join(RESTORED_ROOT, "module-alias-map.json");
const METHOD_INVENTORY_PATH = path.join(RESTORED_ROOT, "method-inventory.json");

const DEFAULT_MODULES = [
  "chunks:///_virtual/GameModel2.ts",
  "chunks:///_virtual/GameCtl.ts",
  "chunks:///_virtual/Game.ts",
  "chunks:///_virtual/HomeScene.ts",
  "chunks:///_virtual/DuckController.ts",
  "chunks:///_virtual/BookPigeonPanelView.ts",
  "chunks:///_virtual/itemPigeonNode.ts",
];

/**
 * Parse CLI args.
 * --all: generate workbench for all restored modules.
 * --modules=a,b,c: generate workbench for selected modules.
 * --clean: remove existing workbench files before writing.
 * @returns {{exportAll:boolean, explicitModules:string[], clean:boolean}}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let exportAll = false;
  let explicitModules = [];
  let clean = false;

  for (const arg of args) {
    if (arg === "--all") {
      exportAll = true;
      continue;
    }
    if (arg === "--clean") {
      clean = true;
      continue;
    }
    if (arg.startsWith("--modules=")) {
      const value = arg.slice("--modules=".length).trim();
      if (value.length > 0) {
        explicitModules = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
  }

  return { exportAll, explicitModules, clean };
}

/**
 * Ensure directory exists.
 * @param {string} dirPath
 */
function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Write file only when content changed.
 * @param {string} filePath
 * @param {string} content
 * @returns {boolean}
 */
function writeFileIfChanged(filePath, content) {
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, "utf8");
    if (current === content) {
      return false;
    }
  }
  fs.writeFileSync(filePath, content, "utf8");
  return true;
}

/**
 * Convert module id to restored filename.
 * @param {string} moduleId
 * @returns {string}
 */
function toRestoredFilename(moduleId) {
  return (
    moduleId
      .replace(/^chunks:\/\/\/_virtual\//, "")
      .replace(/[\/\\]+/g, "__")
      .replace(/[^a-zA-Z0-9_.-]/g, "_") + ".restored.js"
  );
}

/**
 * Convert module id to workbench filename.
 * @param {string} moduleId
 * @returns {string}
 */
function toWorkbenchFilename(moduleId) {
  return (
    moduleId
      .replace(/^chunks:\/\/\/_virtual\//, "")
      .replace(/[\/\\]+/g, "__")
      .replace(/[^a-zA-Z0-9_.-]/g, "_") + ".workbench.json"
  );
}

/**
 * Extract module id from restored file header.
 * @param {string} content
 * @returns {string|null}
 */
function extractModuleId(content) {
  const match = content.match(/Restored module:\s*([^\n]+)/);
  return match ? match[1].trim() : null;
}

/**
 * Extract runtime class name from _RF.push(..., "ClassName", ...).
 * @param {string} content
 * @returns {string|null}
 */
function extractRuntimeClassName(content) {
  const match = content.match(/_RF\.push\([^)]*,"([^"]+)",void 0\)/);
  return match ? match[1] : null;
}

/**
 * Extract unique capture group matches.
 * @param {string} source
 * @param {RegExp} regex Must include one capture group.
 * @returns {string[]}
 */
function extractUniqueMatches(source, regex) {
  const values = new Set();
  let match = regex.exec(source);
  while (match) {
    values.add(match[1]);
    match = regex.exec(source);
  }
  return [...values].sort((a, b) => a.localeCompare(b));
}

/**
 * Extract this.* field assignments from code.
 * @param {string} source
 * @returns {string[]}
 */
function extractThisFields(source) {
  return extractUniqueMatches(source, /this\.([A-Za-z_$][\w$]*)\s*=/g);
}

/**
 * Extract descriptor keys from createClass descriptor blocks.
 * @param {string} source
 * @returns {string[]}
 */
function extractDescriptorKeys(source) {
  return extractUniqueMatches(source, /key:"([^"]+)"/g);
}

/**
 * Extract storage keys from local read/write helper calls.
 * @param {string} source
 * @returns {string[]}
 */
function extractStorageKeys(source) {
  const values = new Set();
  const regexes = [
    /loadFromLocal\(\s*"([^"]+)"/g,
    /saveToLocal\(\s*"([^"]+)"/g,
    /getStorageKey\(\s*"([^"]+)"/g,
    /localStorage\.setItem\(\s*"([^"]+)"/g,
    /localStorage\.getItem\(\s*"([^"]+)"/g,
  ];

  for (const regex of regexes) {
    let match = regex.exec(source);
    while (match) {
      values.add(match[1]);
      match = regex.exec(source);
    }
  }
  return [...values].sort((a, b) => a.localeCompare(b));
}

/**
 * Extract bundleLoad(bundle, path, ...) calls.
 * @param {string} source
 * @returns {Array<{bundle:string,path:string}>}
 */
function extractBundleLoads(source) {
  const regex = /bundleLoad\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g;
  const seen = new Set();
  const rows = [];
  let match = regex.exec(source);
  while (match) {
    const bundleName = match[1];
    const bundlePath = match[2];
    const key = `${bundleName}::${bundlePath}`;
    if (!seen.has(key)) {
      seen.add(key);
      rows.push({
        bundle: bundleName,
        path: bundlePath,
      });
    }
    match = regex.exec(source);
  }

  rows.sort((a, b) => {
    if (a.bundle === b.bundle) {
      return a.path.localeCompare(b.path);
    }
    return a.bundle.localeCompare(b.bundle);
  });
  return rows;
}

/**
 * Extract bundleLoad(bundle, dynamicPathExpr, ...) calls.
 * @param {string} source
 * @returns {Array<{bundle:string,pathExpr:string}>}
 */
function extractDynamicBundleLoads(source) {
  const regex = /bundleLoad\(\s*"([^"]+)"\s*,\s*([A-Za-z_$][\w$]*)/g;
  const seen = new Set();
  const rows = [];
  let match = regex.exec(source);
  while (match) {
    const bundleName = match[1];
    const pathExpr = match[2];
    const key = `${bundleName}::${pathExpr}`;
    if (!seen.has(key)) {
      seen.add(key);
      rows.push({
        bundle: bundleName,
        pathExpr,
      });
    }
    match = regex.exec(source);
  }

  rows.sort((a, b) => {
    if (a.bundle === b.bundle) {
      return a.pathExpr.localeCompare(b.pathExpr);
    }
    return a.bundle.localeCompare(b.bundle);
  });
  return rows;
}

/**
 * Extract quoted resource path literals such as "tex/*" and "prefab/*".
 * @param {string} source
 * @returns {string[]}
 */
function extractPathLiterals(source) {
  const values = new Set();
  const regex = /"((?:tex|prefab)\/[^"]+)"/g;
  let match = regex.exec(source);
  while (match) {
    values.add(match[1]);
    match = regex.exec(source);
  }
  return [...values].sort((a, b) => a.localeCompare(b));
}

/**
 * Extract legacy-path findings useful for runtime compatibility checks.
 * @param {string[]} pathCandidates
 * @returns {{legacyHomePaths:string[], legacyUiPigeonSkinPaths:string[], legacyUiPigeonSkinDynamicPrefixes:string[]}}
 */
function extractLegacyPathFindings(pathCandidates) {
  const legacyHomePaths = [];
  const legacyUiPigeonSkinPaths = [];
  const legacyUiPigeonSkinDynamicPrefixes = [];

  for (const pathValue of pathCandidates) {
    if (/^tex\/BgThings\d+\//.test(pathValue)) {
      legacyHomePaths.push(pathValue);
    }

    if (/^tex\/book\/鸽鸽图鉴\/皮肤图鉴\/p(10|[1-9])(\/.*)?$/.test(pathValue)) {
      legacyUiPigeonSkinPaths.push(pathValue);
    }

    if (pathValue === "tex/book/鸽鸽图鉴/皮肤图鉴/p") {
      legacyUiPigeonSkinDynamicPrefixes.push(pathValue);
    }
  }

  legacyHomePaths.sort((a, b) => a.localeCompare(b));
  legacyUiPigeonSkinPaths.sort((a, b) => a.localeCompare(b));
  legacyUiPigeonSkinDynamicPrefixes.sort((a, b) => a.localeCompare(b));

  return {
    legacyHomePaths,
    legacyUiPigeonSkinPaths,
    legacyUiPigeonSkinDynamicPrefixes,
  };
}

/**
 * Extract all restored module files.
 * @returns {Array<{moduleId:string, restoredPath:string}>}
 */
function collectRestoredModules() {
  const files = fs
    .readdirSync(RESTORED_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".restored.js"))
    .map((entry) => path.join(RESTORED_ROOT, entry.name))
    .sort();

  const rows = [];
  for (const restoredPath of files) {
    const content = fs.readFileSync(restoredPath, "utf8");
    const moduleId = extractModuleId(content);
    if (!moduleId) {
      continue;
    }
    rows.push({
      moduleId,
      restoredPath,
    });
  }
  return rows;
}

/**
 * Build markdown summary for generated workbench rows.
 * @param {Array<object>} rows
 * @returns {string}
 */
function buildSummaryMarkdown(rows) {
  const lines = [];
  lines.push("# rename workbench");
  lines.push("");
  lines.push(`模块数：${rows.length}`);
  lines.push("");
  lines.push("| 模块 | 类名 | 原型方法数 | 描述符键数 | this 字段数 | 存储键数 | bundle 路径数 |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: |");

  for (const row of rows) {
    lines.push(
      `| ${row.moduleId} | ${row.runtimeClassName || "-"} | ${row.prototypeMethodCount} | ${row.descriptorKeyCount} | ${row.thisFieldCount} | ${row.storageKeyCount} | ${row.bundleLoadCount} |`
    );
  }

  lines.push("");
  lines.push("## 命名优先级建议（方法数前 12）");
  lines.push("");

  const topRows = [...rows]
    .sort((a, b) => b.prototypeMethodCount - a.prototypeMethodCount)
    .slice(0, 12);

  for (const row of topRows) {
    lines.push(`### ${row.moduleId}`);
    lines.push("");
    lines.push(`- 类名：${row.runtimeClassName || "-"}`);
    lines.push(`- 原型方法：${row.prototypeMethodCount}`);
    lines.push(`- 描述符键：${row.descriptorKeyCount}`);
    lines.push(`- this 字段：${row.thisFieldCount}`);
    lines.push(`- 存储键：${row.storageKeyCount}`);
    lines.push(`- bundle 路径：${row.bundleLoadCount}`);
    lines.push(`- workbench 文件：${row.workbenchFile}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

/**
 * Remove existing workbench files.
 * @returns {number}
 */
function cleanOutput() {
  if (!fs.existsSync(OUTPUT_ROOT)) {
    return 0;
  }
  const files = fs
    .readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".workbench.json"))
    .map((entry) => path.join(OUTPUT_ROOT, entry.name));
  for (const filePath of files) {
    fs.unlinkSync(filePath);
  }
  return files.length;
}

function main() {
  if (!fs.existsSync(RESTORED_ROOT)) {
    throw new Error("restored/start-scene does not exist. Run extraction first.");
  }

  const { exportAll, explicitModules, clean } = parseArgs();
  const restoredModules = collectRestoredModules();
  const restoredModuleMap = new Map();
  for (const row of restoredModules) {
    restoredModuleMap.set(row.moduleId, row.restoredPath);
  }

  const aliasRows = fs.existsSync(ALIAS_MAP_PATH)
    ? JSON.parse(fs.readFileSync(ALIAS_MAP_PATH, "utf8"))
    : [];
  const aliasMapByModule = new Map(aliasRows.map((row) => [row.moduleId, row.aliasMap || {}]));

  const inventoryRows = fs.existsSync(METHOD_INVENTORY_PATH)
    ? JSON.parse(fs.readFileSync(METHOD_INVENTORY_PATH, "utf8"))
    : [];
  const inventoryByModule = new Map(inventoryRows.map((row) => [row.moduleId, row]));

  const allModuleIds = restoredModules.map((row) => row.moduleId);
  const targetModuleSet = new Set(
    exportAll
      ? allModuleIds
      : explicitModules.length > 0
      ? explicitModules
      : DEFAULT_MODULES
  );

  ensureDir(OUTPUT_ROOT);
  const cleanedFileCount = clean ? cleanOutput() : 0;

  const outputRows = [];
  const missingModules = [];
  let changedWorkbenchFiles = 0;

  for (const moduleId of targetModuleSet) {
    const restoredPath = restoredModuleMap.get(moduleId);
    if (!restoredPath) {
      missingModules.push(moduleId);
      continue;
    }

    const source = fs.readFileSync(restoredPath, "utf8");
    const runtimeClassName = extractRuntimeClassName(source);
    const thisFields = extractThisFields(source);
    const descriptorKeysFromSource = extractDescriptorKeys(source);
    const storageKeys = extractStorageKeys(source);
    const bundleLoads = extractBundleLoads(source);
    const dynamicBundleLoads = extractDynamicBundleLoads(source);
    const pathLiterals = extractPathLiterals(source);
    const allPathCandidates = new Set(pathLiterals);
    for (const row of bundleLoads) {
      allPathCandidates.add(row.path);
    }
    const legacyPaths = extractLegacyPathFindings([...allPathCandidates]);

    const inventoryRow = inventoryByModule.get(moduleId) || null;
    const prototypeMethods = inventoryRow ? inventoryRow.prototypeMethods || [] : [];
    const descriptorKeys = inventoryRow
      ? inventoryRow.descriptorKeys || []
      : descriptorKeysFromSource;

    const aliasMap = aliasMapByModule.get(moduleId) || {};
    const aliasEntries = Object.entries(aliasMap).sort(([a], [b]) => a.localeCompare(b));

    const workbench = {
      moduleId,
      runtimeClassName,
      restoredFile: path.relative(PROJECT_ROOT, restoredPath),
      aliasMap,
      methodInventory: {
        prototypeMethodCount: prototypeMethods.length,
        descriptorKeyCount: descriptorKeys.length,
        prototypeMethods,
        descriptorKeys,
      },
      signals: {
        thisFields,
        storageKeys,
        bundleLoads,
        dynamicBundleLoads,
        pathLiterals,
        legacyPaths,
      },
      renameHints: {
        aliasHints: aliasEntries.map(([alias, semanticName]) => ({
          from: alias,
          to: semanticName,
          confidence: "high",
          source: "setters import alias",
        })),
      },
    };

    const workbenchFilename = toWorkbenchFilename(moduleId);
    const workbenchPath = path.join(OUTPUT_ROOT, workbenchFilename);
    if (writeFileIfChanged(workbenchPath, `${JSON.stringify(workbench, null, 2)}\n`)) {
      changedWorkbenchFiles += 1;
    }

    outputRows.push({
      moduleId,
      runtimeClassName,
      prototypeMethodCount: prototypeMethods.length,
      descriptorKeyCount: descriptorKeys.length,
      thisFieldCount: thisFields.length,
      storageKeyCount: storageKeys.length,
      bundleLoadCount: bundleLoads.length,
      workbenchFile: path.relative(PROJECT_ROOT, workbenchPath),
    });
  }

  outputRows.sort((a, b) => a.moduleId.localeCompare(b.moduleId));

  const summaryIndexPath = path.join(OUTPUT_ROOT, "rename-workbench-index.json");
  const summaryMarkdownPath = path.join(OUTPUT_ROOT, "rename-workbench.md");

  const indexChanged = writeFileIfChanged(summaryIndexPath, `${JSON.stringify(outputRows, null, 2)}\n`);
  const markdownChanged = writeFileIfChanged(summaryMarkdownPath, buildSummaryMarkdown(outputRows));

  const summary = {
    selectedModules: targetModuleSet.size,
    generatedModules: outputRows.length,
    changedWorkbenchFiles,
    cleanedFileCount,
    indexChanged,
    markdownChanged,
    cleanMode: clean,
    outputRoot: path.relative(PROJECT_ROOT, OUTPUT_ROOT),
    missingModules,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
