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
  const globalContextPath = path.join(projectRoot, 'architecture', 'boot', 'global-context.js');
  const bootLoggerPath = path.join(projectRoot, 'architecture', 'boot', 'boot-logger.js');

  const errors = [];

  assertFileExists(gamePath, errors, '缺少主入口 game.js');
  assertFileExists(bootPath, errors, '缺少可维护启动入口 game-bootstrap.js');
  assertFileExists(globalContextPath, errors, '缺少运行时上下文模块 global-context.js');
  assertFileExists(bootLoggerPath, errors, '缺少启动日志模块 boot-logger.js');

  if (errors.length === 0) {
    const gameSource = fs.readFileSync(gamePath, 'utf8');
    verifyGameBridge(gameSource, errors);
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
 * @param {string} source game.js 文本
 * @param {string[]} errors 错误收集器
 */
function verifyGameBridge(source, errors) {
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
 * 校验启动模块导出函数名是否正确。
 * @param {string} bootPath 启动模块路径
 * @param {string[]} errors 错误收集器
 */
function verifyBootExport(bootPath, errors) {
  const bootModule = require(bootPath);
  if (!bootModule || typeof bootModule.bootGameRuntime !== 'function') {
    errors.push('game-bootstrap.js 未导出 bootGameRuntime 函数');
  }
}

verifyRuntimeSafety();
