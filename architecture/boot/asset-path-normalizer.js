'use strict';

const { logInfo, logWarn } = require('./boot-logger');

const FLAT_ASSET_PATH_PATCH_FLAG = '__flatAssetPathPatchApplied';
const ROOT_BUNDLE_REQUEST_PATCH_FLAG = '__rootBundleRequestPatchApplied';
const CANONICAL_BUNDLE_NAME_MAP = Object.freeze({
  internal: 'internal',
  'start-scene': 'start-scene',
  resources: 'resources',
  main: 'main',
  anibundle: 'aniBundle',
  audiobundle: 'audioBundle',
  duckbundle: 'DuckBundle',
  homebundle: 'HomeBundle',
  uibundle: 'uiBundle'
});
const LEGACY_BUNDLE_ALIAS_NAME_MAP = Object.freeze({
  internalbundle: 'internal',
  'start-scenebundle': 'start-scene',
  resourcesbundle: 'resources',
  mainbundle: 'main',
  anibundlebundle: 'aniBundle',
  audiobundlebundle: 'audioBundle',
  duckbundlebundle: 'DuckBundle',
  homebundlebundle: 'HomeBundle',
  uibundlebundle: 'uiBundle'
});
const CANONICAL_BUNDLE_BASE_MAP = Object.freeze({
  internal: 'assets/internal/',
  'start-scene': 'assets/start-scene/',
  resources: 'subpackages/resources/',
  main: 'subpackages/main/',
  aniBundle: 'subpackages/aniBundle/',
  audioBundle: 'subpackages/audioBundle/',
  DuckBundle: 'subpackages/DuckBundle/',
  HomeBundle: 'subpackages/HomeBundle/',
  uiBundle: 'subpackages/uiBundle/'
});

/**
 * 为 Cocos 资源加载管线追加扁平目录路径修正。
 * 当前项目已将 import/native 两位分片目录聚合到根目录，因此需要在运行时同步生成新路径。
 * @param {Record<string, any>} engineModule 引擎模块
 */
function applyFlatAssetPathPatch(engineModule) {
  const assetManager = engineModule && engineModule.assetManager;
  const transformPipeline = assetManager && assetManager.transformPipeline;

  if (!assetManager || typeof assetManager !== 'object' || !transformPipeline || typeof transformPipeline.append !== 'function') {
    logWarn('资源路径规范化补丁未生效，未找到可追加的 transformPipeline。');
    return;
  }

  if (assetManager[FLAT_ASSET_PATH_PATCH_FLAG]) {
    return;
  }

  transformPipeline.append(function normalizeSelectedFlatBundleAssetUrls(task) {
    const taskItems = Array.isArray(task && task.input) ? task.input : [];
    task.output = taskItems;

    for (let index = 0; index < taskItems.length; index += 1) {
      const taskItem = taskItems[index];
      const normalizedUrl = resolveSafeFlatAssetUrl(taskItem, assetManager);
      if (normalizedUrl) {
        taskItem.url = normalizedUrl;
      }
    }

    return null;
  });

  assetManager[FLAT_ASSET_PATH_PATCH_FLAG] = true;
  logInfo('已启用根包扁平目录路径修正，并保留官方子包加载链路。');
}

/**
 * 为 bundle 请求追加名称归一化。
 * 微信开发者工具和历史解包产物仍会请求旧式 bundle 名，
 * 这里统一归一化到当前真实 bundle 名，确保 Cocos 官方子包下载链路能正确命中。
 * @param {Record<string, any>} engineModule 引擎模块
 */
function applyRootBundleRequestPatch(engineModule) {
  const assetManager = engineModule && engineModule.assetManager;

  if (!assetManager || typeof assetManager !== 'object') {
    logWarn('bundle 请求归一化补丁未生效，未找到 assetManager。');
    return;
  }

  if (assetManager[ROOT_BUNDLE_REQUEST_PATCH_FLAG]) {
    return;
  }

  const downloaderPatched = patchBundleDownloader(assetManager);
  const bundleApiPatched = patchBundleApiMethods(assetManager);

  if (!downloaderPatched && !bundleApiPatched) {
    logWarn('bundle 请求归一化补丁未生效，未找到可包装的 bundle 加载入口。');
    return;
  }

  assetManager[ROOT_BUNDLE_REQUEST_PATCH_FLAG] = true;
  logInfo('已启用 bundle 请求归一化补丁。');
}

/**
 * 包装官方 bundle downloader，保证旧 bundle 名在真正下载前就被归一化。
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {boolean}
 */
