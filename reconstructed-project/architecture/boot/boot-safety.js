'use strict';

const { getRuntimeStateStore } = require('./global-context');
const { logDebug } = require('./boot-logger');

const BOOT_RUNTIME_STATE_KEY = '__DUCK_BOOT_RUNTIME_STATE';
const BOOT_STATUS_IDLE = 'idle';
const BOOT_STATUS_PENDING = 'pending';
const BOOT_STATUS_RUNNING = 'running';
const BOOT_STATUS_COMPLETED = 'completed';
const BOOT_STATUS_FAILED = 'failed';

/**
 * 读取启动状态对象。
 * @returns {Record<string, any>}
 */
function resolveBootRuntimeState() {
  const runtimeBootState = getRuntimeStateStore(BOOT_RUNTIME_STATE_KEY);
  if (typeof runtimeBootState.status !== 'string') {
    runtimeBootState.status = BOOT_STATUS_IDLE;
  }
  return runtimeBootState;
}

/**
 * 更新启动状态。
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @param {string} nextStatus 目标状态
 * @param {Record<string, any>} extraMetadata 附加信息
 */
function markBootStatus(runtimeBootState, nextStatus, extraMetadata) {
  const normalizedMetadata = extraMetadata && typeof extraMetadata === 'object'
    ? extraMetadata
    : {};
  runtimeBootState.status = nextStatus;
  runtimeBootState.updatedAt = new Date().toISOString();
  runtimeBootState.lastTransition = nextStatus;

  for (const metadataKey of Object.keys(normalizedMetadata)) {
    runtimeBootState[metadataKey] = normalizedMetadata[metadataKey];
  }

  logDebug('启动状态已更新。', {
    status: nextStatus,
    updatedAt: runtimeBootState.updatedAt,
    extraMetadata: normalizedMetadata
  });
}

/**
 * 判断当前是否应跳过重复启动。
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @returns {boolean}
 */
function shouldSkipBoot(runtimeBootState) {
  return runtimeBootState.status === BOOT_STATUS_PENDING ||
    runtimeBootState.status === BOOT_STATUS_RUNNING ||
    runtimeBootState.status === BOOT_STATUS_COMPLETED;
}

/**
 * 记录启动失败状态。
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @param {any} error 失败原因
 */
function markBootFailure(runtimeBootState, error) {
  markBootStatus(runtimeBootState, BOOT_STATUS_FAILED, {
    lastErrorMessage: resolveErrorMessage(error)
  });
}

/**
 * 生成启动安全规则快照。
 * @returns {{stateStoreKey: string, skipStatuses: string[], finalStatuses: string[]}}
 */
function resolveBootSafetySnapshot() {
  return {
    stateStoreKey: BOOT_RUNTIME_STATE_KEY,
    skipStatuses: [BOOT_STATUS_PENDING, BOOT_STATUS_RUNNING, BOOT_STATUS_COMPLETED],
    finalStatuses: [BOOT_STATUS_COMPLETED, BOOT_STATUS_FAILED]
  };
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

const bootSafetyApi = {
  BOOT_RUNTIME_STATE_KEY: BOOT_RUNTIME_STATE_KEY,
  BOOT_STATUS_IDLE: BOOT_STATUS_IDLE,
  BOOT_STATUS_PENDING: BOOT_STATUS_PENDING,
  BOOT_STATUS_RUNNING: BOOT_STATUS_RUNNING,
  BOOT_STATUS_COMPLETED: BOOT_STATUS_COMPLETED,
  BOOT_STATUS_FAILED: BOOT_STATUS_FAILED,
  resolveBootRuntimeState: resolveBootRuntimeState,
  markBootStatus: markBootStatus,
  shouldSkipBoot: shouldSkipBoot,
  markBootFailure: markBootFailure,
  resolveBootSafetySnapshot: resolveBootSafetySnapshot
};

module.exports = bootSafetyApi;
module.exports.default = bootSafetyApi;
