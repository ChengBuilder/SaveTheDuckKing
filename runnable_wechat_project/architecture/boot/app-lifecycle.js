'use strict';

/**
 * 启动业务应用生命周期。
 * @param {Function} requireFn 当前模块 require 函数
 * @param {Record<string, any>} loadingView 首屏 loading 控制器
 * @param {Record<string, any>} bootConfig 启动配置
 * @returns {Promise<void>}
 */
function startApplicationLifecycle(requireFn, loadingView, bootConfig) {
  return loadingView
    .start(bootConfig.startScene, bootConfig.startStyle, bootConfig.autoHideSplash)
    .then(function loadApplicationModule() {
      return System.import('./application.67fff.js');
    })
    .then(function updateProgressTo20(applicationModule) {
      return loadingView.setProgress(0.2).then(function passModule() {
        return applicationModule;
      });
    })
    .then(function createApplication(applicationModule) {
      return new applicationModule.Application();
    })
    .then(function updateProgressTo40(applicationInstance) {
      return loadingView.setProgress(0.4).then(function passInstance() {
        return applicationInstance;
      });
    })
    .then(function initializeEngineAndRun(applicationInstance) {
      return System.import('cc')
        .then(function updateProgressTo60(engineModule) {
          return loadingView.setProgress(0.6).then(function passEngineModule() {
            return engineModule;
          });
        })
        .then(function initApplication(engineModule) {
          requireFn('./engine-adapter');
          return applicationInstance.init(engineModule);
        })
        .then(function finalizeAndStart() {
          return loadingView.end().then(function startApplication() {
            return applicationInstance.start();
          });
        });
    });
}

module.exports = {
  startApplicationLifecycle: startApplicationLifecycle
};

