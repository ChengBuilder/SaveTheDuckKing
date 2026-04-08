'use strict';

const { getRuntimeGlobalObject } = require('./global-context');
const { logWarn } = require('./boot-logger');

const BOOT_INFO_KEY = '__DUCK_BOOT_INFO';

/**
 * 创建启动观测对象。
 * 观测数据统一挂到全局对象，便于小游戏控制台直接查看。
 * @param {Record<string, any>} initialInfo 初始观测信息
 * @returns {Record<string, any>}
 */
function createBootObserver(initialInfo) {
  const runtimeGlobal = getRuntimeGlobalObject();
  const normalizedInitialInfo = initialInfo && typeof initialInfo === 'object'
    ? initialInfo
    : {};
  const bootStartedAt = new Date().toISOString();
  const bootObserver = Object.assign({
    bootAt: bootStartedAt,
    status: 'booting',
    phases: [],
    metrics: {}
  }, normalizedInitialInfo);

  runtimeGlobal[BOOT_INFO_KEY] = bootObserver;
  return bootObserver;
}

/**
 * 记录启动阶段事件。
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {string} phaseName 阶段名称
 * @param {Record<string, any>} extraData 附加数据
 */
function markBootPhase(bootObserver, phaseName, extraData) {
  if (!bootObserver || typeof bootObserver !== 'object') {
    return;
  }

  const normalizedExtraData = extraData && typeof extraData === 'object' ? extraData : {};
  const phaseRecord = Object.assign({
    name: phaseName,
    at: new Date().toISOString()
  }, normalizedExtraData);

  if (!Array.isArray(bootObserver.phases)) {
    bootObserver.phases = [];
  }

  bootObserver.phases.push(phaseRecord);
  bootObserver.lastPhase = phaseName;
}

/**
 * 更新启动观测指标。
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {Record<string, any>} metricPatch 指标补丁
 */
function updateBootMetrics(bootObserver, metricPatch) {
  if (!bootObserver || typeof bootObserver !== 'object') {
    return;
  }

  const normalizedMetricPatch = metricPatch && typeof metricPatch === 'object' ? metricPatch : {};
  const currentMetrics = bootObserver.metrics && typeof bootObserver.metrics === 'object'
    ? bootObserver.metrics
    : {};
  bootObserver.metrics = Object.assign({}, currentMetrics, normalizedMetricPatch);
}

/**
 * 结束启动观测。
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {'completed'|'failed'} finalStatus 最终状态
 * @param {Record<string, any>} extraData 附加数据
 */
function finalizeBootObserver(bootObserver, finalStatus, extraData) {
  if (!bootObserver || typeof bootObserver !== 'object') {
    return;
  }

  const finishedAt = new Date().toISOString();
  const normalizedExtraData = extraData && typeof extraData === 'object' ? extraData : {};
  bootObserver.status = finalStatus;
  bootObserver.finishedAt = finishedAt;
  bootObserver.durationMs = resolveDurationMs(bootObserver.bootAt, finishedAt);

  for (const dataKey of Object.keys(normalizedExtraData)) {
    bootObserver[dataKey] = normalizedExtraData[dataKey];
  }
}

/**
 * 生成运行时观测快照定义。
 * @returns {{runtimeInfoKey: string, trackedPhases: string[], trackedMetricKeys: string[]}}
 */
function resolveBootObservationSnapshot() {
  return {
    runtimeInfoKey: BOOT_INFO_KEY,
    trackedPhases: [
      'boot-sequence-started',
      'runtime-require-exposed',
      'runtime-dependencies-loaded',
      'performance-strategies-applied',
      'system-runtime-warmed',
      'loading-view-ready',
      'application-lifecycle-started',
      'application-module-loaded',
      'application-created',
      'engine-module-loaded',
      'application-initialized',
      'application-started'
    ],
    trackedMetricKeys: [
      'metrics.performance.renderPolicy.targetRenderDpr',
      'metrics.performance.renderPolicy.targetRenderWidth',
      'metrics.performance.frameRatePolicy.targetFps',
      'platformStrategy.startupMode'
    ]
  };
}

/**
 * 安全触发观测阶段回调。
 * @param {{onPhase?: Function} | null | undefined} lifecycleObserver 生命周期观测器
 * @param {string} phaseName 阶段名称
 * @param {Record<string, any>} extraData 附加数据
 */
function notifyBootObservation(lifecycleObserver, phaseName, extraData) {
  if (!lifecycleObserver || typeof lifecycleObserver.onPhase !== 'function') {
    return;
  }

  try {
    lifecycleObserver.onPhase(phaseName, extraData);
  } catch (error) {
    logWarn('启动观测回调执行失败，已忽略。', {
      phaseName: phaseName,
      error: error
    });
  }
}

/**
 * 计算启动持续时间。
 * @param {string} startedAt 启动时间
 * @param {string} finishedAt 结束时间
 * @returns {number | null}
 */
function resolveDurationMs(startedAt, finishedAt) {
  const startedAtMs = Date.parse(startedAt);
  const finishedAtMs = Date.parse(finishedAt);
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(finishedAtMs)) {
    return null;
  }
  return Math.max(0, finishedAtMs - startedAtMs);
}

const bootObserverApi = {
  BOOT_INFO_KEY: BOOT_INFO_KEY,
  createBootObserver: createBootObserver,
  markBootPhase: markBootPhase,
  updateBootMetrics: updateBootMetrics,
  finalizeBootObserver: finalizeBootObserver,
  resolveBootObservationSnapshot: resolveBootObservationSnapshot,
  notifyBootObservation: notifyBootObservation
};

module.exports = bootObserverApi;
module.exports.default = bootObserverApi;
