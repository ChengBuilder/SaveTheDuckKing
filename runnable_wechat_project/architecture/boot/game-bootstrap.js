'use strict';

const rawBootConfigModule = require('./config');
const { getSystemInfoSafely, isAndroid, getRuntimePixelRatio } = require('./system-info');
const {
  normalizeCanvasOrientation,
  applyRenderResolutionPolicy,
  applyFrameRatePolicy
} = require('./render-policies');
const {
  exposeRuntimeRequire,
  loadRuntimeDependencies,
  warmupSystemRuntime
} = require('./runtime-bridge');
const { startApplicationLifecycle } = require('./app-lifecycle');
const { getRuntimeGlobalObject, getRuntimeStateStore } = require('./global-context');
const { logInfo, logWarn, logError, logDebug } = require('./boot-logger');

/**
 * 启动配置的最终兜底值。
 * 即使配置模块加载异常，也能保证游戏继续运行。
 */
const HARD_FALLBACK_BOOT_CONFIG = Object.freeze({
  startScene: 'default',
  startStyle: 'default',
  autoHideSplash: 'false',
  renderPixelRatioCap: 2,
  lowEndBenchmarkLevel: 15,
  lowEndFps: 45,
  defaultFps: 60
});

const BOOT_RUNTIME_STATE_KEY = '__DUCK_BOOT_RUNTIME_STATE';
const BOOT_STATUS_IDLE = 'idle';
const BOOT_STATUS_PENDING = 'pending';
const BOOT_STATUS_RUNNING = 'running';
const BOOT_STATUS_COMPLETED = 'completed';
const BOOT_STATUS_FAILED = 'failed';

/**
 * 解析并规范化启动配置，确保返回对象始终可用。
 * @returns {Record<string, any>}
 */
function resolveBootConfigSafely() {
  const fallbackConfig = resolveDefaultBootConfig();
  const configResolver = resolveConfigResolver();

  if (typeof configResolver !== 'function') {
    return fallbackConfig;
  }

  try {
    const resolvedConfig = configResolver();
    return normalizeBootConfig(resolvedConfig, fallbackConfig);
  } catch (error) {
    logWarn('解析启动配置失败，已回退到默认配置。', error);
    return fallbackConfig;
  }
}

/**
 * 解析配置模块内的默认配置。
 * @returns {Record<string, any>}
 */
function resolveDefaultBootConfig() {
  let moduleDefaults = null;

  if (isObject(rawBootConfigModule)) {
    moduleDefaults = rawBootConfigModule.DEFAULT_BOOT_CONFIG;
  }

  if (!moduleDefaults && isObject(rawBootConfigModule) && isObject(rawBootConfigModule.default)) {
    moduleDefaults = rawBootConfigModule.default.DEFAULT_BOOT_CONFIG;
  }

  return normalizeBootConfig(moduleDefaults, HARD_FALLBACK_BOOT_CONFIG);
}

/**
 * 兼容不同导出形态，获取配置解析函数。
 * @returns {Function|null}
 */
