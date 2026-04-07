'use strict';

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
    return;
  }

  const baseSize = getCanvasBaseSize();
  const rawDpr = Number(window.devicePixelRatio || systemInfo.pixelRatio || 1);
  const renderDpr = sanitizeRenderDpr(rawDpr, renderPixelRatioCap);
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
    return;
  }

  canvas.width = targetRenderWidth;
  canvas.height = targetRenderHeight;
  canvas[CANVAS_RENDER_DPR_KEY] = renderDpr;
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
    return;
  }

  const benchmarkLevel = Number(systemInfo.benchmarkLevel || 0);
  const targetFps = benchmarkLevel > 0 && benchmarkLevel <= Number(lowEndBenchmarkLevel)
    ? Number(lowEndFps)
    : Number(defaultFps);

  try {
    wx.setPreferredFramesPerSecond(targetFps);
  } catch (error) {
    console.warn('[Boot] 设置帧率失败，保持微信默认值。', error);
  }
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

module.exports = {
  normalizeCanvasOrientation: normalizeCanvasOrientation,
  applyRenderResolutionPolicy: applyRenderResolutionPolicy,
  applyFrameRatePolicy: applyFrameRatePolicy
};
