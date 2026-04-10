"use strict";

const GENERATED_REMAP_MANIFEST_PATH = "./generated/subpackage-asset-remap-manifest.js";
const INSTALL_FLAG = "__subpackageAssetFileRemapInstalled";
const WRAPPED_FLAG = "__subpackageAssetFileRemapWrapped";
const PATCHED_TARGETS = new WeakSet();
const PROXY_BY_TARGET = new WeakMap();
const ROOT_COMPATIBILITY_MIRROR_ALIAS_ENTRIES = Object.freeze([
  Object.freeze({
    legacyPrefix: "assets/internalbundle/",
    canonicalPrefix: "assets/internal/",
    canonicalConfigPath: "assets/internal/config.internal.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/start-scenebundle/",
    canonicalPrefix: "assets/start-scene/",
    canonicalConfigPath: "assets/start-scene/config.start-scene.json",
  }),
]);
const SUBPACKAGE_COMPATIBILITY_MIRROR_ALIAS_ENTRIES = Object.freeze([
  Object.freeze({
    legacyPrefix: "assets/resourcesbundle/",
    canonicalPrefix: "subpackages/resources/",
    canonicalConfigPath: "subpackages/resources/config.resources.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/mainbundle/",
    canonicalPrefix: "subpackages/main/",
    canonicalConfigPath: "subpackages/main/config.main.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/anibundle/",
    canonicalPrefix: "subpackages/aniBundle/",
    canonicalConfigPath: "subpackages/aniBundle/config.animation-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/anibundlebundle/",
    canonicalPrefix: "subpackages/aniBundle/",
    canonicalConfigPath: "subpackages/aniBundle/config.animation-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/audiobundle/",
    canonicalPrefix: "subpackages/audioBundle/",
    canonicalConfigPath: "subpackages/audioBundle/config.audio-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/audiobundlebundle/",
    canonicalPrefix: "subpackages/audioBundle/",
    canonicalConfigPath: "subpackages/audioBundle/config.audio-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/duckbundle/",
    canonicalPrefix: "subpackages/DuckBundle/",
    canonicalConfigPath: "subpackages/DuckBundle/config.duck-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/duckbundlebundle/",
    canonicalPrefix: "subpackages/DuckBundle/",
    canonicalConfigPath: "subpackages/DuckBundle/config.duck-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/game2bundle/",
    canonicalPrefix: "subpackages/Game2Bundle/",
    canonicalConfigPath: "subpackages/Game2Bundle/config.game2-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/game2bundlebundle/",
    canonicalPrefix: "subpackages/Game2Bundle/",
    canonicalConfigPath: "subpackages/Game2Bundle/config.game2-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/homebundle/",
    canonicalPrefix: "subpackages/HomeBundle/",
    canonicalConfigPath: "subpackages/HomeBundle/config.home-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/homebundlebundle/",
    canonicalPrefix: "subpackages/HomeBundle/",
    canonicalConfigPath: "subpackages/HomeBundle/config.home-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/uibundle/",
    canonicalPrefix: "subpackages/uiBundle/",
    canonicalConfigPath: "subpackages/uiBundle/config.ui-bundle.json",
  }),
  Object.freeze({
    legacyPrefix: "assets/uibundlebundle/",
    canonicalPrefix: "subpackages/uiBundle/",
    canonicalConfigPath: "subpackages/uiBundle/config.ui-bundle.json",
  }),
]);
const CANONICAL_CONFIG_REQUEST_ALIAS_ENTRIES = Object.freeze(buildCanonicalConfigRequestAliasEntries());

function installAssetFileRemap() {
  const runtimeGlobal = resolveRuntimeGlobal();
  if (!runtimeGlobal || runtimeGlobal[INSTALL_FLAG]) {
    return;
  }

  const remapManifest = loadGeneratedRemapManifest();
  const remapState = buildRemapState(remapManifest);
  runtimeGlobal[INSTALL_FLAG] = true;

  if (remapState.mappingCount === 0) {
    return;
  }

  const wxObject = runtimeGlobal.wx;
  if (!wxObject || typeof wxObject !== "object") {
    console.warn("[AssetFileRemap] wx 对象不可用，已跳过真实文件名重映射安装。");
    return;
  }

  patchFileSystemManager(wxObject, remapState);
  patchFactoryPathProperty(wxObject, "createImage", "src", remapState);
  patchFactoryPathProperty(wxObject, "createInnerAudioContext", "src", remapState);
  patchFactoryPathProperty(wxObject, "createVideo", "src", remapState);
  patchLoadFont(wxObject, remapState);

  console.info("[AssetFileRemap] 已启用子包真实文件名重映射。", {
    mappings: remapState.mappingCount,
    compatibilityMirrors:
      ROOT_COMPATIBILITY_MIRROR_ALIAS_ENTRIES.length + SUBPACKAGE_COMPATIBILITY_MIRROR_ALIAS_ENTRIES.length,
  });
}

