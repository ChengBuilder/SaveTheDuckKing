"use strict";

const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const parser = require("@babel/parser");

const PARSE_OPTIONS = {
  sourceType: "script",
  allowReturnOutsideFunction: true,
  errorRecovery: true,
  plugins: [
    "asyncGenerators",
    "classProperties",
    "classPrivateMethods",
    "classPrivateProperties",
    "dynamicImport",
    "nullishCoalescingOperator",
    "numericSeparator",
    "objectRestSpread",
    "optionalCatchBinding",
    "optionalChaining",
    "topLevelAwait"
  ]
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text);
}

function withTrailingNewline(text) {
  return text.endsWith("\n") ? text : text + "\n";
}

async function formatJavaScript(source, filePath) {
  try {
    const formatted = await prettier.format(source, {
      filepath: filePath,
      parser: "babel",
      printWidth: 100,
      singleQuote: true,
      trailingComma: "none"
    });
    return withTrailingNewline(formatted);
  } catch (error) {
    const fallback = withTrailingNewline(source);
    return (
      `/* prettier fallback: ${String(error && error.message ? error.message : error)} */\n` +
      fallback
    );
  }
}

function parseJavaScript(source, sourceFilename) {
  return parser.parse(source, {
    ...PARSE_OPTIONS,
    sourceFilename
  });
}

function walkAst(rootNode, visitor) {
  const stack = [rootNode];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    if (Array.isArray(current)) {
      for (let index = current.length - 1; index >= 0; index -= 1) {
        stack.push(current[index]);
      }
      continue;
    }

    if (typeof current.type === "string") {
      visitor(current);
    }

    for (const key of Object.keys(current)) {
      if (
        key === "loc" ||
        key === "start" ||
        key === "end" ||
        key === "extra" ||
        key === "errors" ||
        key === "leadingComments" ||
        key === "innerComments" ||
        key === "trailingComments"
      ) {
        continue;
      }

      const value = current[key];
      if (!value || typeof value !== "object") {
        continue;
      }

      if (Array.isArray(value)) {
        for (let index = value.length - 1; index >= 0; index -= 1) {
          stack.push(value[index]);
        }
        continue;
      }

      stack.push(value);
    }
  }
}

function getStringLiteralValue(node) {
  if (!node) {
    return null;
  }
  if (node.type === "StringLiteral") {
    return node.value;
  }
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }
  return null;
}

function isDefineCall(node) {
  return (
    node &&
    node.type === "CallExpression" &&
    node.callee &&
    node.callee.type === "Identifier" &&
    node.callee.name === "define"
  );
}

function isSystemRegisterCall(node) {
  return (
    node &&
    node.type === "CallExpression" &&
    node.callee &&
    node.callee.type === "MemberExpression" &&
    !node.callee.computed &&
    node.callee.object &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "System" &&
    node.callee.property &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "register"
  );
}

function extractFunctionBody(source, fnNode) {
  if (!fnNode || !fnNode.body) {
    return "";
  }

  return source.slice(fnNode.body.start + 1, fnNode.body.end - 1).trim() + "\n";
}

