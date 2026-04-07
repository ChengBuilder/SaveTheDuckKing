'use strict';

/**
 * 默认启动配置。
 */
const DEFAULT_BOOT_CONFIG = {
  startScene: 'default',
  startStyle: 'default',
  autoHideSplash: 'false',
  renderPixelRatioCap: 2,
  lowEndBenchmarkLevel: 15,
  lowEndFps: 45,
  defaultFps: 60
};

/**
 * 解析启动配置。
 * 优先使用全局覆盖配置，其次使用默认值。
 * @returns {Record<string, any>}
 */
function resolveBootConfig() {
  const globalOverrides = getGlobalBootOverrides();
  return {
    startScene: pickString(globalOverrides.startScene, DEFAULT_BOOT_CONFIG.startScene),
    startStyle: pickString(globalOverrides.startStyle, DEFAULT_BOOT_CONFIG.startStyle),
    autoHideSplash: pickString(globalOverrides.autoHideSplash, DEFAULT_BOOT_CONFIG.autoHideSplash),
    renderPixelRatioCap: pickNumber(globalOverrides.renderPixelRatioCap, DEFAULT_BOOT_CONFIG.renderPixelRatioCap),
    lowEndBenchmarkLevel: pickNumber(
      globalOverrides.lowEndBenchmarkLevel,
      DEFAULT_BOOT_CONFIG.lowEndBenchmarkLevel
    ),
    lowEndFps: pickNumber(globalOverrides.lowEndFps, DEFAULT_BOOT_CONFIG.lowEndFps),
    defaultFps: pickNumber(globalOverrides.defaultFps, DEFAULT_BOOT_CONFIG.defaultFps)
  };
}

/**
 * 读取全局启动覆盖配置。
 * 约定使用 globalThis.__DUCK_BOOT_OVERRIDES。
 * @returns {Record<string, any>}
 */
function getGlobalBootOverrides() {
  if (typeof globalThis === 'undefined') {
    return {};
  }
  const overrides = globalThis.__DUCK_BOOT_OVERRIDES;
  if (!overrides || typeof overrides !== 'object') {
    return {};
  }
  return overrides;
}

/**
 * 选择字符串配置值。
 * @param {any} currentValue 当前值
 * @param {string} fallbackValue 默认值
 * @returns {string}
 */
function pickString(currentValue, fallbackValue) {
  if (typeof currentValue !== 'string' || currentValue.trim().length === 0) {
    return fallbackValue;
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
    return fallbackValue;
  }
  return parsedValue;
}

const configApi = {
  DEFAULT_BOOT_CONFIG: DEFAULT_BOOT_CONFIG,
  resolveBootConfig: resolveBootConfig
};

module.exports = configApi;
module.exports.default = configApi;
