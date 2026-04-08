'use strict';

const { logDebug } = require('./boot-logger');

const STARTUP_MODE_IMMEDIATE = 'immediate';
const STARTUP_MODE_NEXT_FRAME = 'next-frame';

const PLATFORM_STARTUP_RULES = Object.freeze([
  {
    ruleId: 'android-next-frame',
    match: 'Android 且 GameGlobal.requestAnimationFrame 可用',
    startupMode: STARTUP_MODE_NEXT_FRAME,
    reason: '延迟到下一帧启动，规避首帧黑屏风险。'
  },
  {
    ruleId: 'default-immediate',
    match: '其他平台，或缺少 GameGlobal.requestAnimationFrame',
    startupMode: STARTUP_MODE_IMMEDIATE,
    reason: '立即启动，避免额外调度延迟。'
  }
]);

/**
 * 解析当前平台的启动策略。
 * @param {Record<string, any>} systemInfo 系统信息
 * @returns {{platform: string, startupMode: string, matchedRuleId: string, hasRequestAnimationFrame: boolean, reason: string}}
 */
function resolvePlatformStartupStrategy(systemInfo) {
  const normalizedPlatform = normalizePlatform(systemInfo && systemInfo.platform);
  const hasRequestAnimationFrame = hasGameGlobalRequestAnimationFrame();

  if (normalizedPlatform === 'android' && hasRequestAnimationFrame) {
    return {
      platform: normalizedPlatform,
      startupMode: STARTUP_MODE_NEXT_FRAME,
      matchedRuleId: 'android-next-frame',
      hasRequestAnimationFrame: hasRequestAnimationFrame,
      reason: 'Android 平台使用下一帧启动，规避首帧黑屏风险。'
    };
  }

  return {
    platform: normalizedPlatform,
    startupMode: STARTUP_MODE_IMMEDIATE,
    matchedRuleId: 'default-immediate',
    hasRequestAnimationFrame: hasRequestAnimationFrame,
    reason: hasRequestAnimationFrame
      ? '当前平台使用立即启动，减少额外调度。'
      : '运行时缺少 requestAnimationFrame，改为立即启动。'
  };
}

/**
 * 按平台策略调度启动流程。
 * @param {{startupMode: string, matchedRuleId: string, reason: string}} startupStrategy 启动策略
 * @param {Function} startBootFlow 启动函数
 */
function scheduleBootStart(startupStrategy, startBootFlow) {
  if (startupStrategy.startupMode === STARTUP_MODE_NEXT_FRAME && hasGameGlobalRequestAnimationFrame()) {
    logDebug('平台启动策略命中下一帧调度。', startupStrategy);
    GameGlobal.requestAnimationFrame(function startOnNextFrame() {
      startBootFlow();
    });
    return;
  }

  logDebug('平台启动策略命中立即启动。', startupStrategy);
  startBootFlow();
}

/**
 * 生成平台策略快照。
 * 供自动报告读取，避免人工同步规则说明。
 * @returns {{runtimeInfoKey: string, rules: {ruleId: string, match: string, startupMode: string, reason: string}[]}}
 */
function resolvePlatformStrategySnapshot() {
  return {
    runtimeInfoKey: '__DUCK_BOOT_INFO',
    rules: PLATFORM_STARTUP_RULES.map(function mapRule(rule) {
      return {
        ruleId: rule.ruleId,
        match: rule.match,
        startupMode: rule.startupMode,
        reason: rule.reason
      };
    })
  };
}

/**
 * 规范化平台名称。
 * @param {any} platform 平台字段
 * @returns {string}
 */
function normalizePlatform(platform) {
  const normalizedPlatform = String(platform || '').trim().toLocaleLowerCase();
  return normalizedPlatform.length > 0 ? normalizedPlatform : 'unknown';
}

/**
 * 判断运行时是否提供 requestAnimationFrame。
 * @returns {boolean}
 */
function hasGameGlobalRequestAnimationFrame() {
  return typeof GameGlobal !== 'undefined' &&
    Boolean(GameGlobal) &&
    typeof GameGlobal.requestAnimationFrame === 'function';
}

const platformStrategyApi = {
  STARTUP_MODE_IMMEDIATE: STARTUP_MODE_IMMEDIATE,
  STARTUP_MODE_NEXT_FRAME: STARTUP_MODE_NEXT_FRAME,
  PLATFORM_STARTUP_RULES: PLATFORM_STARTUP_RULES,
  resolvePlatformStartupStrategy: resolvePlatformStartupStrategy,
  scheduleBootStart: scheduleBootStart,
  resolvePlatformStrategySnapshot: resolvePlatformStrategySnapshot
};

module.exports = platformStrategyApi;
module.exports.default = platformStrategyApi;
