'use strict';

const { getRuntimeStateStore, getRuntimeGlobalObject } = require('./global-context');
const { updateBootMetrics } = require('./boot-observer');
const { logInfo, logWarn, logDebug } = require('./boot-logger');

const RUNTIME_GOVERNANCE_STATE_KEY = '__DUCK_RUNTIME_GOVERNANCE';
const MEMORY_WARNING_HANDLER_KEY = '__DUCK_MEMORY_WARNING_HANDLERS';

/**
 * 安装微信小游戏运行时治理能力。
 * 目标：把官方推荐的更新机制、前后台切换和内存告警统一收口到 boot 层。
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {Record<string, any>} bootConfig 启动配置
 * @param {Record<string, any>} systemInfo 系统信息
 * @returns {Record<string, any>}
 */
function installRuntimeGovernance(bootObserver, bootConfig, systemInfo) {
  const runtimeState = getRuntimeGovernanceState();
  if (runtimeState.installed) {
    syncGovernanceMetrics(bootObserver, runtimeState);
    logDebug('运行时治理模块已安装，跳过重复注册。');
    return runtimeState;
  }

  runtimeState.installed = true;
  runtimeState.installedAt = new Date().toISOString();
  runtimeState.platform = String((systemInfo && systemInfo.platform) || 'unknown');
  runtimeState.capabilities = resolveWechatCapabilities();

  if (shouldEnableLifecycleObservers(bootConfig)) {
    registerAppVisibilityListeners(runtimeState, bootObserver);
  }
  if (shouldEnableMemoryWarningObservers(bootConfig)) {
    registerMemoryWarningListener(runtimeState, bootObserver);
  }
  if (shouldEnableUpdateManager(bootConfig)) {
    registerUpdateManager(runtimeState, bootObserver, bootConfig, systemInfo);
  }

  syncGovernanceMetrics(bootObserver, runtimeState);
  logInfo('已安装运行时治理模块。', {
    capabilities: runtimeState.capabilities
  });
  return runtimeState;
}

/**
 * 注册内存告警清理回调。
 * @param {string} handlerId 回调标识
 * @param {Function} handler 内存告警回调
 */
function registerMemoryWarningHandler(handlerId, handler) {
  const normalizedId = String(handlerId || '').trim();
  if (normalizedId.length === 0 || typeof handler !== 'function') {
    return;
  }

  const runtimeState = getRuntimeGovernanceState();
  runtimeState.memoryHandlers[normalizedId] = handler;
}

/**
 * 取消注册内存告警清理回调。
 * @param {string} handlerId 回调标识
 */
function unregisterMemoryWarningHandler(handlerId) {
  const normalizedId = String(handlerId || '').trim();
  if (normalizedId.length === 0) {
    return;
  }

  const runtimeState = getRuntimeGovernanceState();
  delete runtimeState.memoryHandlers[normalizedId];
}

/**
 * 读取治理能力快照。
 * @returns {{runtimeStateKey: string, memoryHandlerKey: string, trackedMetricKeys: string[]}}
 */
function resolveRuntimeGovernanceSnapshot() {
  return {
    runtimeStateKey: RUNTIME_GOVERNANCE_STATE_KEY,
    memoryHandlerKey: MEMORY_WARNING_HANDLER_KEY,
    trackedMetricKeys: [
      'metrics.runtimeGovernance.capabilities.updateManager',
      'metrics.runtimeGovernance.capabilities.memoryWarning',
      'metrics.runtimeGovernance.lifecycle.showCount',
      'metrics.runtimeGovernance.lifecycle.hideCount',
      'metrics.runtimeGovernance.memoryWarning.count',
      'metrics.runtimeGovernance.update.status'
    ]
  };
}

/**
 * 获取治理状态对象。
 * @returns {Record<string, any>}
 */
