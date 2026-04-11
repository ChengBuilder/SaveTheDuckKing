'use strict';

const { getRuntimeGlobalObject } = require('./global-context');
const { logWarn } = require('./boot-logger');

/**
 * 默认启动配置。
 */
const DEFAULT_BOOT_CONFIG = {
  startScene: 'default',
  startStyle: 'default',
  autoHideSplash: 'false',
  renderPixelRatioCap: 1.6,
  lowEndBenchmarkLevel: 20,
  lowEndFps: 40,
  defaultFps: 55,
  enableConsoleLogGovernance: true,
  maxRuntimeLogCount: 120,
  maxRuntimeWarnCount: 80,
  enableUpdateManager: true,
  promptForUpdateOnReady: true,
  applyUpdateInDevtools: false,
  enableLifecycleObservers: true,
  enableMemoryWarningObservers: true
};

/**
 * 启动配置的最终兜底值。
 * 即使默认配置被误改，也能保证启动字段完整。
 */
const HARD_FALLBACK_BOOT_CONFIG = Object.freeze({
  startScene: 'default',
  startStyle: 'default',
  autoHideSplash: 'false',
  renderPixelRatioCap: 1.6,
  lowEndBenchmarkLevel: 20,
  lowEndFps: 40,
  defaultFps: 55,
  enableConsoleLogGovernance: true,
  maxRuntimeLogCount: 120,
  maxRuntimeWarnCount: 80,
  enableUpdateManager: true,
  promptForUpdateOnReady: true,
  applyUpdateInDevtools: false,
  enableLifecycleObservers: true,
  enableMemoryWarningObservers: true
});

/**
 * 解析启动配置。
 * 优先使用全局覆盖配置，其次使用默认值，再兜底到最终回退值。
 * @returns {Record<string, any>}
 */
function resolveBootConfig() {
  const globalOverrides = getGlobalBootOverrides();
  return normalizeBootConfig(globalOverrides, resolveDefaultBootConfig());
}

/**
 * 安全解析启动配置。
 * 若运行时覆盖配置异常，则回退到默认快照继续启动。
 * @returns {Record<string, any>}
 */
function resolveBootConfigSafely() {
  const fallbackConfig = resolveDefaultBootConfig();

  try {
    return normalizeBootConfig(resolveBootConfig(), fallbackConfig);
  } catch (error) {
    logWarn('解析启动配置失败，已回退到默认配置。', error);
    return fallbackConfig;
  }
}

/**
 * 解析默认启动配置。
 * @returns {Record<string, any>}
 */
function resolveDefaultBootConfig() {
  return normalizeBootConfig(DEFAULT_BOOT_CONFIG, HARD_FALLBACK_BOOT_CONFIG);
}

/**
 * 读取全局启动覆盖配置。
 * 约定使用 globalThis.__DUCK_BOOT_OVERRIDES。
 * @returns {Record<string, any>}
 */
function getGlobalBootOverrides() {
  const runtimeGlobal = getRuntimeGlobalObject();
  const overrides = runtimeGlobal.__DUCK_BOOT_OVERRIDES;
  if (!overrides || typeof overrides !== 'object') {
    return {};
  }
  return overrides;
}

/**
 * 生成启动配置快照。
 * 供自动报告与维护文档读取，避免各处重复拼装字段。
 * @returns {{overrideGlobalKey: string, defaultConfig: Record<string, any>, fallbackConfig: Record<string, any>}}
 */
function resolveBootConfigSnapshot() {
  return {
    overrideGlobalKey: '__DUCK_BOOT_OVERRIDES',
    defaultConfig: resolveDefaultBootConfig(),
    fallbackConfig: normalizeBootConfig(HARD_FALLBACK_BOOT_CONFIG, HARD_FALLBACK_BOOT_CONFIG)
  };
}

/**
 * 统一启动配置结构，避免配置项缺失导致运行时异常。
 * @param {any} sourceConfig 原始配置
 * @param {Record<string, any>} fallbackConfig 回退配置
 * @returns {Record<string, any>}
 */
