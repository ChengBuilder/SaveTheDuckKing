'use strict';

/**
 * 获取运行时全局对象。
 * 兼容小游戏、浏览器与 Node 环境，避免直接依赖 globalThis 导致兼容问题。
 * @returns {Record<string, any>}
 */
function getRuntimeGlobalObject() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof GameGlobal !== 'undefined') {
    return GameGlobal;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return Function('return this')();
}

/**
 * 读取或创建运行时状态对象。
 * @param {string} stateKey 状态键
 * @returns {Record<string, any>}
 */
function getRuntimeStateStore(stateKey) {
  const runtimeGlobal = getRuntimeGlobalObject();
  const rawStore = runtimeGlobal[stateKey];
  if (!rawStore || typeof rawStore !== 'object') {
    runtimeGlobal[stateKey] = {};
  }
  return runtimeGlobal[stateKey];
}

module.exports = {
  getRuntimeGlobalObject: getRuntimeGlobalObject,
  getRuntimeStateStore: getRuntimeStateStore
};

