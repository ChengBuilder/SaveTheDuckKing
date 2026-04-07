'use strict';

/**
 * 将自定义 require 暴露给全局，保持与原包行为一致。
 * @param {Function} requireFn 当前模块 require 函数
 */
function exposeRuntimeRequire(requireFn) {
  globalThis.__wxRequire = requireFn;
}

/**
 * 预加载小游戏运行时依赖。
 * @param {Function} requireFn 当前模块 require 函数
 */
function loadRuntimeDependencies(requireFn) {
  requireFn('./web-adapter');
  requireFn('src/polyfills.bundle.43263.js');
  requireFn('src/system.bundle.f45da.js');
  requireFn('subpackages-bootstrap.js');
}

/**
 * 获取插件 require 能力。
 * @returns {(pluginPath: string) => any}
 */
function resolvePluginRequire() {
  if (typeof requirePlugin === 'function') {
    return requirePlugin;
  }

  if (typeof globalThis !== 'undefined' && typeof globalThis.requirePlugin === 'function') {
    return globalThis.requirePlugin;
  }

  return function missingPluginRequire(pluginPath) {
    throw new Error('requirePlugin 不可用，无法加载插件: ' + pluginPath);
  };
}

/**
 * 初始化 SystemJS 运行环境。
 * @param {Function} requireFn 当前模块 require 函数
 */
function warmupSystemRuntime(requireFn) {
  const importMap = requireFn('src/import-map.ae243.js').default;
  const pluginRequire = resolvePluginRequire();

  System.warmup({
    importMap: importMap,
    importMapUrl: 'src/import-map.ae243.js',
    defaultHandler: function defaultRequire(modulePath) {
      requireFn('.' + modulePath);
    },
    handlers: {
      'plugin:': function pluginRequireHandler(modulePath) {
        pluginRequire(modulePath);
      },
      'project:': function projectRequireHandler(modulePath) {
        requireFn(modulePath);
      }
    }
  });
}

module.exports = {
  exposeRuntimeRequire: exposeRuntimeRequire,
  loadRuntimeDependencies: loadRuntimeDependencies,
  warmupSystemRuntime: warmupSystemRuntime
};