function normalizeModuleIdToPath(moduleId, forceJavaScriptExtension) {
  let normalized = String(moduleId || "").trim();
  normalized = normalized.replace(/^([a-zA-Z]+):\/+/, "$1_protocol/");
  normalized = normalized.replace(/^\/+/, "");

  let parts = normalized
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/[<>:"\\|?*\u0000-\u001f]/g, "_"));

  if (parts.length === 0) {
    parts = ["_root"];
  }

  let outputPath = path.join(...parts);
  if (forceJavaScriptExtension && path.extname(outputPath) !== ".js") {
    outputPath += ".js";
  }
  return outputPath;
}

function findDefineModules(bundleSource, sourceFilename) {
  const ast = parseJavaScript(bundleSource, sourceFilename);
  const modules = [];

  for (const statement of ast.program.body) {
    if (!statement || statement.type !== "ExpressionStatement") {
      continue;
    }

    const expression = statement.expression;
    if (!isDefineCall(expression)) {
      continue;
    }

    const moduleId = getStringLiteralValue(expression.arguments[0]);
    const factory = expression.arguments[1];
    if (!moduleId || !factory || !factory.body) {
      continue;
    }

    modules.push({
      id: moduleId,
      start: expression.start,
      end: expression.end,
      factory
    });
  }

  return modules;
}

function findSystemRegisterModules(source, sourceFilename) {
  const ast = parseJavaScript(source, sourceFilename);
  const modules = [];

  walkAst(ast.program, (node) => {
    if (!isSystemRegisterCall(node)) {
      return;
    }

    const moduleId = getStringLiteralValue(node.arguments[0]);
    if (!moduleId) {
      return;
    }

    modules.push({
      id: moduleId,
      start: node.start,
      end: node.end
    });
  });

  modules.sort((left, right) => left.start - right.start);
  return modules;
}

async function writeFormattedJavaScript(filePath, headerLines, source) {
  const header = Array.isArray(headerLines) && headerLines.length > 0 ? headerLines.join("\n") + "\n\n" : "";
  const formatted = await formatJavaScript(header + source, filePath);
  writeText(filePath, formatted);
}

async function prettifyRuntimeProject(runtimeDir) {
  const bundleFiles = listRuntimeBundleFiles(runtimeDir);
  for (const filePath of bundleFiles) {
    const source = fs.readFileSync(filePath, "utf8");
    const formatted = await formatJavaScript(source, filePath);
    fs.writeFileSync(filePath, formatted);
  }
}

function listRuntimeBundleFiles(runtimeDir) {
  const bundleFiles = [path.join(runtimeDir, "game.js")];
  const subpackagesDir = path.join(runtimeDir, "subpackages");

  if (!fs.existsSync(subpackagesDir)) {
    return bundleFiles;
  }

  for (const bundleName of fs.readdirSync(subpackagesDir)) {
    const filePath = path.join(subpackagesDir, bundleName, "game.js");
    if (fs.existsSync(filePath)) {
      bundleFiles.push(filePath);
    }
  }

  return bundleFiles;
}

function collectMetadataFiles(runtimeDir) {
  const files = [];
  const directFiles = ["app-config.json", "game.json", "project.config.json"];
  for (const name of directFiles) {
    const filePath = path.join(runtimeDir, name);
    if (fs.existsSync(filePath)) {
      files.push(filePath);
    }
  }

  const srcDir = path.join(runtimeDir, "src");
  if (fs.existsSync(srcDir)) {
    for (const entry of fs.readdirSync(srcDir)) {
      if (entry.endsWith(".json")) {
        files.push(path.join(srcDir, entry));
      }
    }
  }

  const subpackagesDir = path.join(runtimeDir, "subpackages");
  if (fs.existsSync(subpackagesDir)) {
    for (const bundleName of fs.readdirSync(subpackagesDir)) {
      const bundleDir = path.join(subpackagesDir, bundleName);
      if (!fs.statSync(bundleDir).isDirectory()) {
        continue;
      }

      for (const entry of fs.readdirSync(bundleDir)) {
        if (entry.endsWith(".json")) {
          files.push(path.join(bundleDir, entry));
        }
      }
    }
  }

  return files;
}

function buildReadableProjectReadme(summary) {
  const lines = [
    "# readable_project",
    "",
    "这份目录是从 `runnable_wechat_project/` 自动生成的可读化镜像。",
    "",
    "目标：",
    "",
    "- 保留小游戏可运行目录不变",
    "- 把主包和子包入口重新格式化",
    "- 把 `define(...)` 模块逐个拆出",
    "- 把模块内部的 `System.register(...)` 再拆成单文件，方便继续分析",
    "",
    "主要产物：",
    "",
    "- `summary.json`：整体统计",
    "- `metadata/`：运行配置和 bundle 配置",
    "- `__APP__/formatted-game.js`：主包排版后版本",
    "- `__APP__/define_modules/`：主包里的 `define(...)` 模块",
    "- `__APP__/system_register_modules/`：主包里识别到的 `System.register(...)` 模块",
    "- `subpackages/*/formatted-game.js`：各子包入口排版后版本",
    "",
    "说明：",
    "",
    "- 这里做的是发布产物级别的可读化，不是恢复原始 TypeScript 工程。",
    "- 模块名能恢复的地方已经按运行时模块名落盘，例如 `AdManager_WX.ts`、`LoadScene.ts` 一类名字。",
    "- 局部变量名如果在发布阶段已经被压缩成 `a/b/c`，这里只能做到按模块拆开和重新排版，无法无损恢复原始语义名。",
    "",
    `当前共整理 ${summary.bundleCount} 个 bundle。`
  ];

  return lines.join("\n") + "\n";
}

async function copyMetadata(runtimeDir, outputDir) {
  const metadataFiles = collectMetadataFiles(runtimeDir);
  for (const filePath of metadataFiles) {
    const relativePath = path.relative(runtimeDir, filePath);
    const outputPath = path.join(outputDir, "metadata", relativePath);
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    writeText(outputPath, JSON.stringify(json, null, 2) + "\n");
  }
}

async function generateReadableProject(runtimeDir, outputDir) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);

  await copyMetadata(runtimeDir, outputDir);

  const bundleFiles = listRuntimeBundleFiles(runtimeDir);
  const summary = {
    generatedAt: new Date().toISOString(),
    runtimeDir,
    outputDir,
    bundleCount: bundleFiles.length,
    bundles: []
  };

  for (const bundleFile of bundleFiles) {
    const bundleRelativePath = path.relative(runtimeDir, bundleFile);
    const bundleOutputKey =
      bundleRelativePath === "game.js"
        ? "__APP__"
        : bundleRelativePath.replace(new RegExp(`${path.sep}game\\.js$`), "");
    const bundleOutputDir = path.join(outputDir, bundleOutputKey);
    const source = fs.readFileSync(bundleFile, "utf8");
    const formattedBundlePath = path.join(bundleOutputDir, "formatted-game.js");

    writeText(formattedBundlePath, await formatJavaScript(source, formattedBundlePath));

    const defineModules = findDefineModules(source, bundleRelativePath);
    const moduleSummary = [];
    let systemRegisterModuleCount = 0;

    for (const defineModule of defineModules) {
      const moduleBody = extractFunctionBody(source, defineModule.factory);
      const defineOutputPath = path.join(
        bundleOutputDir,
        "define_modules",
        normalizeModuleIdToPath(defineModule.id, false)
      );

      await writeFormattedJavaScript(
        defineOutputPath,
        [
          "/**",
          ` * Extracted from ${bundleRelativePath}.`,
          ` * define("${defineModule.id}") body.`,
          " */"
        ],
        moduleBody
      );

      const systemModules = findSystemRegisterModules(
        moduleBody,
        `${bundleRelativePath}:${defineModule.id}`
      );
      const systemOutputs = [];

      for (const systemModule of systemModules) {
        const systemSource = moduleBody.slice(systemModule.start, systemModule.end);
        const systemOutputPath = path.join(
          bundleOutputDir,
          "system_register_modules",
          normalizeModuleIdToPath(systemModule.id, true)
        );

        await writeFormattedJavaScript(
          systemOutputPath,
          [
            "/**",
            ` * Extracted from ${bundleRelativePath}.`,
            ` * Parent define module: ${defineModule.id}`,
            ` * System.register("${systemModule.id}")`,
            " */"
          ],
          systemSource
        );

        systemOutputs.push(path.relative(bundleOutputDir, systemOutputPath));
      }

      systemRegisterModuleCount += systemModules.length;
      moduleSummary.push({
        id: defineModule.id,
        outputFile: path.relative(bundleOutputDir, defineOutputPath),
        systemRegisterModuleCount: systemModules.length,
        systemRegisterFiles: systemOutputs
      });
    }

    const bundleSummary = {
      bundleFile: bundleRelativePath,
      outputDir: path.relative(outputDir, bundleOutputDir),
      defineModuleCount: defineModules.length,
      systemRegisterModuleCount,
      modules: moduleSummary
    };

    writeText(path.join(bundleOutputDir, "bundle-summary.json"), JSON.stringify(bundleSummary, null, 2) + "\n");
    summary.bundles.push(bundleSummary);
  }

  writeText(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
  writeText(path.join(outputDir, "README.md"), buildReadableProjectReadme(summary));

  return summary;
}

module.exports = {
  generateReadableProject,
  prettifyRuntimeProject
};
