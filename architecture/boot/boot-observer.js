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
    metrics: {},
    phaseSummary: {
      totalPhases: 0,
      averagePhaseGapMs: 0,
      longestGapPhaseName: null,
      longestGapDurationMs: 0
    }
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
  const phaseAt = new Date().toISOString();
  const previousPhaseAt = typeof bootObserver.lastPhaseAt === 'string'
    ? bootObserver.lastPhaseAt
    : bootObserver.bootAt;
  const phaseRecord = Object.assign({
    name: phaseName,
    at: phaseAt,
    sinceBootMs: resolveDurationMs(bootObserver.bootAt, phaseAt),
    sincePreviousPhaseMs: resolveDurationMs(previousPhaseAt, phaseAt)
  }, normalizedExtraData);

  if (!Array.isArray(bootObserver.phases)) {
    bootObserver.phases = [];
  }

  bootObserver.phases.push(phaseRecord);
  bootObserver.lastPhase = phaseName;
  bootObserver.lastPhaseAt = phaseAt;
  updateBootPhaseSummary(bootObserver, phaseRecord);
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
  finalizeBootPhaseSummary(bootObserver);

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
      'application-started',
      'boot-failed'
    ],
    trackedMetricKeys: [
      'metrics.performance.renderPolicy.targetRenderDpr',
      'metrics.performance.renderPolicy.targetRenderWidth',
      'metrics.performance.frameRatePolicy.targetFps',
      'platformStrategy.startupMode'
    ],
    trackedTimingKeys: [
      'durationMs',
      'phases[].sinceBootMs',
      'phases[].sincePreviousPhaseMs',
      'phaseSummary.totalPhases',
      'phaseSummary.averagePhaseGapMs',
      'phaseSummary.longestGapPhaseName',
      'phaseSummary.longestGapDurationMs'
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

/**
 * 更新启动阶段耗时摘要。
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {{name: string, at: string, sincePreviousPhaseMs: number | null}} phaseRecord 阶段记录
 */
function updateBootPhaseSummary(bootObserver, phaseRecord) {
  const currentSummary = bootObserver.phaseSummary && typeof bootObserver.phaseSummary === 'object'
    ? bootObserver.phaseSummary
    : {};
  const previousGapTotalMs = Number(currentSummary.phaseGapTotalMs || 0);
  const phaseGapMs = Number(phaseRecord.sincePreviousPhaseMs || 0);
  const totalPhases = Array.isArray(bootObserver.phases) ? bootObserver.phases.length : 0;
  const nextGapTotalMs = previousGapTotalMs + phaseGapMs;
  const longestGapDurationMs = Number(currentSummary.longestGapDurationMs || 0);
  const shouldReplaceLongestGap = phaseGapMs >= longestGapDurationMs;

  bootObserver.phaseSummary = Object.assign({}, currentSummary, {
    totalPhases: totalPhases,
    lastPhaseName: phaseRecord.name,
    lastPhaseAt: phaseRecord.at,
    phaseGapTotalMs: nextGapTotalMs,
    averagePhaseGapMs: totalPhases > 0 ? Math.round(nextGapTotalMs / totalPhases) : 0,
    longestGapPhaseName: shouldReplaceLongestGap
      ? phaseRecord.name
      : currentSummary.longestGapPhaseName || null,
    longestGapDurationMs: shouldReplaceLongestGap
      ? phaseGapMs
      : longestGapDurationMs
  });
}

/**
 * 在启动结束时补全阶段耗时摘要。
 * @param {Record<string, any>} bootObserver 启动观测对象
 */
function finalizeBootPhaseSummary(bootObserver) {
  const currentSummary = bootObserver.phaseSummary && typeof bootObserver.phaseSummary === 'object'
    ? bootObserver.phaseSummary
    : {};
  bootObserver.phaseSummary = Object.assign({}, currentSummary, {
    totalDurationMs: bootObserver.durationMs,
    completedPhaseName: bootObserver.lastPhase || null
  });
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
