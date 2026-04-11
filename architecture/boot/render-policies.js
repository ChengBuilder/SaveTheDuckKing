'use strict';

const { logWarn, logDebug } = require('./boot-logger');

const CANVAS_BASE_SIZE_KEY = '__duckCanvasBaseSize';
const CANVAS_RENDER_DPR_KEY = '__duckRenderDpr';

/**
 * 统一画布方向，避免横竖屏信息与画布尺寸不一致。
 * @param {Record<string, any>} systemInfo 系统信息
 */
function normalizeCanvasOrientation(systemInfo) {
  if (typeof canvas === 'undefined' || !canvas) {
    return;
  }

  let targetWidth = canvas.width;
  let targetHeight = canvas.height;
  const isPortraitScreen = Number(systemInfo.screenWidth || 0) < Number(systemInfo.screenHeight || 0);

  if (isPortraitScreen && canvas.width > canvas.height) {
    targetWidth = canvas.height;
    targetHeight = canvas.width;
  }

  if (!isPortraitScreen && canvas.width < canvas.height) {
    targetWidth = canvas.height;
    targetHeight = canvas.width;
  }

  canvas.width = sanitizePositiveInteger(targetWidth, canvas.width);
  canvas.height = sanitizePositiveInteger(targetHeight, canvas.height);
  updateCanvasBaseSize(canvas.width, canvas.height);
}

/**
 * 应用渲染分辨率策略。
 * 这里限制像素比，避免高分屏设备负载过高，同时避免重复启动导致尺寸被重复放大。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {number} renderPixelRatioCap 像素比上限
 */
function applyRenderResolutionPolicy(systemInfo, renderPixelRatioCap) {
  if (typeof canvas === 'undefined' || !canvas || typeof window === 'undefined') {
    logDebug('当前环境不支持渲染分辨率策略，已跳过。');
    return;
  }

  const baseSize = getCanvasBaseSize();
  const rawDpr = Number(window.devicePixelRatio || systemInfo.pixelRatio || 1);
  const adaptiveRenderCap = resolveAdaptiveRenderPixelRatioCap(systemInfo, renderPixelRatioCap);
  const renderDpr = sanitizeRenderDpr(rawDpr, adaptiveRenderCap);
  const normalizedBaseWidth = sanitizePositiveInteger(baseSize.width, canvas.width);
  const normalizedBaseHeight = sanitizePositiveInteger(baseSize.height, canvas.height);
  const targetRenderWidth = sanitizePositiveInteger(
    Math.round(normalizedBaseWidth * renderDpr),
    canvas.width
  );
  const targetRenderHeight = sanitizePositiveInteger(
    Math.round(normalizedBaseHeight * renderDpr),
    canvas.height
  );

  const lastRenderDpr = Number(canvas[CANVAS_RENDER_DPR_KEY]);
  const hasSameRenderState = lastRenderDpr === renderDpr &&
    canvas.width === targetRenderWidth &&
    canvas.height === targetRenderHeight;
  if (hasSameRenderState) {
    logDebug('渲染尺寸未变化，跳过重复设置。', {
      renderDpr: renderDpr,
      width: targetRenderWidth,
      height: targetRenderHeight
    });
    return;
  }

  canvas.width = targetRenderWidth;
  canvas.height = targetRenderHeight;
  canvas[CANVAS_RENDER_DPR_KEY] = renderDpr;
  logDebug('渲染分辨率策略已生效。', {
    renderDpr: renderDpr,
    width: targetRenderWidth,
    height: targetRenderHeight
  });
}

/**
 * 应用帧率策略。
 * 低端机优先稳定性，高端机保持流畅性。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {number} lowEndBenchmarkLevel 低端机阈值
 * @param {number} lowEndFps 低端机目标帧率
 * @param {number} defaultFps 默认帧率
 */
