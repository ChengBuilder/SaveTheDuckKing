'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 运行安全校验入口。
 * 目标：在每次迭代后快速确认不会引入“明显不可运行”风险。
 */
function verifyRuntimeSafety() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const gamePath = path.join(projectRoot, 'game.js');
  const bootPath = path.join(projectRoot, 'architecture', 'boot', 'game-bootstrap.js');
  const bootSafetyPath = path.join(projectRoot, 'architecture', 'boot', 'boot-safety.js');
  const bootObserverPath = path.join(projectRoot, 'architecture', 'boot', 'boot-observer.js');
  const runtimeGovernancePath = path.join(projectRoot, 'architecture', 'boot', 'runtime-governance.js');
  const globalContextPath = path.join(projectRoot, 'architecture', 'boot', 'global-context.js');
  const bootLoggerPath = path.join(projectRoot, 'architecture', 'boot', 'boot-logger.js');
  const platformStrategyPath = path.join(projectRoot, 'architecture', 'boot', 'platform-strategy.js');
  const performanceStrategyPath = path.join(projectRoot, 'architecture', 'boot', 'performance-strategy.js');

  const errors = [];

  assertFileExists(gamePath, errors, '缺少主入口 game.js');
  assertFileExists(bootPath, errors, '缺少可维护启动入口 game-bootstrap.js');
  assertFileExists(bootSafetyPath, errors, '缺少启动安全模块 boot-safety.js');
  assertFileExists(bootObserverPath, errors, '缺少启动观测模块 boot-observer.js');
  assertFileExists(runtimeGovernancePath, errors, '缺少运行时治理模块 runtime-governance.js');
  assertFileExists(globalContextPath, errors, '缺少运行时上下文模块 global-context.js');
  assertFileExists(bootLoggerPath, errors, '缺少启动日志模块 boot-logger.js');
  assertFileExists(platformStrategyPath, errors, '缺少平台策略模块 platform-strategy.js');
  assertFileExists(performanceStrategyPath, errors, '缺少性能策略模块 performance-strategy.js');

  if (errors.length === 0) {
    const gameSource = fs.readFileSync(gamePath, 'utf8');
    verifyGameBridge(projectRoot, gameSource, errors);
  }

  if (errors.length === 0) {
    verifyBootExport(bootPath, errors);
  }

  if (errors.length > 0) {
    console.error('[verify-runtime-safety] 失败：');
    for (const error of errors) {
      console.error('- ' + error);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[verify-runtime-safety] 通过');
}

/**
 * 校验文件是否存在。
 * @param {string} filePath 目标文件路径
 * @param {string[]} errors 错误收集器
 * @param {string} message 失败提示
 */
function assertFileExists(filePath, errors, message) {
  if (!fs.existsSync(filePath)) {
    errors.push(message + ': ' + filePath);
  }
}

/**
 * 校验 game.js 是否仍然通过可维护入口桥接。
 * @param {string} projectRoot 项目根目录
 * @param {string} source game.js 文本
 * @param {string[]} errors 错误收集器
 */
function verifyGameBridge(projectRoot, source, errors) {
  if (isSplitEntryMode(source)) {
    verifySplitGameBridge(projectRoot, source, errors);
    return;
  }

  const requiredSnippets = [
    'define("game.js", function(require, module, exports){',
    'require("./architecture/boot/game-bootstrap.js")',
    'bootModule.bootGameRuntime(require)',
    'define("subpackages-bootstrap.js", function(require, module, exports){'
  ];

  for (const snippet of requiredSnippets) {
    if (!source.includes(snippet)) {
      errors.push('game.js 缺少关键桥接片段: ' + snippet);
    }
  }
}

/**
 * 判断 game.js 是否已切到“瘦入口 + 模块清单”模式。
 * @param {string} source game.js 文本
 * @returns {boolean}
 */
function isSplitEntryMode(source) {
  return source.includes('runtime/gamejs-modules/manifest.js');
}

/**
 * 校验拆分入口模式下的关键桥接是否完整。
 * @param {string} projectRoot 项目根目录
 * @param {string} source game.js 文本
 * @param {string[]} errors 错误收集器
 */
function verifySplitGameBridge(projectRoot, source, errors) {
  const requiredEntrySnippets = [
    'globalObject.requirePlugin = globalObject.requirePlugin || function(path) {',
    'require("./runtime/gamejs-modules/manifest.js")',
    'require("runtime/gamejs-modules/game.js")'
  ];

  for (const snippet of requiredEntrySnippets) {
    if (!source.includes(snippet)) {
      errors.push('拆分入口缺少关键桥接片段: ' + snippet);
    }
  }

  const manifestScriptPath = path.join(projectRoot, 'runtime', 'gamejs-modules', 'manifest.js');
  const manifestJsonPath = path.join(projectRoot, 'runtime', 'gamejs-modules', 'manifest.json');

  assertFileExists(manifestScriptPath, errors, '拆分入口缺少模块清单脚本');
  assertFileExists(manifestJsonPath, errors, '拆分入口缺少模块清单索引');

  if (errors.length > 0) {
    return;
  }

  let manifest = null;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));
  } catch (error) {
    errors.push('读取拆分入口 manifest 失败: ' + error.message);
    return;
  }

  if (!Array.isArray(manifest) || manifest.length === 0) {
    errors.push('拆分入口 manifest 为空或格式非法');
    return;
  }

  const moduleMap = new Map();
  for (const entry of manifest) {
    const moduleId = String(entry && entry.moduleId ? entry.moduleId : '');
    const filename = String(entry && entry.filename ? entry.filename : '');
    if (moduleId.length === 0 || filename.length === 0) {
      continue;
    }
    moduleMap.set(moduleId, filename);
  }

  if (!moduleMap.has('game.js')) {
    errors.push('拆分入口 manifest 缺少核心启动模块: game.js');
    return;
  }
  if (!moduleMap.has('subpackages-bootstrap.js')) {
    errors.push('拆分入口 manifest 缺少核心启动模块: subpackages-bootstrap.js');
    return;
  }

  const gameModulePath = path.join(projectRoot, 'runtime', 'gamejs-modules', moduleMap.get('game.js'));
  assertFileExists(gameModulePath, errors, '拆分入口缺少 game.js 模块文件');
  if (errors.length > 0) {
    return;
  }

  const gameModuleSource = fs.readFileSync(gameModulePath, 'utf8');
  const gameBootstrapSnippetCandidates = [
    'require("./architecture/boot/game-bootstrap.js")',
    'require("../../architecture/boot/game-bootstrap.js")'
  ];

  const assetRemapSnippetCandidates = [
    'require("./runtime/asset-file-remap.js").installAssetFileRemap()',
    'require("../../runtime/asset-file-remap.js").installAssetFileRemap()'
  ];
  if (containsAnySnippet(gameModuleSource, assetRemapSnippetCandidates)) {
    errors.push('拆分入口 game.js 模块仍包含 remap 安装，请移除运行时 remap 依赖');
  }
  if (!containsAnySnippet(gameModuleSource, gameBootstrapSnippetCandidates)) {
    errors.push('拆分入口 game.js 模块缺少关键桥接片段: game-bootstrap require');
  }
  if (!gameModuleSource.includes('bootModule.bootGameRuntime(require)')) {
    errors.push('拆分入口 game.js 模块缺少关键桥接片段: bootModule.bootGameRuntime(require)');
  }
}

/**
 * 判断源码是否包含候选片段之一。
 * @param {string} sourceCode 源码
 * @param {string[]} snippetCandidates 候选片段
 * @returns {boolean}
 */
function containsAnySnippet(sourceCode, snippetCandidates) {
  for (const snippet of snippetCandidates) {
    if (sourceCode.includes(snippet)) {
      return true;
    }
  }
  return false;
}

/**
 * 校验启动模块导出函数名是否正确。
 * @param {string} bootPath 启动模块路径
 * @param {string[]} errors 错误收集器
 */
function verifyBootExport(bootPath, errors) {
  const bootModule = require(bootPath);
  if (!bootModule || typeof bootModule.bootGameRuntime !== 'function') {
    errors.push('game-bootstrap.js 未导出 bootGameRuntime 函数');
  }

  const bootSource = fs.readFileSync(bootPath, 'utf8');
  const requiredSnippets = [
    "require('./runtime-governance')",
    'installRuntimeGovernance('
  ];

  for (const snippet of requiredSnippets) {
    if (!bootSource.includes(snippet)) {
      errors.push('game-bootstrap.js 缺少运行时治理桥接片段: ' + snippet);
    }
  }
}

verifyRuntimeSafety();