function patchBundleDownloader(assetManager) {
  const downloader = assetManager && assetManager.downloader;
  const bundleDownloaders = downloader && downloader._downloaders;
  const originalBundleDownloader = bundleDownloaders && bundleDownloaders.bundle;

  if (!downloader || !bundleDownloaders || typeof originalBundleDownloader !== 'function') {
    return false;
  }

  bundleDownloaders.bundle = function normalizeRootBundleRequest(bundleUrl, requestOptions, onComplete) {
    const normalizedBundleUrl = normalizeBundleUrl(bundleUrl);
    return originalBundleDownloader.call(this, normalizedBundleUrl, requestOptions, onComplete);
  };

  return true;
}

/**
 * 包装 AssetManager 的公开入口，避免旧 bundle 名在缓存和请求对象里重新扩散。
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {boolean}
 */
function patchBundleApiMethods(assetManager) {
  let hasPatchedAnyMethod = false;

  hasPatchedAnyMethod = patchLoadBundleMethod(assetManager) || hasPatchedAnyMethod;
  hasPatchedAnyMethod = patchGetBundleMethod(assetManager) || hasPatchedAnyMethod;
  hasPatchedAnyMethod = patchLoadAnyMethod(assetManager) || hasPatchedAnyMethod;
  hasPatchedAnyMethod = patchPreloadAnyMethod(assetManager) || hasPatchedAnyMethod;

  return hasPatchedAnyMethod;
}

/**
 * 包装 `loadBundle`，在最早入口归一化 bundle 请求并修正回调产物。
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {boolean}
 */
function patchLoadBundleMethod(assetManager) {
  const originalLoadBundle = assetManager && assetManager.loadBundle;
  if (typeof originalLoadBundle !== 'function') {
    return false;
  }

  assetManager.loadBundle = function normalizeLoadBundleArguments() {
    const argumentList = Array.prototype.slice.call(arguments);
    argumentList[0] = normalizeBundleUrl(argumentList[0]);
    return originalLoadBundle.apply(this, argumentList);
  };

  return true;
}

/**
 * 包装 `getBundle`，兼容业务层仍以旧 bundle 名读取缓存。
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {boolean}
 */
function patchGetBundleMethod(assetManager) {
  const originalGetBundle = assetManager && assetManager.getBundle;
  if (typeof originalGetBundle !== 'function') {
    return false;
  }

  assetManager.getBundle = function normalizeGetBundleArguments(bundleName) {
    const normalizedBundleName = normalizeBundleUrl(bundleName);
    return originalGetBundle.call(this, normalizedBundleName)
      || originalGetBundle.call(this, bundleName);
  };

  return true;
}

/**
 * 包装 `loadAny`，统一归一化请求对象和 options 中的 bundle 字段。
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {boolean}
 */
function patchLoadAnyMethod(assetManager) {
  return patchAssetManagerRequestMethod(assetManager, 'loadAny');
}

/**
 * 包装 `preloadAny`，避免旧 bundle 名在预加载阶段绕开官方 bundle 链路。
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {boolean}
 */
function patchPreloadAnyMethod(assetManager) {
  return patchAssetManagerRequestMethod(assetManager, 'preloadAny');
}

/**
 * 包装 `loadAny/preloadAny` 这类接收 request + options 的公共入口。
 * @param {Record<string, any>} assetManager 资源管理器
 * @param {string} methodName 方法名
 * @returns {boolean}
 */
function patchAssetManagerRequestMethod(assetManager, methodName) {
  const originalMethod = assetManager && assetManager[methodName];
  if (typeof originalMethod !== 'function') {
    return false;
  }

  assetManager[methodName] = function normalizeAssetManagerRequestArguments() {
    const argumentList = Array.prototype.slice.call(arguments);
    if (argumentList.length > 0) {
      argumentList[0] = normalizeAssetRequest(argumentList[0]);
    }
    if (argumentList.length > 1) {
      argumentList[1] = normalizeAssetRequestOptions(argumentList[1]);
    }
    return originalMethod.apply(this, argumentList);
  };

  return true;
}

/**
 * 归一化单个资源请求对象中的 bundle 字段。
 * @param {any} request 原始请求
 * @returns {any}
 */
function normalizeAssetRequest(request) {
  if (Array.isArray(request)) {
    for (let index = 0; index < request.length; index += 1) {
      request[index] = normalizeAssetRequest(request[index]);
    }
    return request;
  }

  if (!request || typeof request !== 'object') {
    return request;
  }

  if (typeof request.bundle !== 'string') {
    return request;
  }

  const normalizedBundleName = normalizeBundleUrl(request.bundle);
  if (normalizedBundleName === request.bundle) {
    return request;
  }

  request.bundle = normalizedBundleName;
  return request;
}

/**
 * 归一化 `loadAny/preloadAny` options 中的 bundle 字段。
 * @param {any} options 原始选项
 * @returns {any}
 */
