'use strict';

const { logInfo, logWarn } = require('./boot-logger');

const FLAT_ASSET_PATH_PATCH_FLAG = '__flatAssetPathPatchApplied';
const ROOT_BUNDLE_REQUEST_PATCH_FLAG = '__rootBundleRequestPatchApplied';
const LEGACY_HOME_BUNDLE_PATH_PATCH_FLAG = '__legacyHomeBundlePathPatchApplied';
const UI_BUNDLE_SETTINGS_LEGACY_PATH_MAP = Object.freeze({
  'tex/设置/x': 'tex/settings/closeIcon',
  'tex/设置/关': 'tex/settings/toggleOffState',
  'tex/设置/关(字)': 'tex/settings/toggleOffText',
  'tex/设置/开': 'tex/settings/toggleOnState',
  'tex/设置/开(字)': 'tex/settings/toggleOnText',
  'tex/设置/开关槽': 'tex/settings/toggleTrackPrimary',
  'tex/设置/开关槽1': 'tex/settings/toggleTrackSecondary',
  'tex/设置/放弃挑战': 'tex/settings/giveUpChallengeText',
  'tex/设置/设置': 'tex/settings/settingsText',
  'tex/设置/返回主页': 'tex/settings/backToHomeText',
  'tex/设置/震动': 'tex/settings/vibrationText',
  'tex/设置/震动图标': 'tex/settings/vibrationIcon',
  'tex/设置/音乐': 'tex/settings/musicText',
  'tex/设置/音乐图标': 'tex/settings/musicIcon',
  'tex/设置/音效': 'tex/settings/soundEffectText',
  'tex/设置/音效图标': 'tex/settings/soundEffectIcon',
  'tex/设置/齿轮': 'tex/settings/gearIcon',
  'tex/设置二级/%': 'tex/settingsDialog/percentSign',
  'tex/设置二级/再试试': 'tex/settingsDialog/tryAgainText',
  'tex/设置二级/当前进度：': 'tex/settingsDialog/currentProgressText',
  'tex/设置二级/确定吗': 'tex/settingsDialog/confirmQuestionText',
  'tex/设置二级/马上要通关了': 'tex/settingsDialog/nearCompletionText',
  'tex/设置二级/鸭子set': 'tex/settingsDialog/duckSetText'
});
const UI_BUNDLE_SETTINGS_LEGACY_PATH_ENTRIES = Object.entries(UI_BUNDLE_SETTINGS_LEGACY_PATH_MAP);

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
 * 为 root bundle 请求追加语义化目录兼容。
 * 微信开发者工具在部分链路下会请求 `internalbundle` / `start-scenebundle`，
 * 这里统一归一化到当前语义化目录名，避免继续回退到旧文件结构。
 * @param {Record<string, any>} engineModule 引擎模块
 */