function getRuntimeGovernanceState() {
  const runtimeState = getRuntimeStateStore(RUNTIME_GOVERNANCE_STATE_KEY);
  if (!runtimeState.memoryHandlers || typeof runtimeState.memoryHandlers !== 'object') {
    runtimeState.memoryHandlers = {};
  }
  if (!runtimeState.lifecycle || typeof runtimeState.lifecycle !== 'object') {
    runtimeState.lifecycle = {
      showCount: 0,
      hideCount: 0,
      lastShowAt: null,
      lastHideAt: null,
      lastShowScene: null
    };
  }
  if (!runtimeState.memoryWarning || typeof runtimeState.memoryWarning !== 'object') {
    runtimeState.memoryWarning = {
      count: 0,
      lastAt: null,
      lastLevel: null,
      lastCleanup: {
        executedHandlers: 0,
        failedHandlers: 0,
        builtInCleanupExecuted: false
      }
    };
  }
  if (!runtimeState.update || typeof runtimeState.update !== 'object') {
    runtimeState.update = {
      supported: false,
      status: 'idle',
      checkedAt: null,
      readyAt: null,
      failedAt: null,
      appliedAt: null,
      hasUpdate: null,
      promptShownAt: null,
      skippedInDevtools: false
    };
  }

  const runtimeGlobal = getRuntimeGlobalObject();
  runtimeGlobal[MEMORY_WARNING_HANDLER_KEY] = runtimeState.memoryHandlers;
  return runtimeState;
}

/**
 * 注册前后台监听。
 * @param {Record<string, any>} runtimeState 运行时治理状态
 * @param {Record<string, any>} bootObserver 启动观测对象
 */
function registerAppVisibilityListeners(runtimeState, bootObserver) {
  if (!hasWechatApi('onShow') || !hasWechatApi('onHide')) {
    logDebug('当前环境不支持 onShow/onHide，已跳过前后台监听注册。');
    return;
  }

  wx.onShow(function onAppShow(options) {
    runtimeState.lifecycle.showCount += 1;
    runtimeState.lifecycle.lastShowAt = new Date().toISOString();
    runtimeState.lifecycle.lastShowScene = resolveLaunchScene(options);
    syncGovernanceMetrics(bootObserver, runtimeState);
    logDebug('小游戏进入前台。', {
      scene: runtimeState.lifecycle.lastShowScene
    });
  });

  wx.onHide(function onAppHide() {
    runtimeState.lifecycle.hideCount += 1;
    runtimeState.lifecycle.lastHideAt = new Date().toISOString();
    syncGovernanceMetrics(bootObserver, runtimeState);
    logDebug('小游戏进入后台。');
  });
}

/**
 * 注册内存告警监听。
 * @param {Record<string, any>} runtimeState 运行时治理状态
 * @param {Record<string, any>} bootObserver 启动观测对象
 */
function registerMemoryWarningListener(runtimeState, bootObserver) {
  if (!hasWechatApi('onMemoryWarning')) {
    logDebug('当前环境不支持 onMemoryWarning，已跳过内存告警监听注册。');
    return;
  }

  wx.onMemoryWarning(function onMemoryWarning(memoryWarning) {
    const warningLevel = resolveMemoryWarningLevel(memoryWarning);
    const cleanupSummary = executeMemoryWarningCleanup(runtimeState);

    runtimeState.memoryWarning.count += 1;
    runtimeState.memoryWarning.lastAt = new Date().toISOString();
    runtimeState.memoryWarning.lastLevel = warningLevel;
    runtimeState.memoryWarning.lastCleanup = cleanupSummary;
    syncGovernanceMetrics(bootObserver, runtimeState);

    logWarn('收到微信小游戏内存告警。', {
      level: warningLevel,
      cleanup: cleanupSummary
    });
  });
}

/**
 * 注册更新管理器。
 * @param {Record<string, any>} runtimeState 运行时治理状态
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {Record<string, any>} bootConfig 启动配置
 * @param {Record<string, any>} systemInfo 系统信息
 */