function normalizeAssetRequestOptions(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    return options;
  }

  if (typeof options.bundle !== 'string') {
    return options;
  }

  const normalizedBundleName = normalizeBundleUrl(options.bundle);
  if (normalizedBundleName === options.bundle) {
    return options;
  }

  options.bundle = normalizedBundleName;
  return options;
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
 * 仅为根包生成扁平化资源 URL，避免子包绕开官方 `wx.loadSubpackage()` 链路。
 * @param {Record<string, any>} taskItem 单个资源任务
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {string}
 */
function resolveSafeFlatAssetUrl(taskItem, assetManager) {
  const assetBase = resolveTaskItemBase(taskItem, assetManager);
  if (!shouldRewriteFlatAssetBase(assetBase)) {
    return '';
  }

  return resolveFlatAssetUrl(taskItem, assetManager);
}

/**
 * 解析任务项对应的 import/native 根路径。
 * @param {Record<string, any>} taskItem 单个资源任务
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {string}
 */
function resolveTaskItemBase(taskItem, assetManager) {
  const assetConfig = taskItem && taskItem.config && typeof taskItem.config === 'object'
    ? taskItem.config
    : null;
  const bundleBase = resolveNormalizedTaskBundleBase(assetConfig);

  if (taskItem.isNative) {
    return assetConfig && assetConfig.nativeBase
      ? joinAssetBase(bundleBase, assetConfig.nativeBase)
      : normalizeAssetBasePath(assetManager.generalNativeBase);
  }

  return assetConfig && assetConfig.importBase
    ? joinAssetBase(bundleBase, assetConfig.importBase)
    : normalizeAssetBasePath(assetManager.generalImportBase);
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
 * 确保路径末尾带有斜杠，便于后续安全拼接 import/native 子目录。
 * @param {string} assetBase 资源根路径
 * @returns {string}
 */
function ensureTrailingSlash(assetBase) {
  if (typeof assetBase !== 'string' || assetBase.length === 0) {
    return assetBase;
  }

  return assetBase.endsWith('/') ? assetBase : assetBase + '/';
}

/**
 * 拼接 bundle base 与 import/native 相对目录。
 * @param {string} assetBase bundle 根目录
 * @param {string} relativeBase import/native 相对目录
 * @returns {string}
 */
function joinAssetBase(assetBase, relativeBase) {
  const normalizedBase = normalizeAssetBasePath(assetBase);
  if (typeof normalizedBase !== 'string' || normalizedBase.length === 0) {
    return normalizedBase;
  }

  return ensureTrailingSlash(normalizedBase) + String(relativeBase || '');
}

/**
 * 解析 taskItem config 对应的规范 bundle 根目录，但不改写原始 config。
 * @param {Record<string, any> | null} assetConfig 任务项配置
 * @returns {string}
 */
function resolveNormalizedTaskBundleBase(assetConfig) {
  if (!assetConfig || typeof assetConfig !== 'object') {
    return '';
  }

  const normalizedBundleName = normalizeBundleName(assetConfig.name);
  if (normalizedBundleName) {
    return normalizeBundleBase(assetConfig.base, normalizedBundleName);
  }

  return normalizeAssetBasePath(assetConfig.base);
}

/**
 * 将 bundle base 修正到 canonical 根目录，并保留本地 bundle 的尾部结构。
 * @param {string} bundleBase 原始 bundle 根目录
 * @param {string} normalizedBundleName 归一化后的 bundle 名
 * @returns {string}
 */
function normalizeBundleBase(bundleBase, normalizedBundleName) {
  const canonicalBundleBase = CANONICAL_BUNDLE_BASE_MAP[normalizedBundleName];
  if (!canonicalBundleBase) {
    return normalizeAssetBasePath(bundleBase);
  }

  if (typeof bundleBase !== 'string' || bundleBase.length === 0) {
    return canonicalBundleBase;
  }

  const normalizedBase = normalizeAssetBasePath(bundleBase);
  if (normalizedBase !== bundleBase) {
    return ensureTrailingSlash(normalizedBase);
  }

  if (isLocalBundleBase(bundleBase)) {
    return canonicalBundleBase;
  }

  return ensureTrailingSlash(bundleBase);
}

/**
 * 将旧式 `assets/*bundle` 路径转换为当前真实 bundle 根目录。
 * @param {string} assetBase 原始资源根路径
 * @returns {string}
 */
function normalizeAssetBasePath(assetBase) {
  if (typeof assetBase !== 'string' || assetBase.length === 0) {
    return assetBase;
  }

  const normalizedBase = normalizeSlashes(trimLeadingDotSlash(assetBase));
  if (/^[a-z]+:\/\//i.test(normalizedBase)) {
    return assetBase;
  }

  const hadTrailingSlash = normalizedBase.endsWith('/');
  const trimmedBase = trimTrailingSlash(normalizedBase);
  const bundlePath = extractBundlePath(trimmedBase);
  const bundleName = bundlePath.split('/')[0];
  const normalizedBundleName = normalizeBundleName(bundleName);

  if (!normalizedBundleName || !Object.prototype.hasOwnProperty.call(CANONICAL_BUNDLE_BASE_MAP, normalizedBundleName)) {
    return assetBase;
  }

  const canonicalBundleBase = CANONICAL_BUNDLE_BASE_MAP[normalizedBundleName];
  const remainderPath = bundlePath.slice(bundleName.length);
  const remappedBase = trimTrailingSlash(canonicalBundleBase) + remainderPath;
  return hadTrailingSlash ? ensureTrailingSlash(remappedBase) : remappedBase;
}

/**
 * 提取 bundle 请求的相对路径部分，兼容 `assets/` 与 `subpackages/` 前缀。
 * @param {string} bundleUrl 原始 bundle 请求
 * @returns {string}
 */
function extractBundlePath(bundleUrl) {
  const normalizedUrl = trimTrailingSlash(trimLeadingDotSlash(normalizeSlashes(bundleUrl)));
  if (normalizedUrl.startsWith('assets/')) {
    return normalizedUrl.slice('assets/'.length);
  }
  if (normalizedUrl.startsWith('subpackages/')) {
    return normalizedUrl.slice('subpackages/'.length);
  }
  return normalizedUrl;
}

/**
 * 从 bundle 请求中抽取 bundle 名称。
 * @param {string} bundleUrl 原始 bundle 请求
 * @returns {string}
 */
function extractBundleNameFromUrl(bundleUrl) {
  if (typeof bundleUrl !== 'string' || bundleUrl.length === 0) {
    return '';
  }

  if (/^[a-z]+:\/\//i.test(bundleUrl)) {
    return '';
  }

  return extractBundlePath(bundleUrl).split('/')[0];
}

/**
 * 将 bundle 名统一映射为当前项目使用的 canonical 名称。
 * @param {string} bundleName 原始 bundle 名
 * @returns {string}
 */
function normalizeBundleName(bundleName) {
  if (typeof bundleName !== 'string' || bundleName.length === 0) {
    return '';
  }

  const normalizedKey = String(bundleName).toLowerCase();
  if (Object.prototype.hasOwnProperty.call(CANONICAL_BUNDLE_NAME_MAP, normalizedKey)) {
    return CANONICAL_BUNDLE_NAME_MAP[normalizedKey];
  }
  if (Object.prototype.hasOwnProperty.call(LEGACY_BUNDLE_ALIAS_NAME_MAP, normalizedKey)) {
    return LEGACY_BUNDLE_ALIAS_NAME_MAP[normalizedKey];
  }
  return '';
}

/**
 * 统一路径分隔符，避免 Windows 风格路径干扰匹配。
 * @param {string} inputPath 原始路径
 * @returns {string}
 */
function normalizeSlashes(inputPath) {
  return String(inputPath || '').replace(/\\/g, '/');
}

/**
 * 当前仅允许 `internal` / `start-scene` 根包继续走扁平目录修正。
 * 子包必须保留官方 bundle 下载链路，否则会在未加载子包时直接访问真实文件。
 * @param {string} assetBase 原始资源根路径
 * @returns {boolean}
 */
function shouldRewriteFlatAssetBase(assetBase) {
  if (typeof assetBase !== 'string' || assetBase.length === 0) {
    return false;
  }

  const normalizedBase = normalizeSlashes(trimLeadingDotSlash(assetBase));
  return normalizedBase.startsWith('assets/internal/')
    || normalizedBase.startsWith('assets/start-scene/');
}

/**
 * 判断 bundle base 是否仍指向本地包目录，便于安全覆盖为 canonical 路径。
 * @param {string} bundleBase 原始 bundle 根目录
 * @returns {boolean}
 */
function isLocalBundleBase(bundleBase) {
  if (typeof bundleBase !== 'string' || bundleBase.length === 0) {
    return false;
  }

  const normalizedBase = normalizeSlashes(trimLeadingDotSlash(bundleBase));
  return normalizedBase.startsWith('assets/') || normalizedBase.startsWith('subpackages/');
}

/**
 * 归一化 bundle 请求名。
 * @param {string} bundleUrl 原始 bundle 请求
 * @returns {string}
 */
function normalizeBundleUrl(bundleUrl) {
  if (typeof bundleUrl !== 'string' || bundleUrl.length === 0) {
    return bundleUrl;
  }

  const normalizedBundleName = normalizeBundleName(extractBundleNameFromUrl(bundleUrl));
  if (normalizedBundleName) {
    return normalizedBundleName;
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
