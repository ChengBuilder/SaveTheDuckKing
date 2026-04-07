'use strict';

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

  canvas.width = targetWidth;
  canvas.height = targetHeight;
}

/**
 * 应用渲染分辨率策略。
 * 这里限制像素比，避免高分屏设备负载过高。
 * @param {Record<string, any>} systemInfo 系统信息
 * @param {number} renderPixelRatioCap 像素比上限
 */
function applyRenderResolutionPolicy(systemInfo, renderPixelRatioCap) {
  if (typeof canvas === 'undefined' || !canvas || typeof window === 'undefined') {
    return;
  }

  const rawDpr = Number(window.devicePixelRatio || systemInfo.pixelRatio || 1);
  if (!Number.isFinite(rawDpr) || rawDpr < 1) {
    return;
  }

  const renderDpr = Math.min(rawDpr, Number(renderPixelRatioCap || 1));
  if (renderDpr <= 1) {
    return;
  }

  canvas.width *= renderDpr;
  canvas.height *= renderDpr;
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

module.exports = {
  normalizeCanvasOrientation: normalizeCanvasOrientation,
  applyRenderResolutionPolicy: applyRenderResolutionPolicy,
  applyFrameRatePolicy: applyFrameRatePolicy
};
