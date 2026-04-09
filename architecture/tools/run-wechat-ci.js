"use strict";

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, "wechat-ci-output");

async function main() {
  const command = process.argv[2] || "doctor";
  const projectConfig = readJson("project.config.json");
  const ciConfig = buildCiConfig(projectConfig);

  if (command === "doctor") {
    printDoctor(ciConfig);
    return;
  }

  const ci = loadCiModule();
  const project = new ci.Project({
    appid: ciConfig.appid,
    type: ciConfig.projectType,
    projectPath: ciConfig.projectPath,
    privateKeyPath: ciConfig.privateKeyPath,
    ignores: [],
  });

  if (command === "pack-npm") {
    const result = await ci.packNpm(project, {});
    printJson(result);
    return;
  }

  if (command === "preview") {
    ensureDirectory(path.dirname(ciConfig.qrcodeOutputDest));
    const result = await ci.preview({
      project: project,
      desc: ciConfig.desc,
      setting: ciConfig.setting,
      qrcodeFormat: "image",
      qrcodeOutputDest: ciConfig.qrcodeOutputDest,
      robot: ciConfig.robot,
      onProgressUpdate: createProgressLogger("preview"),
    });
    printJson(result);
    return;
  }

  if (command === "upload") {
    const result = await ci.upload({
      project: project,
      version: ciConfig.version,
      desc: ciConfig.desc,
      setting: ciConfig.setting,
      robot: ciConfig.robot,
      threads: ciConfig.threads,
      onProgressUpdate: createProgressLogger("upload"),
    });
    printJson(result);
    return;
  }

  throw new Error("不支持的命令: " + command);
}

function buildCiConfig(projectConfig) {
  const appid = String(process.env.WECHAT_CI_APPID || projectConfig.appid || "").trim();
  const projectPath = path.resolve(process.env.WECHAT_CI_PROJECT_PATH || PROJECT_ROOT);
  const compileSetting = projectConfig.setting || {};
  const privateKeyPath = path.resolve(
    process.env.WECHAT_CI_PRIVATE_KEY_PATH || path.join(PROJECT_ROOT, ".secrets", "wechat-ci-private.key")
  );

  return {
    appid: appid,
    projectPath: projectPath,
    projectType: inferProjectType(projectConfig),
    privateKeyPath: privateKeyPath,
    privateKeyExists: fs.existsSync(privateKeyPath),
    version: process.env.WECHAT_CI_VERSION || buildDefaultVersion(),
    desc: process.env.WECHAT_CI_DESC || "Automated by run-wechat-ci.js",
    robot: readOptionalNumber(process.env.WECHAT_CI_ROBOT),
    threads: readOptionalNumber(process.env.WECHAT_CI_THREADS),
    qrcodeOutputDest: path.resolve(
      process.env.WECHAT_CI_QR_OUTPUT || path.join(DEFAULT_OUTPUT_DIR, "preview.png")
    ),
    setting: {
      es6: Boolean(compileSetting.es6),
      es7: Boolean(compileSetting.enhance),
      minify: Boolean(compileSetting.minified),
      minifyWXML: Boolean(compileSetting.minifyWXML),
      minifyWXSS: Boolean(compileSetting.minifyWXSS),
    },
  };
}

function inferProjectType(projectConfig) {
  return projectConfig.compileType === "game" ? "miniGame" : "miniProgram";
}

function loadCiModule() {
  try {
    return require("miniprogram-ci");
  } catch (error) {
    throw new Error(
      "未安装 miniprogram-ci。请先执行 npm install，再运行 wechat:ci 脚本。原始错误: " + error.message
    );
  }
}

function printDoctor(ciConfig) {
  printJson({
    appid: ciConfig.appid,
    projectPath: ciConfig.projectPath,
    projectType: ciConfig.projectType,
    privateKeyPath: ciConfig.privateKeyPath,
    privateKeyExists: ciConfig.privateKeyExists,
    version: ciConfig.version,
    desc: ciConfig.desc,
    robot: ciConfig.robot,
    threads: ciConfig.threads,
    qrcodeOutputDest: ciConfig.qrcodeOutputDest,
    setting: ciConfig.setting,
    notes: [
      "preview/upload 需要代码上传密钥 privateKeyPath。",
      "miniprogram-ci 官方支持 miniGame 类型，可用于小游戏预览、上传、构建 npm。",
    ],
  });
}

function createProgressLogger(label) {
  return function onProgressUpdate(update) {
    const payload = Object.assign({ stage: label }, update || {});
    printJson(payload);
  };
}

function readJson(relativePath) {
  const absolutePath = path.join(PROJECT_ROOT, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function readOptionalNumber(value) {
  if (value === undefined || value === "") {
    return undefined;
  }
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function buildDefaultVersion() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return year + "." + month + "." + day + "-" + hours + minutes;
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

main().catch(function onError(error) {
  console.error(error.message);
  process.exitCode = 1;
});