function normalizeBootConfig(sourceConfig, fallbackConfig) {
  const safeSource = isObject(sourceConfig) ? sourceConfig : {};
  const safeFallback = isObject(fallbackConfig) ? fallbackConfig : HARD_FALLBACK_BOOT_CONFIG;

  return {
    startScene: pickString(safeSource.startScene, safeFallback.startScene),
    startStyle: pickString(safeSource.startStyle, safeFallback.startStyle),
    autoHideSplash: pickString(safeSource.autoHideSplash, safeFallback.autoHideSplash),
    renderPixelRatioCap: pickNumber(safeSource.renderPixelRatioCap, safeFallback.renderPixelRatioCap),
    lowEndBenchmarkLevel: pickNumber(safeSource.lowEndBenchmarkLevel, safeFallback.lowEndBenchmarkLevel),
    lowEndFps: pickNumber(safeSource.lowEndFps, safeFallback.lowEndFps),
    defaultFps: pickNumber(safeSource.defaultFps, safeFallback.defaultFps),
    enableConsoleLogGovernance: pickBoolean(
      safeSource.enableConsoleLogGovernance,
      safeFallback.enableConsoleLogGovernance
    ),
    maxRuntimeLogCount: pickNumber(safeSource.maxRuntimeLogCount, safeFallback.maxRuntimeLogCount),
    maxRuntimeWarnCount: pickNumber(safeSource.maxRuntimeWarnCount, safeFallback.maxRuntimeWarnCount),
    enableUpdateManager: pickBoolean(safeSource.enableUpdateManager, safeFallback.enableUpdateManager),
    promptForUpdateOnReady: pickBoolean(safeSource.promptForUpdateOnReady, safeFallback.promptForUpdateOnReady),
    applyUpdateInDevtools: pickBoolean(safeSource.applyUpdateInDevtools, safeFallback.applyUpdateInDevtools),
    enableLifecycleObservers: pickBoolean(safeSource.enableLifecycleObservers, safeFallback.enableLifecycleObservers),
    enableMemoryWarningObservers: pickBoolean(
      safeSource.enableMemoryWarningObservers,
      safeFallback.enableMemoryWarningObservers
    )
  };
}

/**
 * 判断是否为对象。
 * @param {any} value 输入值
 * @returns {boolean}
 */
function isObject(value) {
  return Boolean(value) && typeof value === 'object';
}

/**
 * 选择字符串配置值。
 * @param {any} currentValue 当前值
 * @param {string} fallbackValue 默认值
 * @returns {string}
 */
function pickString(currentValue, fallbackValue) {
  if (typeof currentValue !== 'string' || currentValue.trim().length === 0) {
    return String(fallbackValue);
  }
  return currentValue;
}

/**
 * 选择数字配置值。
 * @param {any} currentValue 当前值
 * @param {number} fallbackValue 默认值
 * @returns {number}
 */
function pickNumber(currentValue, fallbackValue) {
  const parsedValue = Number(currentValue);
  if (!Number.isFinite(parsedValue)) {
    return Number(fallbackValue);
  }
  return parsedValue;
}

/**
 * 选择布尔配置值。
 * @param {any} currentValue 当前值
 * @param {boolean} fallbackValue 默认值
 * @returns {boolean}
 */
function pickBoolean(currentValue, fallbackValue) {
  if (typeof currentValue === 'boolean') {
    return currentValue;
  }
  if (currentValue === 'true' || currentValue === '1') {
    return true;
  }
  if (currentValue === 'false' || currentValue === '0') {
    return false;
  }
  return Boolean(fallbackValue);
}

const configApi = {
  DEFAULT_BOOT_CONFIG: DEFAULT_BOOT_CONFIG,
  HARD_FALLBACK_BOOT_CONFIG: HARD_FALLBACK_BOOT_CONFIG,
  resolveBootConfig: resolveBootConfig,
  resolveBootConfigSafely: resolveBootConfigSafely,
  resolveDefaultBootConfig: resolveDefaultBootConfig,
  resolveBootConfigSnapshot: resolveBootConfigSnapshot,
  normalizeBootConfig: normalizeBootConfig
};

module.exports = configApi;
module.exports.default = configApi;
