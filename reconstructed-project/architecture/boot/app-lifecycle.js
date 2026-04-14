'use strict';

const {
  applyRootBundleRequestPatch
} = require('./asset-path-normalizer');
const { logInfo, logWarn, logDebug } = require('./boot-logger');

/**
 * 启动业务应用生命周期。
 * @param {Function} requireFn 当前模块 require 函数
 * @param {Record<string, any>} loadingView 首屏 loading 控制器
 * @param {Record<string, any>} bootConfig 启动配置
 * @param {{onPhase?: Function}} lifecycleObserver 生命周期观测器
 * @returns {Promise<void>}
 */
function startApplicationLifecycle(requireFn, loadingView, bootConfig, lifecycleObserver) {
  logInfo('开始执行应用生命周期启动流程。', {
    startScene: bootConfig.startScene,
    startStyle: bootConfig.startStyle
  });
  notifyLifecyclePhase(lifecycleObserver, 'application-lifecycle-started', {
    startScene: bootConfig.startScene,
    startStyle: bootConfig.startStyle
  });
  return callLoadingViewMethodSafely(
    loadingView,
    'start',
    [bootConfig.startScene, bootConfig.startStyle, bootConfig.autoHideSplash]
  )
    .then(function markLoadingStarted() {
      notifyLifecyclePhase(lifecycleObserver, 'loading-started', {
        autoHideSplash: bootConfig.autoHideSplash
      });
    })
    .then(function loadApplicationModule() {
      return System.import('./application-main.js');
    })
    .then(function markApplicationModuleLoaded(applicationModule) {
      notifyLifecyclePhase(lifecycleObserver, 'application-module-loaded');
      return applicationModule;
    })
    .then(function updateProgressTo20(applicationModule) {
      return callLoadingViewMethodSafely(loadingView, 'setProgress', [0.2]).then(function passModule() {
        notifyLifecyclePhase(lifecycleObserver, 'loading-progress-20', {
          progress: 0.2
        });
        return applicationModule;
      });
    })
    .then(function createApplication(applicationModule) {
      logDebug('应用模块加载完成，准备创建 Application 实例。');
      const applicationInstance = new applicationModule.Application();
      notifyLifecyclePhase(lifecycleObserver, 'application-created');
      return applicationInstance;
    })
    .then(function updateProgressTo40(applicationInstance) {
      return callLoadingViewMethodSafely(loadingView, 'setProgress', [0.4]).then(function passInstance() {
        notifyLifecyclePhase(lifecycleObserver, 'loading-progress-40', {
          progress: 0.4
        });
        return applicationInstance;
      });
    })
    .then(function initializeEngineAndRun(applicationInstance) {
      return System.import('cc')
        .then(function markEngineModuleLoaded(engineModule) {
          notifyLifecyclePhase(lifecycleObserver, 'engine-module-loaded');
          return engineModule;
        })
        .then(function updateProgressTo60(engineModule) {
          return callLoadingViewMethodSafely(loadingView, 'setProgress', [0.6]).then(function passEngineModule() {
            notifyLifecyclePhase(lifecycleObserver, 'loading-progress-60', {
              progress: 0.6
            });
            return engineModule;
          });
        })
        .then(function initApplication(engineModule) {
          requireFn('./engine-adapter');
          applyRootBundleRequestPatch(engineModule);
          return callApplicationMethodAsPromise(
            applicationInstance,
            'init',
            [engineModule]
          ).then(function markApplicationInitialized() {
            notifyLifecyclePhase(lifecycleObserver, 'application-initialized');
          });
        })
        .then(function finalizeAndStart() {
          return callLoadingViewMethodSafely(loadingView, 'end').then(function startApplication() {
            logInfo('加载页结束，准备启动应用实例。');
            notifyLifecyclePhase(lifecycleObserver, 'loading-ended');
            return callApplicationMethodAsPromise(
              applicationInstance,
              'start',
              []
            ).then(function markApplicationStarted() {
              notifyLifecyclePhase(lifecycleObserver, 'application-started');
            });
          });
        });
    });
}

/**
 * 安全调用 loadingView 的生命周期方法。
 * 兼容方法不存在、返回值非 Promise 的场景，避免启动链路中断。
 * @param {Record<string, any>} loadingView 首屏 loading 控制器
 * @param {string} methodName 方法名
 * @param {any[]} methodArgs 方法参数
 * @returns {Promise<any>}
 */
function callLoadingViewMethodSafely(loadingView, methodName, methodArgs) {
  const normalizedArgs = Array.isArray(methodArgs) ? methodArgs : [];
  const method = loadingView ? loadingView[methodName] : null;
  if (typeof method !== 'function') {
    logDebug('loadingView 不存在目标方法，已跳过调用。', methodName);
    return Promise.resolve();
  }

  try {
    const result = method.apply(loadingView, normalizedArgs);
    return Promise.resolve(result);
  } catch (error) {
    logWarn('调用 loadingView 方法失败，已忽略并继续启动。', {
      methodName: methodName,
      error: error
    });
    return Promise.resolve();
  }
}

/**
 * 以 Promise 形式调用应用实例方法。
 * 兼容同步返回与 Promise 返回，同时保留同步异常为 rejected Promise。
 * @param {Record<string, any>} applicationInstance 应用实例
 * @param {string} methodName 方法名
 * @param {any[]} methodArgs 方法参数
 * @returns {Promise<any>}
 */
function callApplicationMethodAsPromise(applicationInstance, methodName, methodArgs) {
  const normalizedArgs = Array.isArray(methodArgs) ? methodArgs : [];
  const method = applicationInstance ? applicationInstance[methodName] : null;
  if (typeof method !== 'function') {
    return Promise.reject(new Error('Application 实例缺少方法: ' + methodName));
  }

  try {
    return Promise.resolve(method.apply(applicationInstance, normalizedArgs));
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * 通知生命周期观测器记录阶段事件。
 * @param {{onPhase?: Function}} lifecycleObserver 生命周期观测器
 * @param {string} phaseName 阶段名称
 * @param {Record<string, any>} extraData 附加数据
 */
function notifyLifecyclePhase(lifecycleObserver, phaseName, extraData) {
  if (!lifecycleObserver || typeof lifecycleObserver.onPhase !== 'function') {
    return;
  }

  try {
    lifecycleObserver.onPhase(phaseName, extraData);
  } catch (error) {
    logWarn('通知生命周期观测器失败，已忽略。', {
      phaseName: phaseName,
      error: error
    });
  }
}

module.exports = {
  startApplicationLifecycle: startApplicationLifecycle
};
