'use strict';

const {
  normalizeCanvasOrientation,
  applyRenderResolutionPolicy,
  applyFrameRatePolicy,
  resolveRenderResolutionState,
  resolveTargetFrameRate
} = require('./render-policies');
const { logDebug } = require('./boot-logger');

/**
 * 应用启动阶段性能策略。
 * 统一串联画布方向、渲染分辨率与帧率策略，并返回可观测快照。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {Record<string, any>} bootConfig 启动配置
 * @returns {{renderPolicy: Record<string, any>, frameRatePolicy: Record<string, any>}}
 */
function applyPerformanceStrategies(systemInfo, bootConfig) {
  normalizeCanvasOrientation(systemInfo);
  applyRenderResolutionPolicy(systemInfo, bootConfig.renderPixelRatioCap);
  applyFrameRatePolicy(
    systemInfo,
    bootConfig.lowEndBenchmarkLevel,
    bootConfig.lowEndFps,
    bootConfig.defaultFps
  );

  const performanceSnapshot = resolveRuntimePerformanceSnapshot(systemInfo, bootConfig);
  logDebug('性能策略快照已更新。', performanceSnapshot);
  return performanceSnapshot;
}

/**
 * 解析运行时性能快照。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {Record<string, any>} bootConfig 启动配置
 * @returns {{renderPolicy: Record<string, any>, frameRatePolicy: Record<string, any>}}
 */
function resolveRuntimePerformanceSnapshot(systemInfo, bootConfig) {
  return {
    renderPolicy: resolveRenderResolutionState(systemInfo, bootConfig.renderPixelRatioCap),
    frameRatePolicy: {
      benchmarkLevel: Number(systemInfo.benchmarkLevel || 0),
      lowEndBenchmarkLevel: Number(bootConfig.lowEndBenchmarkLevel),
      lowEndFps: Number(bootConfig.lowEndFps),
      defaultFps: Number(bootConfig.defaultFps),
      targetFps: resolveTargetFrameRate(
        systemInfo,
        bootConfig.lowEndBenchmarkLevel,
        bootConfig.lowEndFps,
        bootConfig.defaultFps
      )
    }
  };
}

/**
 * 生成性能策略快照。
 * 供自动报告读取，避免手工同步默认性能参数。
 * @param {{defaultConfig?: Record<string, any>}} bootConfigSnapshot 启动配置快照
 * @returns {{renderPolicy: Record<string, any>, frameRatePolicy: Record<string, any>, runtimeMetricKeys: string[]}}
 */
function resolvePerformanceStrategySnapshot(bootConfigSnapshot) {
  const defaultConfig = bootConfigSnapshot && bootConfigSnapshot.defaultConfig
    ? bootConfigSnapshot.defaultConfig
    : {};

  return {
    renderPolicy: {
      renderPixelRatioCap: Number(defaultConfig.renderPixelRatioCap || 2),
      effect: '限制高 DPR 渲染倍率，避免启动期过度放大。'
    },
    frameRatePolicy: {
      lowEndBenchmarkLevel: Number(defaultConfig.lowEndBenchmarkLevel || 15),
      lowEndFps: Number(defaultConfig.lowEndFps || 45),
      defaultFps: Number(defaultConfig.defaultFps || 60)
    },
    runtimeMetricKeys: [
      'performance.renderPolicy.targetRenderDpr',
      'performance.renderPolicy.targetRenderWidth',
      'performance.frameRatePolicy.targetFps'
    ]
  };
}

const performanceStrategyApi = {
  applyPerformanceStrategies: applyPerformanceStrategies,
  resolveRuntimePerformanceSnapshot: resolveRuntimePerformanceSnapshot,
  resolvePerformanceStrategySnapshot: resolvePerformanceStrategySnapshot
};

module.exports = performanceStrategyApi;
module.exports.default = performanceStrategyApi;
