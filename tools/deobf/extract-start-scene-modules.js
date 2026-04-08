"use strict";

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const PACKED_GAME_PATH = path.join(PROJECT_ROOT, "game.js");
const OUTPUT_ROOT = path.join(PROJECT_ROOT, "restored", "start-scene");

const START_SCENE_DEFINE_TOKEN = 'define("assets/start-scene/index.start-scene.js"';
const START_SCENE_REGISTER_START_TOKEN = 'System.register("chunks:///_virtual/';
const START_SCENE_REGISTER_END_TOKEN = 't="virtual:///prerequisite-imports/start-scene"';

const DEFAULT_MODULES = [
  "chunks:///_virtual/GameModel2.ts",
  "chunks:///_virtual/GameCtrl.ts",
  "chunks:///_virtual/HomeScene.ts",
  "chunks:///_virtual/LoadScene.ts",
  "chunks:///_virtual/Game.ts",
  "chunks:///_virtual/DuckController.ts",
  "chunks:///_virtual/ResManager.ts",
  "chunks:///_virtual/AudioManager.ts",
  "chunks:///_virtual/Util.ts",
  "chunks:///_virtual/Wood.ts",
  "chunks:///_virtual/BookPanelView.ts",
  "chunks:///_virtual/BookPigeonPanelView.ts",
  "chunks:///_virtual/SetPanelView.ts",
  "chunks:///_virtual/SetBtnView.ts",
  "chunks:///_virtual/Set2UIPanelView.ts",
];

/**
 * Parse CLI arguments.
 * --all: export all modules from start-scene bundle.
 * --modules=a,b,c: export only listed module ids.
 * If no flags are passed, use DEFAULT_MODULES.
 * @returns {{exportAll:boolean, explicitModules:string[]}}
 */
