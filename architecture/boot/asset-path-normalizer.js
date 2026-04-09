'use strict';

const { logInfo, logWarn } = require('./boot-logger');

const FLAT_ASSET_PATH_PATCH_FLAG = '__flatAssetPathPatchApplied';
const ROOT_BUNDLE_REQUEST_PATCH_FLAG = '__rootBundleRequestPatchApplied';

/**
 * 为 Cocos 资源加载管线追加扁平目录路径修正。
 * 当前项目已将 import/native 两位分片目录聚合到根目录，因此需要在运行时同步生成新路径。
 * @param {Record<string, any>} engineModule 引擎模块
 */
function applyFlatAssetPathPatch(engineModule) {
  const assetManager = engineModule && engineModule.assetManager;
  const transformPipeline = assetManager && assetManager.transformPipeline;

  if (!assetManager || !transformPipeline || typeof transformPipeline.append !== 'function') {
    logWarn('资源路径规范化补丁未生效，未找到可追加的 transformPipeline。');
    return;
  }

  if (transformPipeline[FLAT_ASSET_PATH_PATCH_FLAG]) {
    return;
  }

  transformPipeline.append(function normalizeFlatBundleAssetUrls(task) {
    const taskItems = Array.isArray(task && task.input) ? task.input : [];
    task.output = taskItems;

    for (let index = 0; index < taskItems.length; index += 1) {
      const taskItem = taskItems[index];
      const normalizedUrl = resolveFlatAssetUrl(taskItem, assetManager);
      if (normalizedUrl) {
        taskItem.url = normalizedUrl;
      }
    }

    return null;
  });

  transformPipeline[FLAT_ASSET_PATH_PATCH_FLAG] = true;
  logInfo('已启用资源扁平目录路径修正。');
}

/**
 * 为 root bundle 请求追加名称归一化。
 * 微信开发者工具在部分链路下会请求 `internalbundle` / `start-scenebundle`，
 * 这里统一归一化到当前目录命名，避免依赖历史目录结构。
 * @param {Record<string, any>} engineModule 引擎模块
 */
function applyRootBundleRequestPatch(engineModule) {
  const assetManager = engineModule && engineModule.assetManager;
  const downloader = assetManager && assetManager.downloader;
  const bundleDownloaders = downloader && downloader._downloaders;
  const originalBundleDownloader = bundleDownloaders && bundleDownloaders.bundle;

  if (!downloader || !bundleDownloaders || typeof originalBundleDownloader !== 'function') {
    logWarn('root bundle 请求归一化补丁未生效，未找到 bundle 下载器。');
    return;
  }

  if (downloader[ROOT_BUNDLE_REQUEST_PATCH_FLAG]) {
    return;
  }

  bundleDownloaders.bundle = function normalizeRootBundleRequest(bundleUrl, requestOptions, onComplete) {
    const normalizedBundleUrl = normalizeRootBundleUrl(bundleUrl);
    return originalBundleDownloader.call(this, normalizedBundleUrl, requestOptions, onComplete);
  };

  downloader[ROOT_BUNDLE_REQUEST_PATCH_FLAG] = true;
  logInfo('已启用 root bundle 请求归一化补丁。');
}

/**
 * 生成扁平化后的资源 URL。
 * @param {Record<string, any>} taskItem 单个资源任务
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {string}
 */
function resolveFlatAssetUrl(taskItem, assetManager) {
  if (!taskItem || typeof taskItem !== 'object') {
    return '';
  }

  const assetBase = resolveTaskItemBase(taskItem, assetManager);
  const assetUuid = typeof taskItem.overrideUuid === 'string' && taskItem.overrideUuid
    ? taskItem.overrideUuid
    : taskItem.uuid;
  const assetExt = typeof taskItem.ext === 'string' ? taskItem.ext : '';

  if (typeof assetBase !== 'string' || typeof assetUuid !== 'string' || assetUuid.length === 0) {
    return '';
  }

  const versionSuffix = resolveTaskItemVersionSuffix(taskItem);
  const normalizedBase = trimTrailingSlash(assetBase);

  if (assetExt === '.ttf') {
    const nativeName = taskItem.options && taskItem.options.__nativeName__;
    if (typeof nativeName === 'string' && nativeName.length > 0) {
      return normalizedBase + '/' + assetUuid + versionSuffix + '/' + nativeName;
    }
  }

  return normalizedBase + '/' + assetUuid + versionSuffix + assetExt;
}

/**
 * 解析任务项对应的 import/native 根路径。
 * @param {Record<string, any>} taskItem 单个资源任务
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {string}
 */
function resolveTaskItemBase(taskItem, assetManager) {
  const assetConfig = taskItem.config;
  if (taskItem.isNative) {
    return assetConfig && assetConfig.nativeBase
      ? assetConfig.base + assetConfig.nativeBase
      : assetManager.generalNativeBase;
  }

  return assetConfig && assetConfig.importBase
    ? assetConfig.base + assetConfig.importBase
    : assetManager.generalImportBase;
}

/**
 * 解析资源版本后缀，保持与原始引擎规则一致。
 * @param {Record<string, any>} taskItem 单个资源任务
 * @returns {string}
 */
function resolveTaskItemVersionSuffix(taskItem) {
  if (!taskItem.info || typeof taskItem.info !== 'object') {
    return '';
  }

  if (taskItem.isNative) {
    return taskItem.info.nativeVer ? '.' + taskItem.info.nativeVer : '';
  }

  return taskItem.info.ver ? '.' + taskItem.info.ver : '';
}

/**
 * 去掉路径尾部斜杠，避免重复拼接。
 * @param {string} assetBase 资源根路径
 * @returns {string}
 */
function trimTrailingSlash(assetBase) {
  return assetBase.endsWith('/') ? assetBase.slice(0, -1) : assetBase;
}

/**
 * 归一化 root bundle 请求名。
 * @param {string} bundleUrl 原始 bundle 请求
 * @returns {string}
 */
function normalizeRootBundleUrl(bundleUrl) {
  if (typeof bundleUrl !== 'string' || bundleUrl.length === 0) {
    return bundleUrl;
  }

  const normalizedUrl = trimTrailingSlash(trimLeadingDotSlash(bundleUrl));
  const bundlePath = normalizedUrl.startsWith('assets/')
    ? normalizedUrl.slice('assets/'.length)
    : normalizedUrl;

  if (bundlePath.endsWith('bundle') && bundlePath.length > 'bundle'.length) {
    return bundlePath.slice(0, -'bundle'.length);
  }

  return bundleUrl;
}

/**
 * 去掉开头的 `./`，方便做 bundle 名归一化。
 * @param {string} relativePath 原始相对路径
 * @returns {string}
 */
function trimLeadingDotSlash(relativePath) {
  return relativePath.startsWith('./') ? relativePath.slice(2) : relativePath;
}

module.exports = {
  applyFlatAssetPathPatch: applyFlatAssetPathPatch,
  applyRootBundleRequestPatch: applyRootBundleRequestPatch
};
