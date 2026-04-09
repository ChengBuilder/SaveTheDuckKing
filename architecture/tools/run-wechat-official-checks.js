"use strict";

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const PROJECT_ROOT = process.cwd();
const DEFAULT_PORT = 14101;
const DEFAULT_AUTO_PORT = 14102;
const DEFAULT_CLI_CANDIDATES = [
  process.env.WECHAT_DEVTOOLS_CLI,
  "/Applications/wechatwebdevtools.app/Contents/MacOS/cli",
  "/Applications/微信开发者工具.app/Contents/MacOS/cli",
].filter(Boolean);

function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes("--fix");
  const skipCli = args.includes("--skip-cli");
  const skipGuardrails = args.includes("--skip-guardrails");
  const withMiniGameTestDoctor = args.includes("--with-minigame-test-doctor");
  const allowMissingTestSdk = args.includes("--allow-missing-test-sdk");
  const port = readNumericFlag(args, "--port", DEFAULT_PORT);
  const autoPort = readNumericFlag(args, "--auto-port", DEFAULT_AUTO_PORT);

  logSection("微信官方规范检查");
  console.log("projectRoot:", PROJECT_ROOT);

  if (shouldFix) {
    logSection("执行安全修复");
    runNodeScript("architecture/tools/format-project-json.js");
    runNodeScript("architecture/tools/generate-subpackage-structure-audit.js");
    runNodeScript("architecture/tools/generate-compatibility-mirror-audit.js");
  }

  const summary = validateProjectShape();

  logSection("执行代码包体检查");
  runNodeScript("architecture/tools/check-wechat-code-package-limits.js");

  if (!skipGuardrails) {
    logSection("执行仓库护栏");
    runNodeScript("architecture/tools/run-guardrails.js");
  }

  if (withMiniGameTestDoctor) {
    logSection("执行 MiniGameTest doctor");
    const doctorArgs = allowMissingTestSdk ? ["--allow-missing-sdk"] : [];
    runNodeScript("architecture/tools/run-minigame-test-doctor.js", doctorArgs);
  }

  if (!skipCli) {
    logSection("执行开发者工具 CLI 冒烟");
    const cliPath = resolveDevtoolsCliPath();
    if (!cliPath) {
      throw new Error(
        "未找到微信开发者工具 CLI。请安装开发者工具，或通过 WECHAT_DEVTOOLS_CLI 指定 cli 路径。"
      );
    }
    if (port === autoPort) {
      throw new Error("CLI 服务端口与自动化端口不能相同。请分别设置 --port 与 --auto-port。");
    }
    console.log("cliPath:", cliPath);
    runCommand(cliPath, ["islogin", "--port", String(port)]);
    runCommand(cliPath, [
      "auto",
      "--project",
      PROJECT_ROOT,
      "--port",
      String(port),
      "--auto-port",
      String(autoPort),
    ]);
  }

  logSection("检查结果");
  console.log(JSON.stringify(summary, null, 2));
  console.log("status: ok");
}

function validateProjectShape() {
  const requiredFiles = [
    "game.js",
    "game.json",
    "project.config.json",
    "architecture/boot/game-bootstrap.js",
    "architecture/boot/runtime-governance.js",
  ];

  for (const relativePath of requiredFiles) {
    assertExists(relativePath);
  }

  const projectConfig = readJson("project.config.json");
  const gameConfig = readJson("game.json");
  verifyRuntimeGovernanceBridge();

  if (projectConfig.compileType !== "game") {
    throw new Error("project.config.json 的 compileType 必须为 game。");
  }

  if (projectConfig.simulatorType && projectConfig.simulatorType !== "game") {
    throw new Error("project.config.json 的 simulatorType 应为 game。");
  }

  const subPackages = normalizeSubpackageList(gameConfig);
  if (subPackages.length === 0) {
    throw new Error("game.json 未配置 subpackages/subPackages。");
  }

  const seenNames = new Set();
  const seenRoots = new Set();
  for (const subPackage of subPackages) {
    if (!subPackage || typeof subPackage !== "object") {
      throw new Error("game.json 存在非法分包项。");
    }

    if (!subPackage.name || !subPackage.root) {
      throw new Error("game.json 的每个分包都必须包含 name 和 root。");
    }

    if (seenNames.has(subPackage.name)) {
      throw new Error("game.json 分包 name 重复: " + subPackage.name);
    }

    if (seenRoots.has(subPackage.root)) {
      throw new Error("game.json 分包 root 重复: " + subPackage.root);
    }

    seenNames.add(subPackage.name);
    seenRoots.add(subPackage.root);

    const normalizedRoot = stripTrailingSlash(subPackage.root);
    assertExists(normalizedRoot);
  }

  const appid = String(projectConfig.appid || "").trim();
  if (!appid) {
    throw new Error("project.config.json 缺少 appid。");
  }

  return {
    appid,
    compileType: projectConfig.compileType,
    simulatorType: projectConfig.simulatorType || null,
    subpackageCount: subPackages.length,
    subpackages: subPackages.map(function mapSubpackage(item) {
      return {
        name: item.name,
        root: item.root,
      };
    }),
  };
}