function resolveConfigResolver() {
  if (typeof rawBootConfigModule === 'function') {
    return rawBootConfigModule;
  }

  if (isObject(rawBootConfigModule) && typeof rawBootConfigModule.resolveBootConfig === 'function') {
    return rawBootConfigModule.resolveBootConfig;
  }

  if (
    isObject(rawBootConfigModule) &&
    isObject(rawBootConfigModule.default) &&
    typeof rawBootConfigModule.default.resolveBootConfig === 'function'
  ) {
    return rawBootConfigModule.default.resolveBootConfig;
  }

  return null;
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
    defaultFps: pickNumber(safeSource.defaultFps, safeFallback.defaultFps)
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
 * 选择字符串配置值，空字符串会回退。
 * @param {any} currentValue 当前值
 * @param {string} fallbackValue 回退值
 * @returns {string}
 */
function pickString(currentValue, fallbackValue) {
  if (typeof currentValue !== 'string' || currentValue.trim().length === 0) {
    return String(fallbackValue);
  }
  return currentValue;
}

/**
 * 选择数字配置值，非法数字会回退。
 * @param {any} currentValue 当前值
 * @param {number} fallbackValue 回退值
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
 * 读取启动状态对象。
 * @returns {Record<string, any>}
 */
function resolveBootRuntimeState() {
  const runtimeBootState = getRuntimeStateStore(BOOT_RUNTIME_STATE_KEY);
  if (typeof runtimeBootState.status !== 'string') {
    runtimeBootState.status = BOOT_STATUS_IDLE;
  }
  return runtimeBootState;
}

/**
 * 更新启动状态。
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @param {string} nextStatus 目标状态
 */
function markBootStatus(runtimeBootState, nextStatus) {
  runtimeBootState.status = nextStatus;
  runtimeBootState.updatedAt = new Date().toISOString();
  logDebug('启动状态已更新。', {
    status: nextStatus,
    updatedAt: runtimeBootState.updatedAt
  });
}

/**
 * 判断当前是否应跳过重复启动。
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @returns {boolean}
 */
function shouldSkipBoot(runtimeBootState) {
  return runtimeBootState.status === BOOT_STATUS_PENDING ||
    runtimeBootState.status === BOOT_STATUS_RUNNING ||
    runtimeBootState.status === BOOT_STATUS_COMPLETED;
}

/**
 * 执行完整启动流程。
 * @param {Function} requireFn 当前模块 require 函数
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @returns {Promise<void>}
 */
function runBootSequence(requireFn, runtimeBootState) {
  markBootStatus(runtimeBootState, BOOT_STATUS_RUNNING);
  const bootConfig = resolveBootConfigSafely();
  logInfo('开始执行启动序列。', bootConfig);
  const systemInfo = getSystemInfoSafely();
  exposeRuntimeRequire(requireFn);
  loadRuntimeDependencies(requireFn);
  normalizeCanvasOrientation(systemInfo);
  applyRenderResolutionPolicy(systemInfo, bootConfig.renderPixelRatioCap);
  applyFrameRatePolicy(
    systemInfo,
    bootConfig.lowEndBenchmarkLevel,
    bootConfig.lowEndFps,
    bootConfig.defaultFps
  );
  warmupSystemRuntime(requireFn);

  const loadingView = requireFn('./first-screen');
  const runtimeGlobal = getRuntimeGlobalObject();

  runtimeGlobal.__DUCK_BOOT_INFO = {
    bootAt: new Date().toISOString(),
    benchmarkLevel: Number(systemInfo.benchmarkLevel || 0),
    pixelRatio: getRuntimePixelRatio(systemInfo)
  };

  return startApplicationLifecycle(requireFn, loadingView, bootConfig)
    .then(function onBootSuccess() {
      markBootStatus(runtimeBootState, BOOT_STATUS_COMPLETED);
      logInfo('启动完成。');
    })
    .catch(function onBootError(error) {
      markBootStatus(runtimeBootState, BOOT_STATUS_FAILED);
      logError('启动失败。', error);
    });
}

/**
 * 入口函数。
 * Android 平台沿用 requestAnimationFrame 延迟启动，规避首帧黑屏风险。
 * @param {Function} requireFn 当前模块 require 函数
 */
function bootGameRuntime(requireFn) {
  const runtimeBootState = resolveBootRuntimeState();
  if (shouldSkipBoot(runtimeBootState)) {
    logWarn('已存在启动流程，忽略重复调用。', {
      status: runtimeBootState.status
    });
    return;
  }
  markBootStatus(runtimeBootState, BOOT_STATUS_PENDING);

  const systemInfo = getSystemInfoSafely();

  if (
    isAndroid(systemInfo) &&
    typeof GameGlobal !== 'undefined' &&
    typeof GameGlobal.requestAnimationFrame === 'function'
  ) {
    GameGlobal.requestAnimationFrame(function startOnNextFrame() {
      runBootSequence(requireFn, runtimeBootState);
    });
    return;
  }

  runBootSequence(requireFn, runtimeBootState);
}

module.exports = {
  bootGameRuntime: bootGameRuntime
};