function applyFrameRatePolicy(systemInfo, lowEndBenchmarkLevel, lowEndFps, defaultFps) {
  if (typeof wx === 'undefined' || typeof wx.setPreferredFramesPerSecond !== 'function') {
    logDebug('当前环境不支持帧率设置，已跳过帧率策略。');
    return;
  }

  const benchmarkLevel = Number(systemInfo.benchmarkLevel || 0);
  const targetFps = resolveTargetFrameRate(
    systemInfo,
    lowEndBenchmarkLevel,
    lowEndFps,
    defaultFps
  );

  try {
    wx.setPreferredFramesPerSecond(targetFps);
    logDebug('帧率策略已生效。', {
      benchmarkLevel: benchmarkLevel,
      targetFps: targetFps
    });
  } catch (error) {
    logWarn('设置帧率失败，保持微信默认值。', error);
  }
}

/**
 * 解析当前渲染分辨率快照。
 * 供性能策略与调试观测复用，避免各处重复计算 DPR 与目标尺寸。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {number} renderPixelRatioCap 像素比上限
 * @returns {{
 *   canApplyRenderResolution: boolean,
 *   devicePixelRatio: number,
 *   renderPixelRatioCap: number,
 *   targetRenderDpr: number,
 *   baseWidth: number | null,
 *   baseHeight: number | null,
 *   targetRenderWidth: number | null,
 *   targetRenderHeight: number | null
 * }}
 */
function resolveRenderResolutionState(systemInfo, renderPixelRatioCap) {
  const hasCanvas = typeof canvas !== 'undefined' && Boolean(canvas);
  const hasWindow = typeof window !== 'undefined' && Boolean(window);
  const rawDpr = Number((hasWindow ? window.devicePixelRatio : 0) || systemInfo.pixelRatio || 1);
  const adaptiveRenderCap = resolveAdaptiveRenderPixelRatioCap(systemInfo, renderPixelRatioCap);
  const renderDpr = sanitizeRenderDpr(rawDpr, adaptiveRenderCap);

  if (!hasCanvas) {
    return {
      canApplyRenderResolution: false,
      devicePixelRatio: Number.isFinite(rawDpr) && rawDpr > 0 ? rawDpr : 1,
      renderPixelRatioCap: adaptiveRenderCap,
      targetRenderDpr: renderDpr,
      baseWidth: null,
      baseHeight: null,
      targetRenderWidth: null,
      targetRenderHeight: null
    };
  }

  const baseSize = getCanvasBaseSize();
  const normalizedBaseWidth = sanitizePositiveInteger(baseSize.width, canvas.width);
  const normalizedBaseHeight = sanitizePositiveInteger(baseSize.height, canvas.height);

  return {
    canApplyRenderResolution: hasCanvas && hasWindow,
    devicePixelRatio: Number.isFinite(rawDpr) && rawDpr > 0 ? rawDpr : 1,
    renderPixelRatioCap: adaptiveRenderCap,
    targetRenderDpr: renderDpr,
    baseWidth: normalizedBaseWidth,
    baseHeight: normalizedBaseHeight,
    targetRenderWidth: sanitizePositiveInteger(Math.round(normalizedBaseWidth * renderDpr), canvas.width),
    targetRenderHeight: sanitizePositiveInteger(Math.round(normalizedBaseHeight * renderDpr), canvas.height)
  };
}

/**
 * 解析目标帧率。
 * 低端机优先稳定性，高端机保持默认流畅度。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {number} lowEndBenchmarkLevel 低端机阈值
 * @param {number} lowEndFps 低端机目标帧率
 * @param {number} defaultFps 默认帧率
 * @returns {number}
 */
function resolveTargetFrameRate(systemInfo, lowEndBenchmarkLevel, lowEndFps, defaultFps) {
  const benchmarkLevel = Number(systemInfo.benchmarkLevel || 0);
  let targetFps = benchmarkLevel > 0 && benchmarkLevel <= Number(lowEndBenchmarkLevel)
    ? Number(lowEndFps)
    : Number(defaultFps);
  const normalizedPlatform = String(systemInfo.platform || '').toLocaleLowerCase();

  // 中端机（benchmark <= 30）也适度降档，优先稳定帧时间。
  if (benchmarkLevel > 0 && benchmarkLevel <= 30) {
    targetFps = Math.min(targetFps, 45);
  }
  // Android 设备普遍更容易出现持续发热和掉帧，默认不上 55+。
  if (normalizedPlatform === 'android') {
    targetFps = Math.min(targetFps, 50);
  }
  return sanitizeTargetFrameRate(targetFps);
}