function buildCanonicalConfigRequestAliasEntries() {
  const requestAliasEntries = [];
  const seenRequestPaths = Object.create(null);
  const allAliasEntries =
    ROOT_COMPATIBILITY_MIRROR_ALIAS_ENTRIES.concat(SUBPACKAGE_COMPATIBILITY_MIRROR_ALIAS_ENTRIES);

  for (const aliasEntry of allAliasEntries) {
    if (
      !aliasEntry ||
      typeof aliasEntry.canonicalPrefix !== "string" ||
      typeof aliasEntry.canonicalConfigPath !== "string"
    ) {
      continue;
    }

    const requestPath = aliasEntry.canonicalPrefix + "config.json";
    if (seenRequestPaths[requestPath]) {
      continue;
    }

    seenRequestPaths[requestPath] = true;
    requestAliasEntries.push(
      Object.freeze({
        requestPath,
        canonicalConfigPath: aliasEntry.canonicalConfigPath,
      })
    );
  }

  return requestAliasEntries;
}

function resolveRuntimeGlobal() {
  if (typeof GameGlobal !== "undefined" && GameGlobal) {
    return GameGlobal;
  }

  if (typeof globalThis !== "undefined" && globalThis) {
    return globalThis;
  }

  if (typeof window !== "undefined" && window) {
    return window;
  }

  return null;
}

function loadGeneratedRemapManifest() {
  try {
    return require(GENERATED_REMAP_MANIFEST_PATH);
  } catch (error) {
    return { mappings: {} };
  }
}

function buildRemapState(remapManifest) {
  const mappingEntries = Object.entries((remapManifest && remapManifest.mappings) || {});
  const mappingMap = Object.create(null);

  for (const [originalPath, materializedPath] of mappingEntries) {
    const normalizedOriginalPath = normalizeSlashes(originalPath);
    const normalizedMaterializedPath = normalizeSlashes(materializedPath);
    mappingMap[normalizedOriginalPath] = normalizedMaterializedPath;
  }

  return {
    mappingCount: mappingEntries.length,
    mappingMap,
  };
}

function normalizeSlashes(inputPath) {
  return String(inputPath || "").replace(/\\/g, "/");
}

function resolveChainedMappingPath(inputPath, remapState) {
  const normalizedInputPath = normalizeSlashes(inputPath);
  let currentPath = normalizedInputPath;
  const visitedPaths = new Set([currentPath]);

  while (Object.prototype.hasOwnProperty.call(remapState.mappingMap, currentPath)) {
    const nextPath = remapState.mappingMap[currentPath];
    if (typeof nextPath !== "string" || nextPath.length === 0 || visitedPaths.has(nextPath)) {
      break;
    }
    currentPath = nextPath;
    visitedPaths.add(currentPath);
  }

  return currentPath;
}

function resolveRemappedAssetPath(inputPath, remapState) {
  if (typeof inputPath !== "string" || inputPath.length === 0) {
    return inputPath;
  }

  const normalizedInputPath = normalizeSlashes(inputPath);
  const canonicalConfigRequestPath = resolveCanonicalConfigRequestPath(inputPath, normalizedInputPath, remapState);
  if (canonicalConfigRequestPath !== inputPath) {
    return canonicalConfigRequestPath;
  }

  const canonicalAssetRequestPath = resolveCanonicalAssetRequestPath(inputPath, normalizedInputPath, remapState);
  if (canonicalAssetRequestPath !== inputPath) {
    return canonicalAssetRequestPath;
  }

  return resolveCompatibilityMirrorAssetPath(inputPath, normalizedInputPath, remapState);
}

function resolveCanonicalAssetRequestPath(inputPath, normalizedInputPath, remapState) {
  const subpackageRemappedPath = resolveBundleAssetPath(inputPath, normalizedInputPath, "subpackages/", remapState);
  if (subpackageRemappedPath !== inputPath) {
    return subpackageRemappedPath;
  }

  return resolveBundleAssetPath(inputPath, normalizedInputPath, "assets/", remapState);
}

