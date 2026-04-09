"use strict";

const GENERATED_REMAP_MANIFEST_PATH = "./generated/subpackage-asset-remap-manifest.js";
const INSTALL_FLAG = "__subpackageAssetFileRemapInstalled";
const WRAPPED_FLAG = "__subpackageAssetFileRemapWrapped";
const PATCHED_TARGETS = new WeakSet();
const PROXY_BY_TARGET = new WeakMap();
const SUBPACKAGE_COMPATIBILITY_ALIAS_SPECS = Object.freeze([]);
const ROOT_COMPATIBILITY_ALIAS_SPECS = Object.freeze([
  { canonicalPrefix: "assets/internal/", legacyNames: ["internalbundle"] },
  { canonicalPrefix: "assets/start-scene/", legacyNames: ["start-scenebundle"] },
]);
const COMPATIBILITY_MIRROR_ALIAS_ENTRIES = Object.freeze(buildCompatibilityMirrorAliasEntries());

function buildCompatibilityMirrorAliasEntries() {
  const aliasEntries = [];

  for (const aliasSpec of SUBPACKAGE_COMPATIBILITY_ALIAS_SPECS) {
    appendCompatibilityAliasEntries(aliasEntries, aliasSpec, true);
  }
  for (const aliasSpec of ROOT_COMPATIBILITY_ALIAS_SPECS) {
    appendCompatibilityAliasEntries(aliasEntries, aliasSpec, false);
  }

  return aliasEntries;
}

function appendCompatibilityAliasEntries(aliasEntries, aliasSpec, useSubpackageRemap) {
  if (!Array.isArray(aliasEntries) || !aliasSpec || typeof aliasSpec !== "object") {
    return;
  }

  const canonicalPrefix = typeof aliasSpec.canonicalPrefix === "string" ? aliasSpec.canonicalPrefix : "";
  if (!canonicalPrefix) {
    return;
  }

  for (const legacyName of Array.isArray(aliasSpec.legacyNames) ? aliasSpec.legacyNames : []) {
    if (typeof legacyName !== "string" || legacyName.length === 0) {
      continue;
    }
    aliasEntries.push(
      Object.freeze({
        legacyPrefix: "assets/" + legacyName + "/",
        canonicalPrefix: canonicalPrefix,
        useSubpackageRemap: Boolean(useSubpackageRemap),
      })
    );
  }
}

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
    compatibilityMirrors: COMPATIBILITY_MIRROR_ALIAS_ENTRIES.length,
  });
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
  const subpackageRemappedPath = resolveSubpackageAssetPath(inputPath, normalizedInputPath, remapState);
  if (subpackageRemappedPath !== inputPath) {
    return subpackageRemappedPath;
  }

  return resolveCompatibilityMirrorAssetPath(inputPath, normalizedInputPath, remapState);
}

function resolveSubpackageAssetPath(inputPath, normalizedInputPath, remapState) {
  const subpackageStartIndex = normalizedInputPath.indexOf("subpackages/");
  if (subpackageStartIndex < 0) {
    return inputPath;
  }

  const suffixWithQuery = inputPath.slice(subpackageStartIndex);
  const bareSuffix = normalizeSlashes(suffixWithQuery.replace(/[?#].*$/, ""));
  const trailingMatch = suffixWithQuery.match(/[?#].*$/);
  const trailingSuffix = trailingMatch ? trailingMatch[0] : "";
  const remappedSuffix = resolveChainedMappingPath(bareSuffix, remapState);

  if (!remappedSuffix || remappedSuffix === bareSuffix) {
    return inputPath;
  }

  return inputPath.slice(0, subpackageStartIndex) + remappedSuffix + trailingSuffix;
}

function resolveCompatibilityMirrorAssetPath(inputPath, normalizedInputPath, remapState) {
  const mirrorMatch = findCompatibilityMirrorMatch(normalizedInputPath);
  if (!mirrorMatch) {
    return inputPath;
  }

  const suffixWithQuery = inputPath.slice(mirrorMatch.startIndex);
  const bareSuffix = normalizeSlashes(suffixWithQuery.replace(/[?#].*$/, ""));
  const trailingMatch = suffixWithQuery.match(/[?#].*$/);
  const trailingSuffix = trailingMatch ? trailingMatch[0] : "";
  const legacyRelativePath = bareSuffix.slice(mirrorMatch.aliasEntry.legacyPrefix.length);

  if (!shouldRemapCompatibilityRelativePath(legacyRelativePath)) {
    return inputPath;
  }

  let canonicalSuffix = mirrorMatch.aliasEntry.canonicalPrefix + legacyRelativePath;
  if (mirrorMatch.aliasEntry.useSubpackageRemap) {
    canonicalSuffix = resolveChainedMappingPath(canonicalSuffix, remapState);
  }

  return inputPath.slice(0, mirrorMatch.startIndex) + canonicalSuffix + trailingSuffix;
}

function findCompatibilityMirrorMatch(normalizedInputPath) {
  for (const aliasEntry of COMPATIBILITY_MIRROR_ALIAS_ENTRIES) {
    const startIndex = normalizedInputPath.indexOf(aliasEntry.legacyPrefix);
    if (startIndex >= 0) {
      return {
        aliasEntry,
        startIndex,
      };
    }
  }

  return null;
}

function shouldRemapCompatibilityRelativePath(legacyRelativePath) {
  return typeof legacyRelativePath === "string" &&
    (legacyRelativePath.startsWith("import/") || legacyRelativePath.startsWith("native/"));
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
  COMPATIBILITY_MIRROR_ALIAS_ENTRIES,
  buildRemapState,
  installAssetFileRemap,
  loadGeneratedRemapManifest,
  resolveRemappedAssetPath,
};
