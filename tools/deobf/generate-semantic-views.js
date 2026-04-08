"use strict";

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const RESTORED_ROOT = path.join(PROJECT_ROOT, "restored", "start-scene");
const ALIAS_MAP_PATH = path.join(RESTORED_ROOT, "module-alias-map.json");
const OUTPUT_ROOT = path.join(RESTORED_ROOT, "semantic");

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
 * Parse CLI args.
 * --all: generate semantic view for all available modules.
 * --modules=a,b,c: generate semantic view for selected modules.
 * --clean: remove existing `*.semantic.js` before writing current selection.
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
 * Convert module id to restored file name.
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
 * Build semantic file name.
 * @param {string} moduleId
 * @returns {string}
 */
function toSemanticFilename(moduleId) {
  return (
    moduleId
      .replace(/^chunks:\/\/\/_virtual\//, "")
      .replace(/[\/\\]+/g, "__")
      .replace(/[^a-zA-Z0-9_.-]/g, "_") + ".semantic.js"
  );
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
 * Parse first outer-function var declaration aliases from System.register wrapper.
 * @param {string} source
 * @returns {{varStart:number,varEnd:number,varStatement:string,aliases:Set<string>}|null}
 */
function parseOuterVarAliases(source) {
  const functionStart = source.indexOf("(function(");
  if (functionStart < 0) {
    return null;
  }

  const braceStart = source.indexOf("{", functionStart);
  if (braceStart < 0) {
    return null;
  }

  const varKeywordIndex = source.indexOf("var ", braceStart);
  if (varKeywordIndex < 0) {
    return null;
  }

  const varEnd = source.indexOf(";", varKeywordIndex);
  if (varEnd < 0) {
    return null;
  }

  const varStatement = source.slice(varKeywordIndex + 4, varEnd);
  const aliases = new Set(
    varStatement
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

  return {
    varStart: varKeywordIndex,
    varEnd,
    varStatement,
    aliases,
  };
}

/**
 * Build annotated `var` statement:
 * `var t,n;` -> `var t [inheritsLoose], n [createClass];`
 *
 * @param {string} varStatement
 * @param {Record<string,string>} aliasMap
 * @returns {string}
 */
function buildAnnotatedVarStatement(varStatement, aliasMap) {
  return varStatement
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((alias) => {
      const semanticName = aliasMap[alias];
      if (!semanticName) {
        return alias;
      }
      return `${alias} /* ${semanticName} */`;
    })
    .join(", ");
}

/**
 * Escape regex special chars.
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Add inline semantic comments in `setters` assignment section.
 * Example: `t=e.inheritsLoose` -> `t=e.inheritsLoose [inheritsLoose]`
 *
 * @param {string} source
 * @param {Record<string,string>} aliasMap
 * @returns {string}
 */
function annotateSetterAssignments(source, aliasMap) {
  const setterBlockStart = source.indexOf("setters:[");
  const setterBlockEnd = source.indexOf("],execute:");
  if (setterBlockStart < 0 || setterBlockEnd < 0 || setterBlockEnd <= setterBlockStart) {
    return source;
  }

  let setterBlock = source.slice(setterBlockStart, setterBlockEnd);
  for (const [alias, semanticName] of Object.entries(aliasMap)) {
    const assignmentRegex = new RegExp(
      `\\b${escapeRegExp(alias)}\\s*=\\s*([a-zA-Z_$][\\w$]*\\.[a-zA-Z_$][\\w$]*)\\b`,
      "g"
    );

    setterBlock = setterBlock.replace(assignmentRegex, (fullMatch, rightExpr, offset, entire) => {
      const nextSlice = entire.slice(offset + fullMatch.length, offset + fullMatch.length + 32);
      if (nextSlice.includes(`/* ${semanticName} */`)) {
        return fullMatch;
      }
      return `${alias}=${rightExpr} /* ${semanticName} */`;
    });
  }

  return source.slice(0, setterBlockStart) + setterBlock + source.slice(setterBlockEnd);
}

/**
 * Count how many aliases are annotated in current module.
 * @param {Set<string>} moduleAliases
 * @param {Record<string,string>} aliasMap
 * @returns {number}
 */
function countAnnotatedAliases(moduleAliases, aliasMap) {
  let count = 0;
  for (const alias of moduleAliases) {
    if (aliasMap[alias]) {
      count += 1;
    }
  }
  return count;
}

/**
 * Create semantic view content from restored module content.
 * @param {string} moduleId
 * @param {string} source
 * @param {Record<string,string>} aliasMap
 * @returns {{content:string, annotatedAliasCount:number}}
 */
function buildSemanticView(moduleId, source, aliasMap) {
  const parsed = parseOuterVarAliases(source);
  if (!parsed) {
    return {
      content: source,
      annotatedAliasCount: 0,
    };
  }

  const sortedAliasEntries = Object.entries(aliasMap)
    .filter(([alias]) => parsed.aliases.has(alias))
    .sort(([a], [b]) => a.localeCompare(b));

  const annotatedVarStatement = buildAnnotatedVarStatement(parsed.varStatement, aliasMap);
  let code = source.slice(0, parsed.varStart) + `var ${annotatedVarStatement};` + source.slice(parsed.varEnd + 1);
  code = annotateSetterAssignments(code, aliasMap);

  const headerLines = [
    "/**",
    ` * Semantic view: ${moduleId}`,
    " * Source: restored/start-scene/*.restored.js",
    " * NOTE: safe readability annotations only (no identifier rewrite).",
    " * Alias annotations:",
  ];

  if (sortedAliasEntries.length === 0) {
    headerLines.push(" * - (none)");
  } else {
    for (const [alias, semanticName] of sortedAliasEntries) {
      headerLines.push(` * - ${alias} => ${semanticName}`);
    }
  }

  headerLines.push(" */", "");
  return {
    content: `${headerLines.join("\n")}${code}`,
    annotatedAliasCount: countAnnotatedAliases(parsed.aliases, aliasMap),
  };
}

/**
 * Remove existing semantic files before regeneration.
 * @returns {number}
 */
function cleanSemanticOutput() {
  ensureDir(OUTPUT_ROOT);
  const existing = fs
    .readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".semantic.js"))
    .map((entry) => path.join(OUTPUT_ROOT, entry.name));
  for (const filePath of existing) {
    fs.unlinkSync(filePath);
  }

  return existing.length;
}

function main() {
  if (!fs.existsSync(ALIAS_MAP_PATH)) {
    throw new Error(
      "Missing module-alias-map.json. Run tools/deobf/extract-start-scene-modules.js first."
    );
  }

  const { exportAll, explicitModules, clean } = parseArgs();
  const aliasRows = JSON.parse(fs.readFileSync(ALIAS_MAP_PATH, "utf8"));

  const allModuleIds = aliasRows.map((row) => row.moduleId);
  const targetModuleSet = new Set(
    exportAll
      ? allModuleIds
      : explicitModules.length > 0
      ? explicitModules
      : DEFAULT_MODULES
  );

  ensureDir(OUTPUT_ROOT);
  const cleanedFileCount = clean ? cleanSemanticOutput() : 0;

  const summaryRows = [];
  const missingModules = [];
  let changedSemanticFiles = 0;

  for (const moduleId of targetModuleSet) {
    const aliasRow = aliasRows.find((row) => row.moduleId === moduleId);
    if (!aliasRow) {
      missingModules.push(moduleId);
      continue;
    }

    const restoredFilename = toRestoredFilename(moduleId);
    const restoredPath = path.join(RESTORED_ROOT, restoredFilename);
    if (!fs.existsSync(restoredPath)) {
      missingModules.push(moduleId);
      continue;
    }

    const restoredContent = fs.readFileSync(restoredPath, "utf8");
    const { content, annotatedAliasCount } = buildSemanticView(
      moduleId,
      restoredContent,
      aliasRow.aliasMap || {}
    );

    const semanticFilename = toSemanticFilename(moduleId);
    const semanticPath = path.join(OUTPUT_ROOT, semanticFilename);
    if (writeFileIfChanged(semanticPath, `${content}\n`)) {
      changedSemanticFiles += 1;
    }

    summaryRows.push({
      moduleId,
      aliasCount: Object.keys(aliasRow.aliasMap || {}).length,
      annotatedAliasCount,
      restoredFile: path.relative(PROJECT_ROOT, restoredPath),
      semanticFile: path.relative(PROJECT_ROOT, semanticPath),
    });
  }

  const summaryPath = path.join(OUTPUT_ROOT, "semantic-index.json");
  const indexChanged = writeFileIfChanged(summaryPath, `${JSON.stringify(summaryRows, null, 2)}\n`);

  const summary = {
    selectedModules: targetModuleSet.size,
    generatedModules: summaryRows.length,
    changedSemanticFiles,
    cleanedFileCount,
    indexChanged,
    cleanMode: clean,
    outputRoot: path.relative(PROJECT_ROOT, OUTPUT_ROOT),
    missingModules,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