function verifyRuntimeGovernanceBridge() {
  const bootstrapPath = path.join(PROJECT_ROOT, "architecture/boot/game-bootstrap.js");
  const bootstrapContent = fs.readFileSync(bootstrapPath, "utf8");
  const bootstrapRequiredSnippets = [
    "require('./runtime-governance')",
    "installRuntimeGovernance(",
  ];

  for (const snippet of bootstrapRequiredSnippets) {
    if (!bootstrapContent.includes(snippet)) {
      throw new Error("game-bootstrap.js 缺少运行时治理桥接片段: " + snippet);
    }
  }

  const governancePath = path.join(PROJECT_ROOT, "architecture/boot/runtime-governance.js");
  const governanceContent = fs.readFileSync(governancePath, "utf8");
  const governanceRequiredSnippets = [
    "wx.getUpdateManager()",
    "onCheckForUpdate",
    "applyUpdate",
    "wx.onShow",
    "wx.onHide",
    "wx.onMemoryWarning",
  ];

  for (const snippet of governanceRequiredSnippets) {
    if (!governanceContent.includes(snippet)) {
      throw new Error("runtime-governance.js 缺少官方运行治理片段: " + snippet);
    }
  }
}

function normalizeSubpackageList(gameConfig) {
  const primaryList = Array.isArray(gameConfig.subpackages) ? gameConfig.subpackages : [];
  const legacyList = Array.isArray(gameConfig.subPackages) ? gameConfig.subPackages : [];

  if (primaryList.length > 0 && legacyList.length > 0) {
    const primaryJson = JSON.stringify(primaryList);
    const legacyJson = JSON.stringify(legacyList);
    if (primaryJson !== legacyJson) {
      throw new Error("game.json 的 subpackages 与 subPackages 不一致。");
    }
  }

  return primaryList.length > 0 ? primaryList : legacyList;
}

function resolveDevtoolsCliPath() {
  for (const candidatePath of DEFAULT_CLI_CANDIDATES) {
    if (candidatePath && fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }
  return null;
}

function runNodeScript(relativePath, extraArgs) {
  const args = [path.join(PROJECT_ROOT, relativePath)].concat(extraArgs || []);
  runCommand(process.execPath, args);
}

function runCommand(command, args) {
  const result = childProcess.spawnSync(command, args, {
    cwd: PROJECT_ROOT,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error(
      "命令执行失败: " + [command].concat(args).join(" ")
    );
  }
}

function readJson(relativePath) {
  const absolutePath = path.join(PROJECT_ROOT, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function assertExists(relativePath) {
  const absolutePath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error("缺少文件或目录: " + relativePath);
  }
}

function readNumericFlag(args, flagName, defaultValue) {
  const prefix = flagName + "=";
  const rawValue = args.find(function findArg(value) {
    return value.startsWith(prefix);
  });
  if (!rawValue) {
    return defaultValue;
  }
  const parsedValue = Number(rawValue.slice(prefix.length));
  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
}

function stripTrailingSlash(input) {
  return String(input || "").replace(/[\\/]+$/, "");
}

function logSection(title) {
  console.log("\n== " + title + " ==");
}

main();
