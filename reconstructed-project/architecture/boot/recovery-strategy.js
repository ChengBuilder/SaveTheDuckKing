'use strict';

const { BOOT_RUNTIME_STATE_KEY, markBootFailure } = require('./boot-safety');
const { BOOT_INFO_KEY, markBootPhase, finalizeBootObserver } = require('./boot-observer');
const { logError } = require('./boot-logger');

const FAILURE_PHASE_NAME = 'boot-failed';
const DEFAULT_RECOVERY_STRATEGY = 'manual-retry';
const MAX_ERROR_STACK_LINES = 3;

/**
 * 统一处理启动失败收敛逻辑。
 * @param {Record<string, any>} runtimeBootState 启动状态对象
 * @param {Record<string, any>} bootObserver 启动观测对象
 * @param {any} error 失败原因
 */
function handleBootFailure(runtimeBootState, bootObserver, error) {
  const errorSummary = resolveBootErrorSummary(error);

  markBootFailure(runtimeBootState, error);
  runtimeBootState.lastErrorName = errorSummary.lastErrorName;
  runtimeBootState.lastErrorStackPreview = errorSummary.lastErrorStackPreview;
  runtimeBootState.recoveryStrategy = DEFAULT_RECOVERY_STRATEGY;

  markBootPhase(bootObserver, FAILURE_PHASE_NAME, {
    errorName: errorSummary.lastErrorName,
    errorMessage: errorSummary.lastErrorMessage
  });
  finalizeBootObserver(bootObserver, 'failed', Object.assign({}, errorSummary, {
    recoveryStrategy: DEFAULT_RECOVERY_STRATEGY
  }));

  logError('启动失败。', {
    errorName: errorSummary.lastErrorName,
    errorMessage: errorSummary.lastErrorMessage,
    errorStackPreview: errorSummary.lastErrorStackPreview,
    recoveryStrategy: DEFAULT_RECOVERY_STRATEGY
  });
}

/**
 * 生成启动恢复策略快照。
 * @returns {{
 *  runtimeInfoKey: string,
 *  runtimeStateKey: string,
 *  failurePhaseName: string,
 *  defaultRecoveryStrategy: string,
 *  recordStackPreview: boolean,
 *  maxErrorStackLines: number,
 *  trackedErrorKeys: string[]
 * }}
 */
function resolveRecoveryStrategySnapshot() {
  return {
    runtimeInfoKey: BOOT_INFO_KEY,
    runtimeStateKey: BOOT_RUNTIME_STATE_KEY,
    failurePhaseName: FAILURE_PHASE_NAME,
    defaultRecoveryStrategy: DEFAULT_RECOVERY_STRATEGY,
    recordStackPreview: true,
    maxErrorStackLines: MAX_ERROR_STACK_LINES,
    trackedErrorKeys: [
      'lastErrorName',
      'lastErrorMessage',
      'lastErrorStackPreview',
      'recoveryStrategy'
    ]
  };
}

/**
 * 提取错误摘要。
 * @param {any} error 错误对象
 * @returns {{lastErrorName: string, lastErrorMessage: string, lastErrorStackPreview: string}}
 */
function resolveBootErrorSummary(error) {
  return {
    lastErrorName: resolveErrorName(error),
    lastErrorMessage: resolveErrorMessage(error),
    lastErrorStackPreview: resolveErrorStackPreview(error)
  };
}

/**
 * 提取错误名称。
 * @param {any} error 错误对象
 * @returns {string}
 */
function resolveErrorName(error) {
  if (error && typeof error.name === 'string' && error.name.length > 0) {
    return error.name;
  }
  return 'Error';
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
 * 提取错误堆栈预览。
 * @param {any} error 错误对象
 * @returns {string}
 */
function resolveErrorStackPreview(error) {
  if (!error || typeof error.stack !== 'string' || error.stack.length === 0) {
    return '';
  }

  return error.stack
    .split(/\r?\n/)
    .slice(0, MAX_ERROR_STACK_LINES)
    .join('\n');
}

const recoveryStrategyApi = {
  FAILURE_PHASE_NAME: FAILURE_PHASE_NAME,
  DEFAULT_RECOVERY_STRATEGY: DEFAULT_RECOVERY_STRATEGY,
  MAX_ERROR_STACK_LINES: MAX_ERROR_STACK_LINES,
  handleBootFailure: handleBootFailure,
  resolveRecoveryStrategySnapshot: resolveRecoveryStrategySnapshot
};

module.exports = recoveryStrategyApi;
module.exports.default = recoveryStrategyApi;