function registerUpdateManager(runtimeState, bootObserver, bootConfig, systemInfo) {
  if (!hasWechatApi('getUpdateManager')) {
    logDebug('当前环境不支持 getUpdateManager，已跳过更新管理器注册。');
    return;
  }

  let updateManager = null;
  try {
    updateManager = wx.getUpdateManager();
  } catch (error) {
    logWarn('创建更新管理器失败，已跳过更新治理。', error);
    return;
  }

  if (!updateManager || typeof updateManager !== 'object') {
    return;
  }

  runtimeState.update.supported = true;
  runtimeState.update.status = 'checking';
  syncGovernanceMetrics(bootObserver, runtimeState);

  if (typeof updateManager.onCheckForUpdate === 'function') {
    updateManager.onCheckForUpdate(function onCheckForUpdate(result) {
      runtimeState.update.checkedAt = new Date().toISOString();
      runtimeState.update.hasUpdate = Boolean(result && result.hasUpdate);
      runtimeState.update.status = runtimeState.update.hasUpdate ? 'downloading' : 'up-to-date';
      syncGovernanceMetrics(bootObserver, runtimeState);
      logInfo('已完成版本更新检查。', {
        hasUpdate: runtimeState.update.hasUpdate
      });
    });
  }

  if (typeof updateManager.onUpdateReady === 'function') {
    updateManager.onUpdateReady(function onUpdateReady() {
      runtimeState.update.readyAt = new Date().toISOString();
      runtimeState.update.status = 'ready';
      syncGovernanceMetrics(bootObserver, runtimeState);
      logInfo('检测到新版本已准备就绪。');
      promptAndApplyUpdate(updateManager, runtimeState, bootObserver, bootConfig, systemInfo);
    });
  }

  if (typeof updateManager.onUpdateFailed === 'function') {
    updateManager.onUpdateFailed(function onUpdateFailed(error) {
      runtimeState.update.failedAt = new Date().toISOString();
      runtimeState.update.status = 'failed';
      syncGovernanceMetrics(bootObserver, runtimeState);
      logWarn('新版本下载失败，将继续使用当前版本。', error);
    });
  }
}

/**
 * 弹出官方推荐的更新提示，并在确认后应用更新。
 * @param {Record<string, any>} updateManager 更新管理器
 * @param {Record<string, any>} runtimeState 治理状态
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {Record<string, any>} bootConfig 启动配置
 * @param {Record<string, any>} systemInfo 系统信息
 */
function promptAndApplyUpdate(updateManager, runtimeState, bootObserver, bootConfig, systemInfo) {
  const isDevtools = String((systemInfo && systemInfo.platform) || '').toLowerCase() === 'devtools';
  if (isDevtools && !Boolean(bootConfig.applyUpdateInDevtools)) {
    runtimeState.update.skippedInDevtools = true;
    syncGovernanceMetrics(bootObserver, runtimeState);
    logInfo('开发者工具环境检测到新版本，按配置跳过自动应用。');
    return;
  }

  const applyUpdate = function applyUpdate() {
    if (typeof updateManager.applyUpdate !== 'function') {
      return;
    }
    runtimeState.update.appliedAt = new Date().toISOString();
    runtimeState.update.status = 'applied';
    syncGovernanceMetrics(bootObserver, runtimeState);
    updateManager.applyUpdate();
  };

  if (!Boolean(bootConfig.promptForUpdateOnReady) || !hasWechatApi('showModal')) {
    applyUpdate();
    return;
  }

  runtimeState.update.promptShownAt = new Date().toISOString();
  syncGovernanceMetrics(bootObserver, runtimeState);

  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，重启小游戏后即可体验。',
    showCancel: false,
    confirmText: '立即重启',
    success: function onModalSuccess(result) {
      if (!result || result.confirm !== false) {
        applyUpdate();
      }
    },
    fail: function onModalFail(error) {
      logWarn('更新提示弹窗失败，将直接应用更新。', error);
      applyUpdate();
    }
  });
}

/**
 * 执行内存告警清理。
 * @param {Record<string, any>} runtimeState 治理状态
 * @returns {{executedHandlers: number, failedHandlers: number, builtInCleanupExecuted: boolean}}
 */
function executeMemoryWarningCleanup(runtimeState) {
  const handlerEntries = Object.entries(runtimeState.memoryHandlers || {});
  let executedHandlers = 0;
  let failedHandlers = 0;

  for (const entry of handlerEntries) {
    const handlerId = entry[0];
    const handler = entry[1];
    if (typeof handler !== 'function') {
      continue;
    }

    try {
      handler();
      executedHandlers += 1;
    } catch (error) {
      failedHandlers += 1;
      logWarn('执行内存告警清理回调失败，已忽略。', {
        handlerId: handlerId,
        error: error
      });
    }
  }

  return {
    executedHandlers: executedHandlers,
    failedHandlers: failedHandlers,
    builtInCleanupExecuted: runBuiltInMemoryCleanup()
  };
}

