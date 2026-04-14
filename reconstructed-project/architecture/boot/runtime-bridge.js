'use strict';

const { getRuntimeGlobalObject } = require('./global-context');
const { logInfo, logWarn, logError, logDebug } = require('./boot-logger');

/**
 * 将自定义 require 暴露给全局，保持与原包行为一致。
 * @param {Function} requireFn 当前模块 require 函数
 */
function exposeRuntimeRequire(requireFn) {
  const runtimeGlobal = getRuntimeGlobalObject();
  runtimeGlobal.__wxRequire = requireFn;
  logDebug('已注入全局 require 引用。');
}

/**
 * 预加载小游戏运行时依赖。
 * @param {Function} requireFn 当前模块 require 函数
 */
function loadRuntimeDependencies(requireFn) {
  requireFn('./web-adapter');
  requireFn('src/polyfills.bundle.js');
  requireFn('src/system.bundle.js');
  requireFn('subpackages-bootstrap.js');
  logDebug('运行时依赖加载完成。');
}

/**
 * 获取插件 require 能力。
 * @returns {(pluginPath: string) => any}
 */
function resolvePluginRequire() {
  const runtimeGlobal = getRuntimeGlobalObject();

  if (typeof requirePlugin === 'function') {
    return requirePlugin;
  }

  if (typeof runtimeGlobal.requirePlugin === 'function') {
    return runtimeGlobal.requirePlugin;
  }

  return function missingPluginRequire(pluginPath) {
    logError('插件加载能力不可用，无法继续加载插件。', pluginPath);
    throw new Error('requirePlugin 不可用，无法加载插件: ' + pluginPath);
  };
}

/**
 * 初始化 SystemJS 运行环境。
 * @param {Function} requireFn 当前模块 require 函数
 */
function warmupSystemRuntime(requireFn) {
  const importMap = requireFn('src/import-map.js').default;
  const pluginRequire = resolvePluginRequire();

  System.warmup({
    importMap: importMap,
    importMapUrl: 'src/import-map.js',
    defaultHandler: function defaultRequire(modulePath) {
      const normalizedRequirePath = normalizeRuntimeModulePath(modulePath);
      requireFn(normalizedRequirePath);
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
  logInfo('System 运行时预热完成。');
}

/**
 * 规范化运行时模块路径。
 * 兼容 `./xx`、`/xx`、`xx` 三种输入，统一输出可被 require 使用的相对路径。
 * @param {string} modulePath 原始模块路径
 * @returns {string}
 */
function normalizeRuntimeModulePath(modulePath) {
  if (typeof modulePath !== 'string' || modulePath.length === 0) {
    logWarn('收到空模块路径，已回退为当前目录。');
    return '.';
  }

  if (modulePath.startsWith('./')) {
    return modulePath;
  }

  if (modulePath.startsWith('/')) {
    return '.' + modulePath;
  }

  return './' + modulePath;
}

module.exports = {
  exposeRuntimeRequire: exposeRuntimeRequire,
  loadRuntimeDependencies: loadRuntimeDependencies,
  warmupSystemRuntime: warmupSystemRuntime
};