function parseArgs() {
  const rawArgs = process.argv.slice(2);
  let exportAll = false;
  let explicitModules = [];

  for (const arg of rawArgs) {
    if (arg === "--all") {
      exportAll = true;
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

  return { exportAll, explicitModules };
}

/**
 * Build a stable filename for a module id.
 * @param {string} moduleId
 * @returns {string}
 */
function toOutputFilename(moduleId) {
  const normalized = moduleId
    .replace(/^chunks:\/\/\/_virtual\//, "")
    .replace(/[\/\\]+/g, "__")
    .replace(/[^a-zA-Z0-9_.-]/g, "_");
  return `${normalized}.restored.js`;
}

/**
 * Build a lightweight alias map from assignment patterns like:
 * var t,n; ... setters:[function(e){ t=e.applyDecoratedDescriptor, n=e.inheritsLoose }]
 *
 * We intentionally do not rewrite code, only expose readable alias mapping.
 * @param {string} moduleSnippet
 * @returns {Record<string, string>}
 */
function collectAliasMap(moduleSnippet) {
  const setterBlockStart = moduleSnippet.indexOf("setters:[");
  const setterBlockEnd = moduleSnippet.indexOf("],execute:");

  if (setterBlockStart < 0 || setterBlockEnd < 0 || setterBlockEnd <= setterBlockStart) {
    return {};
  }

  const setterBlock = moduleSnippet.slice(setterBlockStart, setterBlockEnd);
  const setterFunctionRegex = /function\(\s*([a-zA-Z_$][\w$]*)\s*\)\s*\{([\s\S]*?)\}/g;
  const scores = new Map();
  let setterMatch = setterFunctionRegex.exec(setterBlock);

  while (setterMatch) {
    const importAlias = setterMatch[1];
    const setterBody = setterMatch[2];
    const assignmentRegex = new RegExp(
      `\\b([a-zA-Z_$][\\w$]{0,2})\\s*=\\s*${importAlias}\\.([a-zA-Z_$][\\w$]*)\\b`,
      "g"
    );

    let assignmentMatch = assignmentRegex.exec(setterBody);
    while (assignmentMatch) {
      const alias = assignmentMatch[1];
      const semanticName = assignmentMatch[2];

      if (alias.length <= 2 && semanticName.length >= 3) {
        if (!scores.has(alias)) {
          scores.set(alias, new Map());
        }
        const aliasStats = scores.get(alias);
        aliasStats.set(semanticName, (aliasStats.get(semanticName) || 0) + 1);
      }
      assignmentMatch = assignmentRegex.exec(setterBody);
    }

    setterMatch = setterFunctionRegex.exec(setterBlock);
  }

  const aliasMap = {};
  for (const [alias, semanticMap] of scores.entries()) {
    let chosen = "";
    let maxCount = 0;
    for (const [semanticName, count] of semanticMap.entries()) {
      if (count > maxCount) {
        maxCount = count;
        chosen = semanticName;
      }
    }
    if (chosen) {
      aliasMap[alias] = chosen;
    }
  }

  return aliasMap;
}

/**
 * Extract all System.register modules from packed start-scene define section.
 * @param {string} packedGameContent
 * @returns {Array<{moduleId:string, snippet:string, aliasMap:Record<string,string>}>}
 */
function extractStartSceneModules(packedGameContent) {
  const defineStart = packedGameContent.indexOf(START_SCENE_DEFINE_TOKEN);
  if (defineStart < 0) {
    throw new Error("Cannot find start-scene define block in game.js");
  }

  const nextDefine = packedGameContent.indexOf('define("cocos-js/_virtual_cc-cf1p7Jgo.js"', defineStart);
  if (nextDefine < 0) {
    throw new Error("Cannot find end boundary after start-scene define block in game.js");
  }

  const startSceneDefineChunk = packedGameContent.slice(defineStart, nextDefine);
  const registerBodyStart = startSceneDefineChunk.indexOf(START_SCENE_REGISTER_START_TOKEN);
  if (registerBodyStart < 0) {
    throw new Error("Cannot find first System.register in start-scene define block");
  }

  const registerBodyEnd = startSceneDefineChunk.lastIndexOf(START_SCENE_REGISTER_END_TOKEN);
  if (registerBodyEnd < 0 || registerBodyEnd <= registerBodyStart) {
    throw new Error("Cannot find prerequisite register tail in start-scene define block");
  }

  const registerBody = startSceneDefineChunk.slice(registerBodyStart, registerBodyEnd);

  const moduleStartRegex = /System\.register\("([^"]+)"/g;
  const moduleMatches = [];
  let match = moduleStartRegex.exec(registerBody);
  while (match) {
    moduleMatches.push({
      moduleId: match[1],
      index: match.index,
    });
    match = moduleStartRegex.exec(registerBody);
  }

  const extracted = [];
  for (let i = 0; i < moduleMatches.length; i += 1) {
    const current = moduleMatches[i];
    const startIndex = current.index;
    const endIndex = i + 1 < moduleMatches.length ? moduleMatches[i + 1].index : registerBody.length;

    let snippet = registerBody.slice(startIndex, endIndex).trim();
    snippet = snippet.replace(/^,+\s*/, "").replace(/,\s*$/, "");

    const aliasMap = collectAliasMap(snippet);
    extracted.push({
      moduleId: current.moduleId,
      snippet,
      aliasMap,
    });
  }

  return extracted;
}

/**
 * Build a readable header for restored module files.
 * @param {string} moduleId
 * @param {Record<string, string>} aliasMap
 * @returns {string}
 */
function buildHeader(moduleId, aliasMap) {
  const aliasEntries = Object.entries(aliasMap).sort(([a], [b]) => a.localeCompare(b));
  const lines = [
    "/**",
    ` * Restored module: ${moduleId}`,
    " * Source: game.js -> assets/start-scene/index.start-scene.js",
    " * NOTE: this file is for readability/deobfuscation tracking only.",
  ];

  if (aliasEntries.length > 0) {
    lines.push(" * Alias hints:");
    for (const [alias, semanticName] of aliasEntries) {
      lines.push(` * - ${alias} => ${semanticName}`);
    }
  } else {
    lines.push(" * Alias hints: (none detected)");
  }

  lines.push(" */", "");
  return lines.join("\n");
}

/**
 * Add lightweight line breaks to reduce single-line minified pressure.
 * This formatter is intentionally conservative and keeps syntax intact.
 * @param {string} code
 * @returns {string}
 */
function formatSnippetForReadability(code) {
  let result = "";
  let mode = "normal";
  let escaped = false;

  const append = (char) => {
    result += char;
  };

  for (let i = 0; i < code.length; i += 1) {
    const char = code[i];
    const next = i + 1 < code.length ? code[i + 1] : "";

    if (mode === "line-comment") {
      append(char);
      if (char === "\n") {
        mode = "normal";
      }
      continue;
    }

    if (mode === "block-comment") {
      append(char);
      if (char === "*" && next === "/") {
        append(next);
        i += 1;
        mode = "normal";
      }
      continue;
    }

    if (mode === "single-quote") {
      append(char);
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "'") {
        mode = "normal";
      }
      continue;
    }

    if (mode === "double-quote") {
      append(char);
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        mode = "normal";
      }
      continue;
    }

    if (mode === "template") {
      append(char);
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "`") {
        mode = "normal";
      }
      continue;
    }

    if (char === "/" && next === "/") {
      append(char);
      append(next);
      i += 1;
      mode = "line-comment";
      continue;
    }

    if (char === "/" && next === "*") {
      append(char);
      append(next);
      i += 1;
      mode = "block-comment";
      continue;
    }

    if (char === "'") {
      append(char);
      mode = "single-quote";
      continue;
    }

    if (char === '"') {
      append(char);
      mode = "double-quote";
      continue;
    }

    if (char === "`") {
      append(char);
      mode = "template";
      continue;
    }

    append(char);

    if (char === ";" || char === "{" || char === "}") {
      append("\n");
      continue;
    }

    if (char === "," && next === "S") {
      const preview = code.slice(i + 1, i + 18);
      if (preview.startsWith("System.register(")) {
        append("\n");
      }
    }
  }

  return result
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Ensure directory exists.
 * @param {string} dirPath
 */