function applyRootBundleRequestPatch(engineModule) {
  const assetManager = engineModule && engineModule.assetManager;
  const downloader = assetManager && assetManager.downloader;
  const bundleDownloaders = downloader && downloader._downloaders;
  const originalBundleDownloader = bundleDownloaders && bundleDownloaders.bundle;

  if (!downloader || !bundleDownloaders || typeof originalBundleDownloader !== 'function') {
    logWarn('root bundle 请求兼容补丁未生效，未找到 bundle 下载器。');
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
 * 为 HomeBundle 追加旧路径兼容补丁。
 * 语义化重构后配置已从 `tex/BgThings*` 迁移到 `tex/homeTheme*`，
 * 这里在 bundle API 入参层做一次路径归一化，兼容仍使用旧路径的业务调用。
 * @param {Record<string, any>} engineModule 引擎模块
 */
function applyHomeBundleLegacyPathPatch(engineModule) {
  const assetManager = engineModule && engineModule.assetManager;
  if (!assetManager || typeof assetManager !== 'object') {
    logWarn('HomeBundle 旧路径兼容补丁未生效，未找到 assetManager。');
    return;
  }

  if (assetManager[LEGACY_HOME_BUNDLE_PATH_PATCH_FLAG]) {
    return;
  }

  const patchedAssetManagerMethods = patchAssetManagerPathMethods(assetManager);
  const bundlePrototype = assetManager.Bundle && assetManager.Bundle.prototype;
  const patchedBundleMethods = patchBundlePathMethods(bundlePrototype);
  const patchedMethods = patchedAssetManagerMethods.concat(patchedBundleMethods);

  if (patchedMethods.length === 0) {
    logWarn('HomeBundle 旧路径兼容补丁未生效，未找到可代理的资源加载方法。');
    return;
  }

  assetManager[LEGACY_HOME_BUNDLE_PATH_PATCH_FLAG] = true;
  logInfo('已启用 HomeBundle 旧路径兼容补丁。', {
    methods: patchedMethods
  });
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
 * 对 Bundle 资源加载 API 做代理，拦截 HomeBundle 的旧路径请求。
 * @param {Record<string, any>} bundlePrototype Bundle 原型
 * @param {string} methodName 方法名
 * @returns {boolean}
 */
function patchBundlePathMethod(bundlePrototype, methodName) {
  const originalMethod = bundlePrototype[methodName];
  if (typeof originalMethod !== 'function') {
    return false;
  }

  bundlePrototype[methodName] = function patchedBundlePathMethod() {
    const methodArgs = Array.prototype.slice.call(arguments);
    if (methodArgs.length > 0 && shouldNormalizeBundleRequest(this, methodArgs[0])) {
      methodArgs[0] = normalizeLegacyBundleRequestInput(methodArgs[0]);
    }
    return originalMethod.apply(this, methodArgs);
  };

  return true;
}

/**
 * 判断当前 bundle 请求是否需要做旧路径归一化。
 * @param {Record<string, any>} bundleInstance bundle 实例
 * @param {any} requestInput 请求参数
 * @returns {boolean}
 */
function shouldNormalizeBundleRequest(bundleInstance, requestInput) {
  return isHomeBundle(bundleInstance) ||
    isUiBundle(bundleInstance) ||
    hasLegacyHomeBundlePath(requestInput) ||
    hasLegacyUiBundlePath(requestInput);
}

/**
 * 对 assetManager 级别的资源加载入口做代理，兜底兼容旧路径。
 * @param {Record<string, any>} assetManager 资源管理器
 * @returns {string[]}
 */
function patchAssetManagerPathMethods(assetManager) {
  const patchedMethods = [];
  const methodNames = ['loadAny', 'preloadAny'];

  for (let index = 0; index < methodNames.length; index += 1) {
    const methodName = methodNames[index];
    const originalMethod = assetManager[methodName];
    if (typeof originalMethod !== 'function') {
      continue;
    }

    assetManager[methodName] = function patchedAssetManagerPathMethod() {
      const methodArgs = Array.prototype.slice.call(arguments);
      normalizeAssetManagerRequestArgs(methodArgs);
      return originalMethod.apply(this, methodArgs);
    };
    patchedMethods.push('assetManager.' + methodName);
  }

  return patchedMethods;
}

/**
 * 对 Bundle 原型方法做代理（若运行时提供了 Bundle 原型）。
 * @param {Record<string, any>} bundlePrototype Bundle 原型
 * @returns {string[]}
 */
function patchBundlePathMethods(bundlePrototype) {
  if (!bundlePrototype || typeof bundlePrototype !== 'object') {
    return [];
  }

  if (bundlePrototype[LEGACY_HOME_BUNDLE_PATH_PATCH_FLAG]) {
    return [];
  }

  const patchedMethods = [];
  const methodNames = ['load', 'preload', 'loadDir', 'preloadDir', 'get'];
  for (let index = 0; index < methodNames.length; index += 1) {
    const methodName = methodNames[index];
    if (patchBundlePathMethod(bundlePrototype, methodName)) {
      patchedMethods.push('Bundle.' + methodName);
    }
  }

  if (patchedMethods.length > 0) {
    bundlePrototype[LEGACY_HOME_BUNDLE_PATH_PATCH_FLAG] = true;
  }

  return patchedMethods;
}

/**
 * 归一化 assetManager.loadAny/preloadAny 的请求参数。
 * @param {any[]} methodArgs 原始参数数组
 */
function normalizeAssetManagerRequestArgs(methodArgs) {
  if (!Array.isArray(methodArgs) || methodArgs.length === 0) {
    return;
  }

  const requestInput = methodArgs[0];
  const options = resolveAssetManagerOptionsArg(methodArgs);
  if (
    !isHomeBundleContextByOptions(options) &&
    !isHomeBundleContextByRequest(requestInput) &&
    !isUiBundleContextByOptions(options) &&
    !isUiBundleContextByRequest(requestInput) &&
    !hasLegacyHomeBundlePath(requestInput) &&
    !hasLegacyUiBundlePath(requestInput)
  ) {
    return;
  }

  methodArgs[0] = normalizeLegacyBundleRequestInput(requestInput);
}

/**
 * 提取 assetManager.loadAny/preloadAny 的 options 参数。
 * @param {any[]} methodArgs 参数数组
 * @returns {Record<string, any> | null}
 */
function resolveAssetManagerOptionsArg(methodArgs) {
  if (!Array.isArray(methodArgs) || methodArgs.length < 2) {
    return null;
  }

  const options = methodArgs[1];
  return options && typeof options === 'object' && !Array.isArray(options)
    ? options
    : null;
}

/**
 * 基于 options 判断是否属于 HomeBundle 请求。
 * @param {Record<string, any> | null} options 请求选项
 * @returns {boolean}
 */
function isHomeBundleContextByOptions(options) {
  if (!options || typeof options !== 'object') {
    return false;
  }

  return isHomeBundleValue(options.bundle);
}

/**
 * 基于 request 判断是否属于 HomeBundle 请求。
 * @param {any} requestInput 请求对象
 * @returns {boolean}
 */
function isHomeBundleContextByRequest(requestInput) {
  if (!requestInput) {
    return false;
  }

  if (Array.isArray(requestInput)) {
    for (let index = 0; index < requestInput.length; index += 1) {
      if (isHomeBundleContextByRequest(requestInput[index])) {
        return true;
      }
    }
    return false;
  }

  if (typeof requestInput === 'object') {
    if (isHomeBundleValue(requestInput.bundle)) {
      return true;
    }

    if (requestInput.options && isHomeBundleValue(requestInput.options.bundle)) {
      return true;
    }
  }

  return false;
}

/**
 * 基于 options 判断是否属于 uiBundle 请求。
 * @param {Record<string, any> | null} options 请求选项
 * @returns {boolean}
 */
function isUiBundleContextByOptions(options) {
  if (!options || typeof options !== 'object') {
    return false;
  }

  return isUiBundleValue(options.bundle);
}

/**
 * 基于 request 判断是否属于 uiBundle 请求。
 * @param {any} requestInput 请求对象
 * @returns {boolean}
 */
function isUiBundleContextByRequest(requestInput) {
  if (!requestInput) {
    return false;
  }

  if (Array.isArray(requestInput)) {
    for (let index = 0; index < requestInput.length; index += 1) {
      if (isUiBundleContextByRequest(requestInput[index])) {
        return true;
      }
    }
    return false;
  }

  if (typeof requestInput === 'object') {
    if (isUiBundleValue(requestInput.bundle)) {
      return true;
    }

    if (requestInput.options && isUiBundleValue(requestInput.options.bundle)) {
      return true;
    }
  }

  return false;
}

/**
 * 判断值是否代表 HomeBundle。
 * @param {any} bundleValue bundle 值
 * @returns {boolean}
 */
function isHomeBundleValue(bundleValue) {
  if (!bundleValue) {
    return false;
  }

  if (typeof bundleValue === 'string') {
    return bundleValue === 'HomeBundle' || bundleValue === 'home-bundle' || bundleValue === 'homebundle';
  }

  if (typeof bundleValue === 'object') {
    if (typeof bundleValue.name === 'string') {
      return isHomeBundleValue(bundleValue.name);
    }
  }

  return false;
}

/**
 * 判断值是否代表 uiBundle。
 * @param {any} bundleValue bundle 值
 * @returns {boolean}
 */
function isUiBundleValue(bundleValue) {
  if (!bundleValue) {
    return false;
  }

  if (typeof bundleValue === 'string') {
    return bundleValue === 'uiBundle' || bundleValue === 'ui-bundle' || bundleValue === 'uibundle';
  }

  if (typeof bundleValue === 'object') {
    if (typeof bundleValue.name === 'string') {
      return isUiBundleValue(bundleValue.name);
    }
  }

  return false;
}

/**
 * 判断请求参数中是否包含旧版 HomeBundle 路径。
 * @param {any} requestInput 请求参数
 * @returns {boolean}
 */
function hasLegacyHomeBundlePath(requestInput, visitedObjects) {
  const visited = visitedObjects || new Set();
  if (typeof requestInput === 'string') {
    const normalizedPath = trimLeadingDotSlash(requestInput);
    return /^tex\/BgThings\d+\/.+/.test(normalizedPath);
  }

  if (Array.isArray(requestInput)) {
    for (let index = 0; index < requestInput.length; index += 1) {
      if (hasLegacyHomeBundlePath(requestInput[index], visited)) {
        return true;
      }
    }
    return false;
  }

  if (requestInput && typeof requestInput === 'object') {
    if (visited.has(requestInput)) {
      return false;
    }
    visited.add(requestInput);

    const keys = Object.keys(requestInput);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      if (hasLegacyHomeBundlePath(requestInput[key], visited)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 判断请求参数中是否包含旧版 uiBundle 路径。
 * @param {any} requestInput 请求参数
 * @returns {boolean}
 */
function hasLegacyUiBundlePath(requestInput, visitedObjects) {
  const visited = visitedObjects || new Set();
  if (typeof requestInput === 'string') {
    return normalizeUiBundleLegacyPath(requestInput) !== requestInput;
  }

  if (Array.isArray(requestInput)) {
    for (let index = 0; index < requestInput.length; index += 1) {
      if (hasLegacyUiBundlePath(requestInput[index], visited)) {
        return true;
      }
    }
    return false;
  }

  if (requestInput && typeof requestInput === 'object') {
    if (visited.has(requestInput)) {
      return false;
    }
    visited.add(requestInput);

    const keys = Object.keys(requestInput);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      if (hasLegacyUiBundlePath(requestInput[key], visited)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 判断当前 bundle 是否为 HomeBundle。
 * @param {Record<string, any>} bundleInstance bundle 实例
 * @returns {boolean}
 */
function isHomeBundle(bundleInstance) {
  if (!bundleInstance || typeof bundleInstance.name !== 'string') {
    return false;
  }

  const bundleName = bundleInstance.name;
  return bundleName === 'HomeBundle' || bundleName === 'home-bundle' || bundleName === 'homebundle';
}

/**
 * 判断当前 bundle 是否为 uiBundle。
 * @param {Record<string, any>} bundleInstance bundle 实例
 * @returns {boolean}
 */
function isUiBundle(bundleInstance) {
  if (!bundleInstance || typeof bundleInstance.name !== 'string') {
    return false;
  }

  const bundleName = bundleInstance.name;
  return bundleName === 'uiBundle' || bundleName === 'ui-bundle' || bundleName === 'uibundle';
}

/**
 * 归一化 legacy bundle 资源请求参数。
 * 支持字符串、字符串数组和 `{ path }` 对象结构。
 * @param {any} requestInput 资源请求参数
 * @returns {any}
 */
function normalizeLegacyBundleRequestInput(requestInput, visitedObjects) {
  const visited = visitedObjects || new Set();
  if (typeof requestInput === 'string') {
    return normalizeLegacyPathString(requestInput);
  }

  if (Array.isArray(requestInput)) {
    for (let index = 0; index < requestInput.length; index += 1) {
      requestInput[index] = normalizeLegacyBundleRequestInput(requestInput[index], visited);
    }
    return requestInput;
  }

  if (requestInput && typeof requestInput === 'object') {
    if (visited.has(requestInput)) {
      return requestInput;
    }
    visited.add(requestInput);

    const keys = Object.keys(requestInput);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      const value = requestInput[key];
      if (typeof value === 'string') {
        requestInput[key] = normalizeLegacyPathString(value);
      } else if (value && typeof value === 'object') {
        requestInput[key] = normalizeLegacyBundleRequestInput(value, visited);
      }
    }
  }

  return requestInput;
}

/**
 * 统一归一化 legacy 资源路径字符串。
 * @param {string} pathValue 路径字符串
 * @returns {string}
 */
function normalizeLegacyPathString(pathValue) {
  return normalizeUiBundleLegacyPath(normalizeHomeBundleLegacyPath(pathValue));
}

/**
 * 将 HomeBundle 历史路径 `tex/BgThings{N}/...` 归一化到语义化目录。
 * @param {string} requestPath 资源请求路径
 * @returns {string}
 */
function normalizeHomeBundleLegacyPath(requestPath) {
  if (typeof requestPath !== 'string' || requestPath.length === 0) {
    return requestPath;
  }

  const hasLeadingDotSlash = requestPath.startsWith('./');
  const normalizedPath = trimLeadingDotSlash(requestPath);
  const legacyMatch = normalizedPath.match(/^tex\/BgThings(\d+)\/(.+)$/);
  if (!legacyMatch) {
    return requestPath;
  }

  const themeIndex = legacyMatch[1];
  const legacySubPath = legacyMatch[2];
  const semanticSubPath = normalizeLegacyHomeThemeSubPath(legacySubPath);
  const nextPath = 'tex/homeTheme' + themeIndex + '/' + semanticSubPath;

  return hasLeadingDotSlash ? './' + nextPath : nextPath;
}

/**
 * 归一化旧版 BgThings 子路径。
 * @param {string} legacySubPath 旧版子路径
 * @returns {string}
 */
function normalizeLegacyHomeThemeSubPath(legacySubPath) {
  let nextPath = String(legacySubPath || '');
  const frontMatch = nextPath.match(/^front\/f(\d+)(\/.*)?$/);
  if (frontMatch) {
    return 'foreground/foregroundLayer' + frontMatch[1] + (frontMatch[2] || '');
  }

  const middleMatch = nextPath.match(/^middle\/m(\d+)(\/.*)?$/);
  if (middleMatch) {
    return 'midground/midgroundLayer' + middleMatch[1] + (middleMatch[2] || '');
  }

  const backMatch = nextPath.match(/^back\/b(\d+)(\/.*)?$/);
  if (backMatch) {
    return 'background/backgroundLayer' + backMatch[1] + (backMatch[2] || '');
  }

  const lastMatch = nextPath.match(/^last\/l(\d+)(\/.*)?$/);
  if (lastMatch) {
    return 'distant/distantLayer' + lastMatch[1] + (lastMatch[2] || '');
  }

  const homeBgMatch = nextPath.match(/^homeBg\d+(\/.*)?$/);
  if (homeBgMatch) {
    return 'themeBackground' + (homeBgMatch[1] || '');
  }

  const bottomMatch = nextPath.match(/^bottom\d+(\/.*)?$/);
  if (bottomMatch) {
    return 'bottomOverlay' + (bottomMatch[1] || '');
  }

  const fogMatch = nextPath.match(/^雾(\/.*)?$/);
  if (fogMatch) {
    return 'fogOverlay' + (fogMatch[1] || '');
  }

  return nextPath;
}

/**
 * 归一化 uiBundle 历史路径（图鉴皮肤页、设置模块）到语义化目录。
 * @param {string} requestPath 资源请求路径
 * @returns {string}
 */
function normalizeUiBundleLegacyPath(requestPath) {
  return normalizeUiBundleSettingsLegacyPath(normalizeUiBundleBookSkinLegacyPath(requestPath));
}

/**
 * 将 uiBundle 历史路径 `tex/book/鸽鸽图鉴/皮肤图鉴/p{N}` 归一化到语义化目录。
 * @param {string} requestPath 资源请求路径
 * @returns {string}
 */
function normalizeUiBundleBookSkinLegacyPath(requestPath) {
  if (typeof requestPath !== 'string' || requestPath.length === 0) {
    return requestPath;
  }

  const hasLeadingDotSlash = requestPath.startsWith('./');
  const normalizedPath = trimLeadingDotSlash(requestPath);
  const decodedPath = decodeUriPathSafely(normalizedPath);
  const legacyMatch = decodedPath.match(/^tex\/book\/鸽鸽图鉴\/皮肤图鉴\/p(10|[1-9])(\/.*)?$/);
  if (!legacyMatch) {
    return requestPath;
  }

  const pageIndex = legacyMatch[1];
  const pathSuffix = legacyMatch[2] || '';
  const nextPath = 'tex/book/pigeonGallery/skinCollection/skinPage' + pageIndex + pathSuffix;
  return hasLeadingDotSlash ? './' + nextPath : nextPath;
}

/**
 * 将 uiBundle 设置模块历史路径 `tex/设置*` 归一化到语义化目录。
 * @param {string} requestPath 资源请求路径
 * @returns {string}
 */
function normalizeUiBundleSettingsLegacyPath(requestPath) {
  if (typeof requestPath !== 'string' || requestPath.length === 0) {
    return requestPath;
  }

  const hasLeadingDotSlash = requestPath.startsWith('./');
  const normalizedPath = trimLeadingDotSlash(requestPath);
  const decodedPath = decodeUriPathSafely(normalizedPath);

  for (let index = 0; index < UI_BUNDLE_SETTINGS_LEGACY_PATH_ENTRIES.length; index += 1) {
    const entry = UI_BUNDLE_SETTINGS_LEGACY_PATH_ENTRIES[index];
    const legacyBasePath = entry[0];
    const semanticBasePath = entry[1];

    if (decodedPath === legacyBasePath) {
      return hasLeadingDotSlash ? './' + semanticBasePath : semanticBasePath;
    }
    if (decodedPath.startsWith(legacyBasePath + '/')) {
      const pathSuffix = decodedPath.slice(legacyBasePath.length);
      const nextPath = semanticBasePath + pathSuffix;
      return hasLeadingDotSlash ? './' + nextPath : nextPath;
    }
  }

  return requestPath;
}

/**
 * 安全解码 URI 路径；解码失败时返回原值。
 * @param {string} pathValue 路径
 * @returns {string}
 */
function decodeUriPathSafely(pathValue) {
  if (typeof pathValue !== 'string' || pathValue.length === 0) {
    return pathValue;
  }

  try {
    return decodeURIComponent(pathValue);
  } catch (error) {
    return pathValue;
  }
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
  applyRootBundleRequestPatch: applyRootBundleRequestPatch,
  applyHomeBundleLegacyPathPatch: applyHomeBundleLegacyPathPatch
};