/**
 * 获取画布基础尺寸（未乘 DPR 的逻辑尺寸）。
 * @returns {{width: number, height: number}}
 */
function getCanvasBaseSize() {
  const rawBaseSize = canvas[CANVAS_BASE_SIZE_KEY];
  if (
    rawBaseSize &&
    typeof rawBaseSize === 'object' &&
    Number.isFinite(Number(rawBaseSize.width)) &&
    Number.isFinite(Number(rawBaseSize.height))
  ) {
    return {
      width: sanitizePositiveInteger(rawBaseSize.width, canvas.width),
      height: sanitizePositiveInteger(rawBaseSize.height, canvas.height)
    };
  }

  updateCanvasBaseSize(canvas.width, canvas.height);
  return getCanvasBaseSize();
}

/**
 * 更新画布基础尺寸。
 * @param {number} width 逻辑宽度
 * @param {number} height 逻辑高度
 */
function updateCanvasBaseSize(width, height) {
  canvas[CANVAS_BASE_SIZE_KEY] = {
    width: sanitizePositiveInteger(width, canvas.width),
    height: sanitizePositiveInteger(height, canvas.height)
  };
}

/**
 * 将输入值转为正整数，异常值使用回退值。
 * @param {any} rawValue 输入值
 * @param {any} fallbackValue 回退值
 * @returns {number}
 */
function sanitizePositiveInteger(rawValue, fallbackValue) {
  const normalizedValue = Math.round(Number(rawValue));
  if (Number.isFinite(normalizedValue) && normalizedValue > 0) {
    return normalizedValue;
  }

  const normalizedFallback = Math.round(Number(fallbackValue));
  if (Number.isFinite(normalizedFallback) && normalizedFallback > 0) {
    return normalizedFallback;
  }

  return 1;
}

/**
 * 规范化渲染像素比。
 * @param {number} rawDpr 设备像素比
 * @param {number} renderPixelRatioCap 像素比上限
 * @returns {number}
 */
function sanitizeRenderDpr(rawDpr, renderPixelRatioCap) {
  const normalizedDpr = Number(rawDpr);
  if (!Number.isFinite(normalizedDpr) || normalizedDpr <= 0) {
    return 1;
  }

  const normalizedCap = Number(renderPixelRatioCap);
  if (!Number.isFinite(normalizedCap) || normalizedCap <= 0) {
    return Math.max(1, normalizedDpr);
  }

  return Math.max(1, Math.min(normalizedDpr, normalizedCap));
}

/**
 * 依据机型性能分层动态收紧渲染像素比上限。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {number} renderPixelRatioCap 配置像素比上限
 * @returns {number}
 */
function resolveAdaptiveRenderPixelRatioCap(systemInfo, renderPixelRatioCap) {
  let cap = Number(renderPixelRatioCap);
  if (!Number.isFinite(cap) || cap <= 0) {
    cap = 1.6;
  }

  const benchmarkLevel = Number(systemInfo.benchmarkLevel || 0);
  const normalizedPlatform = String(systemInfo.platform || '').toLocaleLowerCase();

  if (benchmarkLevel > 0 && benchmarkLevel <= 15) {
    cap = Math.min(cap, 1.25);
  } else if (benchmarkLevel > 0 && benchmarkLevel <= 30) {
    cap = Math.min(cap, 1.4);
  }

  if (normalizedPlatform === 'android') {
    cap = Math.min(cap, 1.4);
  }

  return Math.max(1, cap);
}

/**
 * 规范化目标帧率，避免配置异常导致失控。
 * @param {number} rawFps 输入帧率
 * @returns {number}
 */
function sanitizeTargetFrameRate(rawFps) {
  const normalizedFps = Math.round(Number(rawFps));
  if (!Number.isFinite(normalizedFps)) {
    return 45;
  }
  return Math.max(20, Math.min(normalizedFps, 60));
}

module.exports = {
  normalizeCanvasOrientation: normalizeCanvasOrientation,
  applyRenderResolutionPolicy: applyRenderResolutionPolicy,
  applyFrameRatePolicy: applyFrameRatePolicy,
  resolveRenderResolutionState: resolveRenderResolutionState,
  resolveTargetFrameRate: resolveTargetFrameRate
};