function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function main() {
  const { exportAll, explicitModules } = parseArgs();
  const packedGameContent = fs.readFileSync(PACKED_GAME_PATH, "utf8");
  const allModules = extractStartSceneModules(packedGameContent);

  const targetModuleSet = new Set(
    exportAll
      ? allModules.map((item) => item.moduleId)
      : explicitModules.length > 0
      ? explicitModules
      : DEFAULT_MODULES
  );

  const selectedModules = allModules.filter((item) => targetModuleSet.has(item.moduleId));
  const missingModules = [...targetModuleSet].filter(
    (moduleId) => !allModules.some((item) => item.moduleId === moduleId)
  );

  ensureDir(OUTPUT_ROOT);

  const existingRestoredFiles = fs
    .readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".restored.js"))
    .map((entry) => path.join(OUTPUT_ROOT, entry.name));
  for (const filePath of existingRestoredFiles) {
    fs.unlinkSync(filePath);
  }

  const indexRecords = [];
  for (const item of allModules) {
    const selected = targetModuleSet.has(item.moduleId);
    const outputFilename = toOutputFilename(item.moduleId);
    const outputPath = path.join(OUTPUT_ROOT, outputFilename);

    if (selected) {
      const header = buildHeader(item.moduleId, item.aliasMap);
      const formattedSnippet = formatSnippetForReadability(item.snippet);
      const content = `${header}${formattedSnippet}\n`;
      fs.writeFileSync(outputPath, content, "utf8");
    }

    indexRecords.push({
      moduleId: item.moduleId,
      selected,
      aliasCount: Object.keys(item.aliasMap).length,
      outputFile: selected ? path.relative(PROJECT_ROOT, outputPath) : null,
    });
  }

  const indexPath = path.join(OUTPUT_ROOT, "module-index.json");
  const aliasPath = path.join(OUTPUT_ROOT, "module-alias-map.json");

  fs.writeFileSync(indexPath, `${JSON.stringify(indexRecords, null, 2)}\n`, "utf8");

  const aliasReport = selectedModules.map((item) => ({
    moduleId: item.moduleId,
    aliasMap: item.aliasMap,
  }));
  fs.writeFileSync(aliasPath, `${JSON.stringify(aliasReport, null, 2)}\n`, "utf8");

  const summary = {
    totalModules: allModules.length,
    selectedModules: selectedModules.length,
    outputRoot: path.relative(PROJECT_ROOT, OUTPUT_ROOT),
    missingModules,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
