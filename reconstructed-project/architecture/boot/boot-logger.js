'use strict';

const { getRuntimeGlobalObject } = require('./global-context');

const BOOT_LOG_PREFIX = '[DuckBoot]';
const BOOT_DEBUG_FLAGS = ['__DUCK_BOOT_DEBUG', '__DUCK_DEBUG'];

/**
 * 输出启动阶段信息日志。
 * @param {string} message 日志消息
 * @param {any} extraData 附加数据
 */
function logInfo(message, extraData) {
  writeLog('log', '信息', message, extraData, true);
}

/**
 * 输出启动阶段警告日志。
 * @param {string} message 日志消息
 * @param {any} extraData 附加数据
 */
function logWarn(message, extraData) {
  writeLog('warn', '警告', message, extraData, true);
}

/**
 * 输出启动阶段错误日志。
 * @param {string} message 日志消息
 * @param {any} extraData 附加数据
 */
function logError(message, extraData) {
  writeLog('error', '错误', message, extraData, true);
}

/**
 * 输出启动阶段调试日志。
 * 仅在开启调试开关时输出，默认静默。
 * @param {string} message 日志消息
 * @param {any} extraData 附加数据
 */
function logDebug(message, extraData) {
  writeLog('log', '调试', message, extraData, isBootDebugEnabled());
}

/**
 * 判断是否开启启动调试日志。
 * 支持通过全局变量控制：
 * - globalThis.__DUCK_BOOT_DEBUG = true
 * - globalThis.__DUCK_DEBUG = true
 * @returns {boolean}
 */
function isBootDebugEnabled() {
  const runtimeGlobal = getRuntimeGlobalObject();
  for (const debugFlag of BOOT_DEBUG_FLAGS) {
    if (Boolean(runtimeGlobal[debugFlag])) {
      return true;
    }
  }
  return false;
}

/**
 * 统一写日志。
 * @param {'log'|'warn'|'error'} methodName 控制台方法名
 * @param {'信息'|'警告'|'错误'|'调试'} levelText 级别文本
 * @param {string} message 日志消息
 * @param {any} extraData 附加数据
 * @param {boolean} shouldOutput 是否输出
 */
function writeLog(methodName, levelText, message, extraData, shouldOutput) {
  if (!shouldOutput) {
    return;
  }

  const safeMessage = typeof message === 'string' && message.length > 0
    ? message
    : '未提供日志消息';
  const logHeader = BOOT_LOG_PREFIX + '[' + levelText + ']';
  const consoleMethod = resolveConsoleMethod(methodName);

  if (typeof extraData === 'undefined') {
    consoleMethod(logHeader, safeMessage);
    return;
  }

  consoleMethod(logHeader, safeMessage, extraData);
}

/**
 * 解析可用控制台方法。
 * @param {'log'|'warn'|'error'} methodName 控制台方法名
 * @returns {(message?: any, ...optionalParams: any[]) => void}
 */
function resolveConsoleMethod(methodName) {
  if (typeof console === 'undefined' || !console) {
    return function noopConsoleMethod() {};
  }

  const fallbackMethod = typeof console.log === 'function'
    ? console.log.bind(console)
    : function noopConsoleMethod() {};
  const namedMethod = console[methodName];
  if (typeof namedMethod === 'function') {
    return namedMethod.bind(console);
  }

  return fallbackMethod;
}

module.exports = {
  logInfo: logInfo,
  logWarn: logWarn,
  logError: logError,
  logDebug: logDebug,
  isBootDebugEnabled: isBootDebugEnabled
};

