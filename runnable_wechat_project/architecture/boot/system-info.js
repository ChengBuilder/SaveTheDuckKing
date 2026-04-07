'use strict';

/**
 * 安全读取微信系统信息。
 * @returns {Record<string, any>} 微信系统信息对象
 */
function getSystemInfoSafely() {
  try {
    if (typeof wx !== 'undefined' && typeof wx.getSystemInfoSync === 'function') {
      return wx.getSystemInfoSync() || {};
    }
  } catch (error) {
    console.warn('[Boot] 读取系统信息失败，使用默认值继续启动。', error);
  }
  return {};
}

/**
 * 判断当前平台是否 Android。
 * @param {Record<string, any>} systemInfo 系统信息
 * @returns {boolean}
 */
function isAndroid(systemInfo) {
  return String(systemInfo.platform || '').toLocaleLowerCase() === 'android';
}

/**
 * 获取当前运行时像素比。
 * @param {Record<string, any>} systemInfo 系统信息
 * @returns {number}
 */
function getRuntimePixelRatio(systemInfo) {
  const fallbackDpr = Number(systemInfo.pixelRatio || 1);
  if (typeof window === 'undefined') {
    return fallbackDpr;
  }
  return Number(window.devicePixelRatio || fallbackDpr || 1);
}

module.exports = {
  getSystemInfoSafely: getSystemInfoSafely,
  isAndroid: isAndroid,
  getRuntimePixelRatio: getRuntimePixelRatio
};