function resolveCanonicalConfigRequestPath(inputPath, normalizedInputPath, remapState) {
  for (const requestAliasEntry of CANONICAL_CONFIG_REQUEST_ALIAS_ENTRIES) {
    const startIndex = normalizedInputPath.indexOf(requestAliasEntry.requestPath);
    if (startIndex < 0) {
      continue;
    }

    const suffixWithQuery = inputPath.slice(startIndex);
    const bareSuffix = normalizeSlashes(suffixWithQuery.replace(/[?#].*$/, ""));
    if (bareSuffix !== requestAliasEntry.requestPath) {
      continue;
    }

    const trailingMatch = suffixWithQuery.match(/[?#].*$/);
    const trailingSuffix = trailingMatch ? trailingMatch[0] : "";
    const canonicalConfigPath = resolveChainedMappingPath(requestAliasEntry.canonicalConfigPath, remapState);
    return inputPath.slice(0, startIndex) + canonicalConfigPath + trailingSuffix;
  }

  return inputPath;
}

function resolveBundleAssetPath(inputPath, normalizedInputPath, bundleRootPrefix, remapState) {
  const bundleStartIndex = normalizedInputPath.indexOf(bundleRootPrefix);
  if (bundleStartIndex < 0) {
    return inputPath;
  }

  const suffixWithQuery = inputPath.slice(bundleStartIndex);
  const bareSuffix = normalizeSlashes(suffixWithQuery.replace(/[?#].*$/, ""));
  const trailingMatch = suffixWithQuery.match(/[?#].*$/);
  const trailingSuffix = trailingMatch ? trailingMatch[0] : "";
  const remappedSuffix = resolveCanonicalAssetSuffix(bareSuffix, remapState);

  if (!remappedSuffix || remappedSuffix === bareSuffix) {
    return inputPath;
  }

  return inputPath.slice(0, bundleStartIndex) + remappedSuffix + trailingSuffix;
}

function resolveCanonicalAssetSuffix(assetSuffix, remapState) {
  const directlyRemappedSuffix = resolveChainedMappingPath(assetSuffix, remapState);
  if (directlyRemappedSuffix !== assetSuffix) {
    return directlyRemappedSuffix;
  }

  const flattenedSuffix = collapseShardedAssetPath(assetSuffix);
  if (flattenedSuffix === assetSuffix) {
    return assetSuffix;
  }

  const remappedFlattenedSuffix = resolveChainedMappingPath(flattenedSuffix, remapState);
  if (remappedFlattenedSuffix !== flattenedSuffix) {
    return remappedFlattenedSuffix;
  }

  if (isCanonicalRootFlatAssetPath(flattenedSuffix)) {
    return flattenedSuffix;
  }

  return assetSuffix;
}

function collapseShardedAssetPath(assetSuffix) {
  const pathSegments = normalizeSlashes(assetSuffix).split("/");
  if (pathSegments.length !== 5) {
    return assetSuffix;
  }

  const [rootSegment, bundleName, assetType, shardSegment, fileName] = pathSegments;
  if ((rootSegment !== "assets" && rootSegment !== "subpackages")
    || !bundleName
    || (assetType !== "import" && assetType !== "native")
    || typeof shardSegment !== "string"
    || shardSegment.length !== 2
    || typeof fileName !== "string"
    || !fileName.startsWith(shardSegment)) {
    return assetSuffix;
  }

  return [rootSegment, bundleName, assetType, fileName].join("/");
}

function isCanonicalRootFlatAssetPath(assetSuffix) {
  return assetSuffix.startsWith("assets/internal/")
    || assetSuffix.startsWith("assets/start-scene/");
}

function resolveCompatibilityMirrorAssetPath(inputPath, normalizedInputPath, remapState) {
  const normalizedLookupPath = normalizedInputPath.toLowerCase();
  const compatibilityAliasEntries =
    ROOT_COMPATIBILITY_MIRROR_ALIAS_ENTRIES.concat(SUBPACKAGE_COMPATIBILITY_MIRROR_ALIAS_ENTRIES);

  for (const aliasEntry of compatibilityAliasEntries) {
    const startIndex = normalizedLookupPath.indexOf(aliasEntry.legacyPrefix.toLowerCase());
    if (startIndex >= 0) {
      const suffixWithQuery = inputPath.slice(startIndex);
      const bareSuffix = normalizeSlashes(suffixWithQuery.replace(/[?#].*$/, ""));
      const trailingMatch = suffixWithQuery.match(/[?#].*$/);
      const trailingSuffix = trailingMatch ? trailingMatch[0] : "";
      const legacyRelativePath = bareSuffix.slice(aliasEntry.legacyPrefix.length);

      const canonicalSuffix = resolveCompatibilityRelativePath(aliasEntry, legacyRelativePath, remapState);
      if (!canonicalSuffix) {
        return inputPath;
      }

      return inputPath.slice(0, startIndex) + canonicalSuffix + trailingSuffix;
    }
  }

  return inputPath;
}

function resolveCompatibilityRelativePath(aliasEntry, legacyRelativePath, remapState) {
  if (typeof legacyRelativePath !== "string" || legacyRelativePath.length === 0) {
    return "";
  }

  if (legacyRelativePath === "config.json" && typeof aliasEntry.canonicalConfigPath === "string") {
    return resolveChainedMappingPath(aliasEntry.canonicalConfigPath, remapState);
  }

  if (
    legacyRelativePath === "import" ||
    legacyRelativePath === "native" ||
    legacyRelativePath.startsWith("import/") ||
    legacyRelativePath.startsWith("native/")
  ) {
    return resolveCanonicalAssetSuffix(aliasEntry.canonicalPrefix + legacyRelativePath, remapState);
  }

  return "";
}

function patchFileSystemManager(wxObject, remapState) {
  if (typeof wxObject.getFileSystemManager !== "function") {
    return;
  }

  const originalGetFileSystemManager = wxObject.getFileSystemManager.bind(wxObject);
  const fsManager = originalGetFileSystemManager();
  if (!fsManager || typeof fsManager !== "object") {
    return;
  }

  const methodSpecs = [
    { methodName: "readFile", pathSpecs: [{ key: "filePath" }] },
    { methodName: "readFileSync", pathSpecs: [{ index: 0 }] },
    { methodName: "access", pathSpecs: [{ key: "path" }] },
    { methodName: "accessSync", pathSpecs: [{ index: 0 }] },
    { methodName: "stat", pathSpecs: [{ key: "path" }] },
    { methodName: "statSync", pathSpecs: [{ index: 0 }] },
    { methodName: "open", pathSpecs: [{ key: "filePath" }] },
    { methodName: "openSync", pathSpecs: [{ index: 0 }] },
  ];

  for (const methodSpec of methodSpecs) {
    patchPathAwareMethod(fsManager, methodSpec.methodName, methodSpec.pathSpecs, remapState);
  }

  if (wxObject.getFileSystemManager[WRAPPED_FLAG]) {
    return;
  }

  wxObject.getFileSystemManager = function patchedGetFileSystemManager() {
    return fsManager;
  };
  wxObject.getFileSystemManager[WRAPPED_FLAG] = true;
}

function patchPathAwareMethod(targetObject, methodName, pathSpecs, remapState) {
  const originalMethod = targetObject[methodName];
  if (typeof originalMethod !== "function" || originalMethod[WRAPPED_FLAG]) {
    return;
  }

  targetObject[methodName] = function patchedPathAwareMethod() {
    const methodArgs = Array.prototype.slice.call(arguments);

    for (const pathSpec of pathSpecs) {
      if (typeof pathSpec.index === "number" && typeof methodArgs[pathSpec.index] === "string") {
        methodArgs[pathSpec.index] = resolveRemappedAssetPath(methodArgs[pathSpec.index], remapState);
        continue;
      }

      if (typeof pathSpec.key === "string") {
        const options = methodArgs[0];
        if (options && typeof options === "object" && typeof options[pathSpec.key] === "string") {
          options[pathSpec.key] = resolveRemappedAssetPath(options[pathSpec.key], remapState);
        }
      }
    }

    return originalMethod.apply(this, methodArgs);
  };
  targetObject[methodName][WRAPPED_FLAG] = true;
}

function patchFactoryPathProperty(wxObject, factoryName, propertyName, remapState) {
  const originalFactory = wxObject[factoryName];
  if (typeof originalFactory !== "function" || originalFactory[WRAPPED_FLAG]) {
    return;
  }

  wxObject[factoryName] = function patchedFactory() {
    const createdObject = originalFactory.apply(this, arguments);
    return patchObjectPathProperty(createdObject, propertyName, remapState);
  };
  wxObject[factoryName][WRAPPED_FLAG] = true;
}

function patchObjectPathProperty(targetObject, propertyName, remapState) {
  if (!targetObject || typeof targetObject !== "object") {
    return targetObject;
  }

  if (PATCHED_TARGETS.has(targetObject)) {
    return PROXY_BY_TARGET.get(targetObject) || targetObject;
  }

  const descriptor = resolvePropertyDescriptor(targetObject, propertyName);
  if (!descriptor) {
    return targetObject;
  }

  const canWrapWithDefineProperty = canPatchWithDefineProperty(targetObject, propertyName, descriptor);
  if (canWrapWithDefineProperty && (typeof descriptor.get === "function" || typeof descriptor.set === "function")) {
    try {
      Object.defineProperty(targetObject, propertyName, {
        configurable: true,
        enumerable: descriptor.enumerable !== false,
        get: typeof descriptor.get === "function"
          ? function getPatchedPathProperty() {
            return descriptor.get.call(this);
          }
          : undefined,
        set: function setPatchedPathProperty(nextValue) {
          const normalizedValue = resolvePathPropertyValue(nextValue, remapState);
          if (typeof descriptor.set === "function") {
            return descriptor.set.call(this, normalizedValue);
          }
          return normalizedValue;
        },
      });

      PATCHED_TARGETS.add(targetObject);
      return targetObject;
    } catch (error) {
      return createPathRemapProxy(targetObject, propertyName, remapState);
    }
  }

  return createPathRemapProxy(targetObject, propertyName, remapState);
}

function canPatchWithDefineProperty(targetObject, propertyName, descriptor) {
  const ownDescriptor = Object.getOwnPropertyDescriptor(targetObject, propertyName);
  if (ownDescriptor && ownDescriptor.configurable === false) {
    return false;
  }

  if (!ownDescriptor && !Object.isExtensible(targetObject)) {
    return false;
  }

  return Boolean(descriptor);
}

function createPathRemapProxy(targetObject, propertyName, remapState) {
  const cachedProxy = PROXY_BY_TARGET.get(targetObject);
  if (cachedProxy) {
    return cachedProxy;
  }

  const proxiedObject = new Proxy(targetObject, {
    get(target, propertyKey) {
      const value = Reflect.get(target, propertyKey, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(target, propertyKey, nextValue) {
      return Reflect.set(
        target,
        propertyKey,
        propertyKey === propertyName ? resolvePathPropertyValue(nextValue, remapState) : nextValue,
        target
      );
    },
    defineProperty(target, propertyKey, propertyDescriptor) {
      const nextDescriptor = propertyKey === propertyName && propertyDescriptor && typeof propertyDescriptor === "object"
        ? normalizePropertyDescriptorValue(propertyDescriptor, remapState)
        : propertyDescriptor;
      return Reflect.defineProperty(target, propertyKey, nextDescriptor);
    },
  });

  PATCHED_TARGETS.add(targetObject);
  PROXY_BY_TARGET.set(targetObject, proxiedObject);
  return proxiedObject;
}

function normalizePropertyDescriptorValue(propertyDescriptor, remapState) {
  const nextDescriptor = Object.assign({}, propertyDescriptor);

  if (typeof nextDescriptor.value === "string") {
    nextDescriptor.value = resolvePathPropertyValue(nextDescriptor.value, remapState);
  }

  if (typeof nextDescriptor.set === "function") {
    const originalSetter = nextDescriptor.set;
    nextDescriptor.set = function patchedDescriptorSetter(nextValue) {
      return originalSetter.call(this, resolvePathPropertyValue(nextValue, remapState));
    };
  }

  return nextDescriptor;
}

function resolvePathPropertyValue(nextValue, remapState) {
  return typeof nextValue === "string"
    ? resolveRemappedAssetPath(nextValue, remapState)
    : nextValue;
}

function resolvePropertyDescriptor(targetObject, propertyName) {
  let currentObject = targetObject;

  while (currentObject) {
    const descriptor = Object.getOwnPropertyDescriptor(currentObject, propertyName);
    if (descriptor) {
      return descriptor;
    }
    currentObject = Object.getPrototypeOf(currentObject);
  }

  return null;
}

function patchLoadFont(wxObject, remapState) {
  const originalLoadFont = wxObject.loadFont;
  if (typeof originalLoadFont !== "function" || originalLoadFont[WRAPPED_FLAG]) {
    return;
  }

  wxObject.loadFont = function patchedLoadFont(fontPath) {
    return originalLoadFont.call(this, resolveRemappedAssetPath(fontPath, remapState));
  };
  wxObject.loadFont[WRAPPED_FLAG] = true;
}

module.exports = {
  ROOT_COMPATIBILITY_MIRROR_ALIAS_ENTRIES,
  SUBPACKAGE_COMPATIBILITY_MIRROR_ALIAS_ENTRIES,
  buildRemapState,
  installAssetFileRemap,
  loadGeneratedRemapManifest,
  resolveRemappedAssetPath,
};