/**
 * 执行内建的轻量清理动作。
 * 这里只做“无引用资源释放”这类低风险动作，避免误伤业务状态。
 * @returns {boolean}
 */
function runBuiltInMemoryCleanup() {
  const runtimeGlobal = getRuntimeGlobalObject();
  const runtimeCc = runtimeGlobal.cc;
  if (!runtimeCc || !runtimeCc.assetManager || typeof runtimeCc.assetManager.releaseUnusedAssets !== 'function') {
    return false;
  }

  try {
    runtimeCc.assetManager.releaseUnusedAssets();
    return true;
  } catch (error) {
    logWarn('执行内建资源释放失败，已忽略。', error);
    return false;
  }
}

/**
 * 同步治理指标到 boot observer。
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {Record<string, any>} runtimeState 治理状态
 */
function syncGovernanceMetrics(bootObserver, runtimeState) {
  updateBootMetrics(bootObserver, {
    runtimeGovernance: {
      installed: Boolean(runtimeState.installed),
      installedAt: runtimeState.installedAt || null,
      platform: runtimeState.platform || 'unknown',
      capabilities: Object.assign({}, runtimeState.capabilities || {}),
      lifecycle: Object.assign({}, runtimeState.lifecycle || {}),
      memoryWarning: Object.assign({}, runtimeState.memoryWarning || {}),
      update: Object.assign({}, runtimeState.update || {})
    }
  });
}

/**
 * 解析微信 API 能力。
 * @returns {{updateManager: boolean, memoryWarning: boolean, appShow: boolean, appHide: boolean, showModal: boolean}}
 */
function resolveWechatCapabilities() {
  return {
    updateManager: hasWechatApi('getUpdateManager'),
    memoryWarning: hasWechatApi('onMemoryWarning'),
    appShow: hasWechatApi('onShow'),
    appHide: hasWechatApi('onHide'),
    showModal: hasWechatApi('showModal')
  };
}

/**
 * 判断是否存在微信 API。
 * @param {string} methodName API 名称
 * @returns {boolean}
 */
function hasWechatApi(methodName) {
  return typeof wx !== 'undefined' && Boolean(wx) && typeof wx[methodName] === 'function';
}

/**
 * 是否启用更新管理。
 * @param {Record<string, any>} bootConfig 启动配置
 * @returns {boolean}
 */
function shouldEnableUpdateManager(bootConfig) {
  return Boolean(bootConfig.enableUpdateManager);
}

/**
 * 是否启用前后台观测。
 * @param {Record<string, any>} bootConfig 启动配置
 * @returns {boolean}
 */
function shouldEnableLifecycleObservers(bootConfig) {
  return Boolean(bootConfig.enableLifecycleObservers);
}

/**
 * 是否启用内存告警治理。
 * @param {Record<string, any>} bootConfig 启动配置
 * @returns {boolean}
 */
function shouldEnableMemoryWarningObservers(bootConfig) {
  return Boolean(bootConfig.enableMemoryWarningObservers);
}

/**
 * 提取小游戏启动场景值。
 * @param {Record<string, any>} options onShow 参数
 * @returns {number | null}
 */
function resolveLaunchScene(options) {
  const scene = Number(options && options.scene);
  return Number.isFinite(scene) ? scene : null;
}

/**
 * 解析内存告警级别。
 * @param {Record<string, any>} memoryWarning 告警对象
 * @returns {number | null}
 */
function resolveMemoryWarningLevel(memoryWarning) {
  const level = Number(memoryWarning && memoryWarning.level);
  return Number.isFinite(level) ? level : null;
}

const runtimeGovernanceApi = {
  RUNTIME_GOVERNANCE_STATE_KEY: RUNTIME_GOVERNANCE_STATE_KEY,
  MEMORY_WARNING_HANDLER_KEY: MEMORY_WARNING_HANDLER_KEY,
  installRuntimeGovernance: installRuntimeGovernance,
  registerMemoryWarningHandler: registerMemoryWarningHandler,
  unregisterMemoryWarningHandler: unregisterMemoryWarningHandler,
  resolveRuntimeGovernanceSnapshot: resolveRuntimeGovernanceSnapshot
};

module.exports = runtimeGovernanceApi;
module.exports.default = runtimeGovernanceApi;
