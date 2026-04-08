"use strict";

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const RESTORED_ROOT = path.join(PROJECT_ROOT, "restored", "start-scene");
const OUTPUT_JSON = path.join(RESTORED_ROOT, "method-inventory.json");
const OUTPUT_MD = path.join(RESTORED_ROOT, "method-inventory.md");

/**
 * Extract module id from restored header comment.
 * @param {string} content
 * @returns {string|null}
 */
function extractModuleId(content) {
  const match = content.match(/Restored module:\s*([^\n]+)/);
  return match ? match[1].trim() : null;
}

/**
 * Extract runtime class debug name from _RF.push(..., "ClassName", ...).
 * @param {string} content
 * @returns {string|null}
 */
function extractRuntimeClassName(content) {
  const match = content.match(/_RF\.push\([^)]*,"([^"]+)",void 0\)/);
  return match ? match[1] : null;
}

/**
 * Extract prototype variable name from pattern: var x = SomeClass.prototype;
 * @param {string} content
 * @returns {string|null}
 */
function extractPrototypeAlias(content) {
  const match = content.match(/var\s+([a-zA-Z_$][\w$]*)\s*=\s*[a-zA-Z_$][\w$]*\.prototype\s*;/);
  return match ? match[1] : null;
}

/**
 * Extract prototype methods using alias pattern:
 * alias.methodName = function(...)
 * @param {string} content
 * @param {string|null} prototypeAlias
 * @returns {string[]}
 */
function extractPrototypeMethods(content, prototypeAlias) {
  if (!prototypeAlias) {
    return [];
  }

  const escapedAlias = prototypeAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escapedAlias}\\.([a-zA-Z_$][\\w$]*)\\s*=\\s*function\\b`, "g");

  const methods = new Set();
  let match = regex.exec(content);
  while (match) {
    methods.add(match[1]);
    match = regex.exec(content);
  }
  return [...methods].sort((a, b) => a.localeCompare(b));
}

/**
 * Extract property keys from createClass descriptors:
 * key:"someName"
 * @param {string} content
 * @returns {string[]}
 */
function extractDescriptorKeys(content) {
  const regex = /key:"([^"]+)"/g;
  const keys = new Set();
  let match = regex.exec(content);
  while (match) {
    keys.add(match[1]);
    match = regex.exec(content);
  }
  return [...keys].sort((a, b) => a.localeCompare(b));
}

/**
 * Build markdown report.
 * @param {Array<object>} rows
 * @returns {string}
 */
function buildMarkdown(rows) {
  const lines = [];
  lines.push("# start-scene 方法清单");
  lines.push("");
  lines.push(`总模块数：${rows.length}`);
  lines.push("");
  lines.push("| 模块 | 类名 | 原型方法数 | 描述符键数 |");
  lines.push("| --- | --- | ---: | ---: |");

  for (const row of rows) {
    lines.push(
      `| ${row.moduleId} | ${row.runtimeClassName || "-"} | ${row.prototypeMethods.length} | ${row.descriptorKeys.length} |`
    );
  }

  lines.push("");
  lines.push("## 重点模块方法（前 15）");
  lines.push("");

  const topRows = [...rows]
    .sort((a, b) => b.prototypeMethods.length - a.prototypeMethods.length)
    .slice(0, 15);

  for (const row of topRows) {
    lines.push(`### ${row.moduleId}`);
    lines.push("");
    lines.push(`- 类名：${row.runtimeClassName || "-"}`);
    lines.push(`- 原型方法（${row.prototypeMethods.length}）：`);
    lines.push(
      row.prototypeMethods.length > 0 ? row.prototypeMethods.join(", ") : "(none)"
    );
    lines.push(`- 描述符键（${row.descriptorKeys.length}）：`);
    lines.push(row.descriptorKeys.length > 0 ? row.descriptorKeys.join(", ") : "(none)");
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function main() {
  if (!fs.existsSync(RESTORED_ROOT)) {
    throw new Error("restored/start-scene does not exist. Run extraction first.");
  }

  const files = fs
    .readdirSync(RESTORED_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".restored.js"))
    .map((entry) => path.join(RESTORED_ROOT, entry.name))
    .sort();

  const rows = [];
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const moduleId = extractModuleId(content);
    if (!moduleId) {
      continue;
    }

    const runtimeClassName = extractRuntimeClassName(content);
    const prototypeAlias = extractPrototypeAlias(content);
    const prototypeMethods = extractPrototypeMethods(content, prototypeAlias);
    const descriptorKeys = extractDescriptorKeys(content);

    rows.push({
      moduleId,
      runtimeClassName,
      restoredFile: path.relative(PROJECT_ROOT, filePath),
      prototypeAlias,
      prototypeMethods,
      descriptorKeys,
    });
  }

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  fs.writeFileSync(OUTPUT_MD, buildMarkdown(rows), "utf8");

  console.log(
    JSON.stringify(
      {
        moduleCount: rows.length,
        outputJson: path.relative(PROJECT_ROOT, OUTPUT_JSON),
        outputMarkdown: path.relative(PROJECT_ROOT, OUTPUT_MD),
      },
      null,
      2
    )
  );
}

main();
