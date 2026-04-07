'use strict';

const { logInfo, logWarn, logDebug } = require('./boot-logger');

/**
 * 启动业务应用生命周期。
 * @param {Function} requireFn 当前模块 require 函数
 * @param {Record<string, any>} loadingView 首屏 loading 控制器
 * @param {Record<string, any>} bootConfig 启动配置
 * @returns {Promise<void>}
 */
function startApplicationLifecycle(requireFn, loadingView, bootConfig) {
  logInfo('开始执行应用生命周期启动流程。', {
    startScene: bootConfig.startScene,
    startStyle: bootConfig.startStyle
  });
  return callLoadingViewMethodSafely(
    loadingView,
    'start',
    [bootConfig.startScene, bootConfig.startStyle, bootConfig.autoHideSplash]
  )
    .then(function loadApplicationModule() {
      return System.import('./application.67fff.js');
    })
    .then(function updateProgressTo20(applicationModule) {
      return callLoadingViewMethodSafely(loadingView, 'setProgress', [0.2]).then(function passModule() {
        return applicationModule;
      });
    })
    .then(function createApplication(applicationModule) {
      logDebug('应用模块加载完成，准备创建 Application 实例。');
      return new applicationModule.Application();
    })
    .then(function updateProgressTo40(applicationInstance) {
      return callLoadingViewMethodSafely(loadingView, 'setProgress', [0.4]).then(function passInstance() {
        return applicationInstance;
      });
    })
    .then(function initializeEngineAndRun(applicationInstance) {
      return System.import('cc')
        .then(function updateProgressTo60(engineModule) {
          return callLoadingViewMethodSafely(loadingView, 'setProgress', [0.6]).then(function passEngineModule() {
            return engineModule;
          });
        })
        .then(function initApplication(engineModule) {
          requireFn('./engine-adapter');
          return applicationInstance.init(engineModule);
        })
        .then(function finalizeAndStart() {
          return callLoadingViewMethodSafely(loadingView, 'end').then(function startApplication() {
            logInfo('加载页结束，准备启动应用实例。');
            return applicationInstance.start();
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

module.exports = {
  startApplicationLifecycle: startApplicationLifecycle
};
