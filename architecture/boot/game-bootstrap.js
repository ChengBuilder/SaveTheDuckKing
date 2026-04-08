'use strict';

const { resolveBootConfigSafely } = require('./config');
const { getSystemInfoSafely } = require('./system-info');
const {
  exposeRuntimeRequire,
  loadRuntimeDependencies,
  warmupSystemRuntime
} = require('./runtime-bridge');
const { startApplicationLifecycle } = require('./app-lifecycle');
const {
  BOOT_STATUS_PENDING,
  BOOT_STATUS_RUNNING,
  BOOT_STATUS_COMPLETED,
  resolveBootRuntimeState,
  markBootStatus,
  shouldSkipBoot,
  markBootFailure
} = require('./boot-safety');
const {
  resolvePlatformStartupStrategy,
  scheduleBootStart
} = require('./platform-strategy');
const {
  applyPerformanceStrategies
} = require('./performance-strategy');
const {
  createBootObserver,
  markBootPhase,
  updateBootMetrics,
  finalizeBootObserver
} = require('./boot-observer');
const { logInfo, logWarn, logError, logDebug } = require('./boot-logger');

/**
 * 执行完整启动流程。
 * @param {Function} requireFn 当前模块 require 函数
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {{platform: string, startupMode: string, matchedRuleId: string, reason: string}} platformStartupStrategy 平台启动策略
 * @returns {Promise<void>}
 */
function runBootSequence(requireFn, runtimeBootState, systemInfo, platformStartupStrategy) {
  markBootStatus(runtimeBootState, BOOT_STATUS_RUNNING, {
    matchedRuleId: platformStartupStrategy.matchedRuleId
  });
  const bootConfig = resolveBootConfigSafely();
  const runtimeSystemInfo = isObject(systemInfo) ? systemInfo : getSystemInfoSafely();
  const bootObserver = createBootObserver(resolveInitialBootObserverState(
    bootConfig,
    runtimeSystemInfo,
    platformStartupStrategy
  ));

  logInfo('开始执行启动序列。', {
    bootConfig: bootConfig,
    platformStrategy: platformStartupStrategy
  });
  markBootPhase(bootObserver, 'boot-sequence-started', {
    startScene: bootConfig.startScene,
    startStyle: bootConfig.startStyle
  });

  exposeRuntimeRequire(requireFn);
  markBootPhase(bootObserver, 'runtime-require-exposed');

  loadRuntimeDependencies(requireFn);
  markBootPhase(bootObserver, 'runtime-dependencies-loaded');

  const performanceSnapshot = applyPerformanceStrategies(runtimeSystemInfo, bootConfig);
  updateBootMetrics(bootObserver, {
    performance: performanceSnapshot
  });
  markBootPhase(bootObserver, 'performance-strategies-applied', {
    targetFps: performanceSnapshot.frameRatePolicy.targetFps,
    targetRenderDpr: performanceSnapshot.renderPolicy.targetRenderDpr
  });

  warmupSystemRuntime(requireFn);
  markBootPhase(bootObserver, 'system-runtime-warmed');

  const loadingView = requireFn('./first-screen');
  markBootPhase(bootObserver, 'loading-view-ready');

  return startApplicationLifecycle(requireFn, loadingView, bootConfig, {
    onPhase: function onLifecyclePhase(phaseName, extraData) {
      markBootPhase(bootObserver, phaseName, extraData);
    }
  })
    .then(function onBootSuccess() {
      markBootStatus(runtimeBootState, BOOT_STATUS_COMPLETED, {
        completedAt: new Date().toISOString()
      });
      finalizeBootObserver(bootObserver, 'completed');
      logInfo('启动完成。');
    })
    .catch(function onBootError(error) {
      markBootFailure(runtimeBootState, error);
      finalizeBootObserver(bootObserver, 'failed', {
        lastErrorMessage: resolveErrorMessage(error)
      });
      logError('启动失败。', error);
    });
}

/**
 * 组装启动观测的初始信息。
 * @param {Record<string, any>} bootConfig 启动配置
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {{platform: string, startupMode: string, matchedRuleId: string, reason: string}} platformStartupStrategy 平台启动策略
 * @returns {Record<string, any>}
 */
function resolveInitialBootObserverState(bootConfig, systemInfo, platformStartupStrategy) {
  return {
    startScene: bootConfig.startScene,
    startStyle: bootConfig.startStyle,
    autoHideSplash: bootConfig.autoHideSplash,
    systemInfo: {
      platform: String(systemInfo.platform || 'unknown'),
      benchmarkLevel: Number(systemInfo.benchmarkLevel || 0),
      pixelRatio: Number(systemInfo.pixelRatio || 1)
    },
    platformStrategy: {
      platform: platformStartupStrategy.platform,
      startupMode: platformStartupStrategy.startupMode,
      matchedRuleId: platformStartupStrategy.matchedRuleId,
      reason: platformStartupStrategy.reason
    }
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
 * 提取错误的可读文本。
 * @param {any} error 错误对象
 * @returns {string}
 */
function resolveErrorMessage(error) {
  if (error && typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }
  return String(error || '未知错误');
}

/**
 * 入口函数。
 * 平台差异由 platform-strategy 模块接管，入口仅负责状态控制与启动编排。
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
  const platformStartupStrategy = resolvePlatformStartupStrategy(systemInfo);

  logDebug('平台启动策略已解析。', platformStartupStrategy);
  scheduleBootStart(platformStartupStrategy, function startBootFlow() {
    runBootSequence(requireFn, runtimeBootState, systemInfo, platformStartupStrategy);
  });
}

module.exports = {
  bootGameRuntime: bootGameRuntime
};
