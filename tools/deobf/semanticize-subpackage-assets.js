"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { SEMANTIC_NAME_TRANSLATIONS } = require("./semantic-name-translations");

const PROJECT_ROOT = process.cwd();
const SUBPACKAGES_DIR = path.join(PROJECT_ROOT, "subpackages");
const UUID_REPORT_PATH = path.join(PROJECT_ROOT, "architecture", "docs", "uuid-asset-report.json");
const RUNTIME_REMAP_MANIFEST_PATH = path.join(
  PROJECT_ROOT,
  "runtime",
  "generated",
  "subpackage-asset-remap-manifest.js"
);
const SEMANTIC_ALIAS_MANIFEST_DIR = path.join(
  PROJECT_ROOT,
  "architecture",
  "generated",
  "subpackage-semantic-aliases"
);

const SEMANTIC_DIRNAME = "__semantic__";
const UUID_TEMPLATE = [
  "", "", "", "", "", "", "", "", "-", "", "", "", "", "-", "", "", "", "", "-", "", "", "", "", "-",
  "", "", "", "", "", "", "", "", "", "", "", ""
];
const BASE64_KEY_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const HEX_CHARS = "0123456789abcdef";
const BASE64_VALUES = createBase64ValueMap();

const GENERIC_TRAILING_SEGMENTS = new Set([
  "spriteFrame",
  "texture",
  "Texture",
  "prefab",
  "scene",
]);
// These assets are not recoverable from bundle config/report alone, but their semantics are
// obvious from image/clip content, so we promote them into readable descriptive aliases.
const MANUAL_CANONICAL_PATH_OVERRIDES = {
  DuckBundle: {
    "1f7f18b6-3401-4aba-90ce-9d522bd5d439": "恢复命名/青色阴影数字条",
  },
  audioBundle: {
    "win": "legacy/victory",
    "adz": "legacy/unknownAdz",
    "fly": "legacy/fly",
    "bdz": "legacy/unknownBdz",
    "door": "legacy/door",
    "ls": "legacy/unknownLs",
    "lz": "legacy/fruitBornDuplicateLz",
    "pop": "legacy/pop",
    "over": "legacy/gameOver",
    "gz": "legacy/levelCompleteDuplicateGz",
    "levelup": "legacy/levelUp",
    "show": "legacy/levelCompleteDuplicateShow",
  },
  main: {
    "0477c566e": "texture/sharedTextureCollection",
    "02c960b2-a56d-4aab-a517-3ba441a0a458": "effects/flowerGlow",
    "2056bc90-0221-4223-b58a-07c01e25bdb5": "props/rainbowBall",
    "20835ba4-6145-4fbc-a58a-051ce700aa3e": "utility/lightGraySquare",
    "2507b64b-6f48-4e0b-83b6-b0fba5864c18": "scene/ovalHole",
    "48cadb61-de88-4c0a-bb4a-3ac2fe428dec": "ui/goldRoundedCap",
    "4d96b4ce-0f78-496e-aee3-fb4b213789e3": "ui/brownRoundedCap",
    "4e318cab-9fdc-49fc-a1b2-7474add66ed2": "mask/roundedPanelMask",
    "544e49d6-3f05-4fa8-9a9e-091f98fc2ce8": "utility/darkGraySquare",
    "56a35c4e-18ad-4795-86ad-f11bb3ebaa5a": "utility/whitePixel2x2",
    "59ed86d6-38a8-4bf7-9360-0805b40aa7bc": "digits/whiteDigitsStrip",
    "74c3f488-7a9c-4197-85fc-610d11be15c2": "text/levelText",
    "7d8f9b89-4fd1-4c9f-a3ab-38ec7cded7ca": "utility/whitePixel2x2Alt",
    "82d23d6a-e4c1-499e-b540-30d9bb9c9bd9": "background/skyGradient",
    "83fee86e-b4cc-4a0f-8e15-9745cbd4db4b": "digits/whiteDigitsStripWide",
    "951249e0-9f16-456d-8b85-a6ca954da16b": "utility/lightGraySquareSoft",
    "a137c41d-7918-457c-92bf-c1930b96b8a4": "duck/bodyPartsSheet",
    "a7be5c56-e258-46ea-b69d-63f0f8595b80": "background/lightGradient",
    "aaf71e20-e580-40c7-b52c-2f27715312e7": "scene/dirtPitTop",
    "bd1bcaba-bd7d-4a71-b143-997c882383e4": "utility/mediumGraySquare",
    "c0d128a1-eace-4870-a9c0-91f319b83e8e": "background/cloud",
    "c5f5e811-3a6b-4661-9679-741ad09a6390": "ui/tanPanel",
    "ee36791a-5c44-40a8-8872-56aacb3d204f": "ui/questionMark",
    "f12a23c4-b924-4322-a260-3d982428f1e8": "ui/whiteCircle",
    "f808b8f2-223e-433d-a6bd-86e18bef7242": "scene/dirtWallTop",
    "fb56bdf0-d73b-4423-8ba2-e8f18e57b5c9": "scene/dirtMound",
  },
  resources: {
    "0895e4eee": "multiTexture/sharedTextureCollection",
  },
  uiBundle: {
    "0a10d91be": "恢复命名/UI共享贴图图集",
    "0a38894c-9efd-4112-8fc6-1d772ce7cf70": "恢复命名/白色数字条",
    "2b0cdada-4ba4-444c-ad27-3d4b189db4a4": "恢复命名/白色横线条",
    "4c518408-73ae-45c9-a35a-ddd8ac84b03f": "animation/light",
    "a4f2ba7a-f568-47af-a126-a27be8bea93e": "恢复命名/黑边数字条",
    "fd24bf72-c08b-4699-a822-a92c63bcb42b": "恢复命名/白色块状条",
  },
};

function main() {
  const shouldWrite = process.argv.includes("--write");
  const shouldMaterialize = process.argv.includes("--materialize");
  const shouldPersistArtifacts = shouldWrite || shouldMaterialize;
  const requestedBundleNames = resolveRequestedBundleNames(process.argv.slice(2));
  const report = loadJson(UUID_REPORT_PATH);
  const reportBundleMap = new Map((report.bundles || []).map((bundle) => [bundle.bundleName, bundle]));
  const globalCanonicalPathByReportUuid = new Map();
  const globalCanonicalPathByCompressedUuid = new Map();
  const bundleManifests = [];

  for (const bundle of report.bundles || []) {
    for (const assetRecord of bundle.assetRecords || []) {
      if (!assetRecord || !assetRecord.canonicalPath) {
        continue;
      }

      if (assetRecord.uuid) {
        const normalizedUuid = normalizeUuidKey(assetRecord.uuid);
        if (normalizedUuid && !globalCanonicalPathByReportUuid.has(normalizedUuid)) {
          globalCanonicalPathByReportUuid.set(normalizedUuid, assetRecord.canonicalPath);
        }
      }

      if (assetRecord.compressedUuid) {
        const compressedKeys = [
          assetRecord.compressedUuid,
          stripUuidSuffix(assetRecord.compressedUuid),
          normalizeUuidKey(assetRecord.compressedUuid),
          normalizeUuidKey(decodeCompressedUuid(stripUuidSuffix(assetRecord.compressedUuid))),
        ].filter(Boolean);

        for (const key of compressedKeys) {
          if (!globalCanonicalPathByCompressedUuid.has(key)) {
            globalCanonicalPathByCompressedUuid.set(key, assetRecord.canonicalPath);
          }
        }
      }
    }
  }

  const summaries = [];

  for (const bundleName of getBundleNames()) {
    if (requestedBundleNames && !requestedBundleNames.has(bundleName)) {
      continue;
    }

    const bundleDir = path.join(SUBPACKAGES_DIR, bundleName);
    const configFileName = fs.readdirSync(bundleDir).find((name) => /^config\..+\.json$/.test(name));
    if (!configFileName) {
      continue;
    }

    const configPath = path.join(bundleDir, configFileName);
    const config = loadJson(configPath);
    const reportBundle = reportBundleMap.get(bundleName) || { assetRecords: [] };
    const existingBundleManifest = loadExistingBundleManifest(bundleDir);
    const bundleState = buildBundleState(
      bundleName,
      bundleDir,
      config,
      reportBundle,
      globalCanonicalPathByReportUuid,
      globalCanonicalPathByCompressedUuid,
      existingBundleManifest
    );
    const bundleManifest = generateBundleManifest(bundleState, existingBundleManifest);

    if (shouldPersistArtifacts) {
      writeBundleSemanticAliases(bundleState, bundleManifest, {
        createSemanticSymlinks: shouldWrite && !shouldMaterialize,
      });
    }

    if (shouldMaterialize) {
      materializeBundleAssetNames(bundleState, bundleManifest, existingBundleManifest);
    }

    bundleManifests.push(bundleManifest);
    summaries.push({
      bundleName,
      importAliases: bundleManifest.importAliases.length,
      nativeAliases: bundleManifest.nativeAliases.length,
      unresolvedImports: bundleManifest.unresolvedImports.length,
      unresolvedNative: bundleManifest.unresolvedNative.length,
    });
  }

  if (shouldPersistArtifacts) {
    writeRuntimeRemapManifest(bundleManifests);
  }

  console.log("[semanticize-subpackage-assets] summary");
  for (const summary of summaries) {
    console.log(
      `${summary.bundleName}: import=${summary.importAliases} native=${summary.nativeAliases} unresolvedImport=${summary.unresolvedImports} unresolvedNative=${summary.unresolvedNative}`
    );
  }
  if (shouldMaterialize) {
    console.log("[semanticize-subpackage-assets] materialize mode complete");
  } else {
    console.log(shouldWrite ? "[semanticize-subpackage-assets] write mode complete" : "[semanticize-subpackage-assets] dry-run complete");
  }
}

function resolveRequestedBundleNames(argv) {
  const bundleArg = argv.find((value) => value.startsWith("--bundles=") || value.startsWith("--bundle="));
  if (!bundleArg) {
    return null;
  }

  const rawValue = bundleArg.split("=", 2)[1] || "";
  const bundleNames = rawValue
    .split(",")
    .map((bundleName) => bundleName.trim())
    .filter(Boolean);

  return bundleNames.length > 0 ? new Set(bundleNames) : null;
}

function getBundleNames() {
  return fs.readdirSync(SUBPACKAGES_DIR)
    .filter((name) => fs.statSync(path.join(SUBPACKAGES_DIR, name)).isDirectory())
    .sort();
}

function buildBundleState(
  bundleName,
  bundleDir,
  config,
  reportBundle,
  globalCanonicalPathByReportUuid,
  globalCanonicalPathByCompressedUuid,
  existingBundleManifest
) {
  const reportAssetRecords = reportBundle.assetRecords || [];
  const configUuidEntries = Array.isArray(config.uuids) ? config.uuids : [];
  const manualCanonicalPathOverrides = MANUAL_CANONICAL_PATH_OVERRIDES[bundleName] || {};
  const directCanonicalPathByExactUuid = new Map();
  const directCanonicalPathByNormalizedUuid = new Map();
  const canonicalPathByReportUuid = new Map();
  const canonicalPathByCompressedUuid = new Map();
  const packAssetRecordsByPackId = new Map();
  const packInfoByPackId = new Map();
  const textureInfoByUuidKey = new Map();
  const assetRecordByAssetIndex = new Map(
    reportAssetRecords
      .filter((assetRecord) => Number.isInteger(assetRecord && assetRecord.assetIndex))
      .map((assetRecord) => [assetRecord.assetIndex, assetRecord])
  );
  const translatedCurrentFileBasePathMap = buildTranslatedCurrentFileBasePathMap(bundleDir);
  const importAliasEntryByOriginalRelativePath = new Map(
    ((existingBundleManifest && existingBundleManifest.importAliases) || [])
      .filter((aliasEntry) => aliasEntry && typeof aliasEntry.originalRelativePath === "string")
      .map((aliasEntry) => [normalizePathForPosix(aliasEntry.originalRelativePath), aliasEntry])
  );

  for (const [overrideStem, canonicalPath] of Object.entries(manualCanonicalPathOverrides)) {
    if (typeof canonicalPath !== "string" || canonicalPath.length === 0) {
      continue;
    }

    directCanonicalPathByExactUuid.set(overrideStem, canonicalPath);
    directCanonicalPathByExactUuid.set(stripUuidSuffix(overrideStem), canonicalPath);
    directCanonicalPathByNormalizedUuid.set(normalizeUuidKey(overrideStem), canonicalPath);
  }

  for (const [pathKey, pathValue] of Object.entries(config.paths || {})) {
    const uuidEntry = configUuidEntries[Number(pathKey)];
    if (!uuidEntry || !Array.isArray(pathValue) || pathValue.length === 0) {
      continue;
    }

    const canonicalPath = pathValue[0];
    if (typeof canonicalPath !== "string" || canonicalPath.length === 0) {
      continue;
    }

    const decodedUuidEntry = decodeCompressedUuid(stripUuidSuffix(uuidEntry));
    directCanonicalPathByExactUuid.set(uuidEntry, canonicalPath);
    directCanonicalPathByNormalizedUuid.set(normalizeUuidKey(uuidEntry), canonicalPath);
    if (decodedUuidEntry && decodedUuidEntry !== uuidEntry) {
      directCanonicalPathByExactUuid.set(decodedUuidEntry, canonicalPath);
      directCanonicalPathByNormalizedUuid.set(normalizeUuidKey(decodedUuidEntry), canonicalPath);
    }
  }

  for (const assetRecord of reportAssetRecords) {
    if (assetRecord.uuid) {
      canonicalPathByReportUuid.set(normalizeUuidKey(assetRecord.uuid), assetRecord.canonicalPath);
    }
    if (assetRecord.compressedUuid) {
      canonicalPathByCompressedUuid.set(assetRecord.compressedUuid, assetRecord.canonicalPath);
      canonicalPathByCompressedUuid.set(stripUuidSuffix(assetRecord.compressedUuid), assetRecord.canonicalPath);
      canonicalPathByCompressedUuid.set(normalizeUuidKey(assetRecord.compressedUuid), assetRecord.canonicalPath);
    }

    for (const packId of assetRecord.packIds || []) {
      const packAssetRecords = packAssetRecordsByPackId.get(packId) || [];
      packAssetRecords.push(assetRecord);
      packAssetRecordsByPackId.set(packId, packAssetRecords);
    }

    const importFileName = assetRecord.importContainerRelativePath
      ? path.posix.basename(assetRecord.importContainerRelativePath)
      : "";
    if (!importFileName) {
      continue;
    }

    const importFileStem = getAssetStorageStem(importFileName);
    const packAssetRecords = packAssetRecordsByPackId.get(importFileStem) || [];
    packAssetRecords.push(assetRecord);
    packAssetRecordsByPackId.set(importFileStem, packAssetRecords);
  }

  for (const [packId, packedAssetIndices] of Object.entries(config.packs || {})) {
    if (!Array.isArray(packedAssetIndices) || packedAssetIndices.length === 0) {
      continue;
    }

    const packAssetRecords = packAssetRecordsByPackId.get(packId) || [];
    for (const assetIndex of packedAssetIndices) {
      const reportAssetRecord = assetRecordByAssetIndex.get(assetIndex);
      if (reportAssetRecord) {
        packAssetRecords.push(reportAssetRecord);
        continue;
      }

      const pathValue = config.paths && config.paths[String(assetIndex)];
      const canonicalPath = Array.isArray(pathValue) && typeof pathValue[0] === "string"
        ? pathValue[0]
        : "";
      if (!canonicalPath) {
        continue;
      }

      packAssetRecords.push({
        assetIndex,
        canonicalPath,
      });
    }

    if (packAssetRecords.length > 0) {
      packAssetRecordsByPackId.set(packId, packAssetRecords);
    }
  }

  const importFileNames = listBundleRootFileNames(
    bundleDir,
    "import",
    existingBundleManifest && existingBundleManifest.importAliases
  );
  for (const fileName of importFileNames) {
    const relativePath = path.posix.join("import", fileName);
    const fileStem = getAssetStorageStem(fileName);
    const absolutePath = resolveImportCandidateAbsolutePath(
      bundleDir,
      relativePath,
      fileStem,
      importAliasEntryByOriginalRelativePath,
      translatedCurrentFileBasePathMap,
      packAssetRecordsByPackId
    );

    if (fileName.startsWith(`${SEMANTIC_DIRNAME}/`) || fileName === SEMANTIC_DIRNAME) {
      continue;
    }

    const exactCanonicalPath = findCanonicalPathForUuidStem(
      fileStem,
      directCanonicalPathByExactUuid,
      directCanonicalPathByNormalizedUuid,
      canonicalPathByCompressedUuid,
      canonicalPathByReportUuid,
      globalCanonicalPathByReportUuid,
      globalCanonicalPathByCompressedUuid
    );

    const packAssetRecords = dedupeByCanonicalPath(packAssetRecordsByPackId.get(fileStem) || []);
    const parsedPackInfo = parseImportFileForPackInfo(absolutePath);
    const mergedPackInfo = mergePackInfo(fileStem, packAssetRecords, parsedPackInfo);
    if (mergedPackInfo) {
      packInfoByPackId.set(fileStem, mergedPackInfo);

      for (const textureUuidKey of mergedPackInfo.textureUuidKeys) {
        const nextTextureInfo = {
          textureUuidKey,
          commonPrefixSegments: mergedPackInfo.commonPrefixSegments,
          primaryLeafName: mergedPackInfo.primaryLeafName,
          assetCount: mergedPackInfo.assetCount,
          packStem: fileStem,
        };
        const existingTextureInfo = textureInfoByUuidKey.get(textureUuidKey);
        if (!existingTextureInfo || nextTextureInfo.assetCount > existingTextureInfo.assetCount) {
          textureInfoByUuidKey.set(textureUuidKey, nextTextureInfo);
        }
      }
    }

    if (!exactCanonicalPath && !mergedPackInfo) {
      continue;
    }
  }

  return {
    bundleName,
    bundleDir,
    configFileName: path.basename(config._configPath || ""),
    directCanonicalPathByExactUuid,
    directCanonicalPathByNormalizedUuid,
    canonicalPathByCompressedUuid,
    canonicalPathByReportUuid,
    globalCanonicalPathByReportUuid,
    globalCanonicalPathByCompressedUuid,
    packInfoByPackId,
    textureInfoByUuidKey,
  };
}

function generateBundleManifest(bundleState, existingBundleManifest) {
  const importAliases = [];
  const nativeAliases = [];
  const unresolvedImports = [];
  const unresolvedNative = [];

  const usedImportSemanticPaths = new Set();
  const usedNativeSemanticPaths = new Set();

  const importFileNames = listBundleRootFileNames(
    bundleState.bundleDir,
    "import",
    existingBundleManifest && existingBundleManifest.importAliases
  );
  const nativeFileNames = listBundleRootFileNames(
    bundleState.bundleDir,
    "native",
    existingBundleManifest && existingBundleManifest.nativeAliases
  );
  const importContentMatchPathByOriginalRelativePath = buildDeletedRootFileContentMatchMap(bundleState.bundleDir, "import");
  const nativeContentMatchPathByOriginalRelativePath = buildDeletedRootFileContentMatchMap(bundleState.bundleDir, "native");

  for (const fileName of importFileNames) {
    const relativePath = path.posix.join("import", fileName);
    const fileStem = getAssetStorageStem(fileName);

    const canonicalPath = findCanonicalPathForUuidStem(
      fileStem,
      bundleState.directCanonicalPathByExactUuid,
      bundleState.directCanonicalPathByNormalizedUuid,
      bundleState.canonicalPathByCompressedUuid,
      bundleState.canonicalPathByReportUuid,
      bundleState.globalCanonicalPathByReportUuid,
      bundleState.globalCanonicalPathByCompressedUuid
    );

    let semanticRelativePath = "";
    let strategy = "";
    let detail = {};

    if (canonicalPath) {
      semanticRelativePath = buildDirectSemanticRelativePath("import", canonicalPath, path.extname(fileName), usedImportSemanticPaths);
      strategy = "direct-canonical-path";
      detail = { canonicalPath };
    } else {
      const packInfo = bundleState.packInfoByPackId.get(fileStem);
      if (packInfo) {
        semanticRelativePath = buildPackSemanticRelativePath("import", packInfo, path.extname(fileName), usedImportSemanticPaths);
        strategy = "import-pack";
        detail = {
          commonPrefixSegments: packInfo.commonPrefixSegments,
          primaryLeafName: packInfo.primaryLeafName,
          assetCount: packInfo.assetCount,
          textureUuidKeys: packInfo.textureUuidKeys,
        };
      } else {
        const textureInfo = bundleState.textureInfoByUuidKey.get(fileStem) || bundleState.textureInfoByUuidKey.get(stripUuidSuffix(fileStem));
        if (textureInfo) {
          semanticRelativePath = buildTextureSemanticRelativePath(textureInfo, path.extname(fileName), usedImportSemanticPaths);
          strategy = "texture-source-import";
          detail = {
            commonPrefixSegments: textureInfo.commonPrefixSegments,
            primaryLeafName: textureInfo.primaryLeafName,
            assetCount: textureInfo.assetCount,
            textureUuidKey: textureInfo.textureUuidKey,
            packStem: textureInfo.packStem,
          };
        }
      }
    }

    if (semanticRelativePath) {
      importAliases.push({
        kind: "import",
        originalRelativePath: relativePath,
        semanticRelativePath,
        materializedRelativePath: buildMaterializedRelativePath("import", semanticRelativePath),
        strategy,
        detail,
      });
    } else {
      const contentMatchedRelativePath = importContentMatchPathByOriginalRelativePath.get(relativePath);
      if (contentMatchedRelativePath) {
        importAliases.push(buildContentMatchedAliasEntry("import", relativePath, contentMatchedRelativePath));
        continue;
      }

      unresolvedImports.push({
        originalRelativePath: relativePath,
        stem: fileStem,
      });
    }
  }

  for (const fileName of nativeFileNames) {
    const relativePath = path.posix.join("native", fileName);
    const fileStem = getAssetStorageStem(fileName);

    const canonicalPath = findCanonicalPathForUuidStem(
      fileStem,
      bundleState.directCanonicalPathByExactUuid,
      bundleState.directCanonicalPathByNormalizedUuid,
      bundleState.canonicalPathByCompressedUuid,
      bundleState.canonicalPathByReportUuid,
      bundleState.globalCanonicalPathByReportUuid,
      bundleState.globalCanonicalPathByCompressedUuid
    );

    let semanticRelativePath = "";
    let strategy = "";
    let detail = {};

    if (canonicalPath) {
      semanticRelativePath = buildDirectSemanticRelativePath("native", canonicalPath, path.extname(fileName), usedNativeSemanticPaths);
      strategy = "direct-canonical-path";
      detail = { canonicalPath };
    } else {
      const textureInfo = bundleState.textureInfoByUuidKey.get(fileStem) || bundleState.textureInfoByUuidKey.get(stripUuidSuffix(fileStem));
      if (textureInfo) {
        semanticRelativePath = buildTextureSemanticRelativePath(textureInfo, path.extname(fileName), usedNativeSemanticPaths);
        strategy = "texture-source-from-pack";
        detail = {
          commonPrefixSegments: textureInfo.commonPrefixSegments,
          primaryLeafName: textureInfo.primaryLeafName,
          assetCount: textureInfo.assetCount,
          textureUuidKey: textureInfo.textureUuidKey,
          packStem: textureInfo.packStem,
        };
      }
    }

    if (semanticRelativePath) {
      nativeAliases.push({
        kind: "native",
        originalRelativePath: relativePath,
        semanticRelativePath,
        materializedRelativePath: buildMaterializedRelativePath("native", semanticRelativePath),
        strategy,
        detail,
      });
    } else {
      const contentMatchedRelativePath = nativeContentMatchPathByOriginalRelativePath.get(relativePath);
      if (contentMatchedRelativePath) {
        nativeAliases.push(buildContentMatchedAliasEntry("native", relativePath, contentMatchedRelativePath));
        continue;
      }

      unresolvedNative.push({
        originalRelativePath: relativePath,
        stem: fileStem,
      });
    }
  }

  const mergedImportAliases = mergeExistingAliasEntries(
    bundleState.bundleDir,
    "import",
    importAliases,
    existingBundleManifest && existingBundleManifest.importAliases
  );
  const mergedNativeAliases = mergeExistingAliasEntries(
    bundleState.bundleDir,
    "native",
    nativeAliases,
    existingBundleManifest && existingBundleManifest.nativeAliases
  );
  const normalizedImportAliases = normalizeAliasEntryMaterializedPaths(bundleState.bundleDir, mergedImportAliases);
  const normalizedNativeAliases = normalizeAliasEntryMaterializedPaths(bundleState.bundleDir, mergedNativeAliases);

  return {
    bundleName: bundleState.bundleName,
    generatedAt: new Date().toISOString(),
    importAliases: normalizedImportAliases,
    nativeAliases: normalizedNativeAliases,
    unresolvedImports,
    unresolvedNative,
  };
}

function loadExistingBundleManifest(bundleDir) {
  const manifestPath = resolveBundleManifestPath(bundleDir);
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    return null;
  }
}

function mergeExistingAliasEntries(bundleDir, kind, nextAliasEntries, existingAliasEntries) {
  const mergedAliasEntryMap = new Map(
    nextAliasEntries.map((aliasEntry) => [aliasEntry.originalRelativePath, aliasEntry])
  );
  const fallbackAliasEntries = Array.isArray(existingAliasEntries) ? existingAliasEntries : [];

  for (const existingAliasEntry of fallbackAliasEntries) {
    if (!existingAliasEntry || typeof existingAliasEntry.originalRelativePath !== "string") {
      continue;
    }

    if (mergedAliasEntryMap.has(existingAliasEntry.originalRelativePath)) {
      continue;
    }

    const semanticRelativePath = translateRelativePathSegments(existingAliasEntry.semanticRelativePath);
    const legacyMaterializedRelativePath = existingAliasEntry.materializedRelativePath ||
      buildMaterializedRelativePath(kind, existingAliasEntry.semanticRelativePath);
    const materializedRelativePath = existingAliasEntry.materializedRelativePath
      ? translateRelativePathSegments(existingAliasEntry.materializedRelativePath)
      : buildMaterializedRelativePath(kind, semanticRelativePath);
    const originalAbsolutePath = path.join(bundleDir, existingAliasEntry.originalRelativePath);
    const legacyMaterializedAbsolutePath = legacyMaterializedRelativePath
      ? path.join(bundleDir, legacyMaterializedRelativePath)
      : "";

    if (!fs.existsSync(originalAbsolutePath) && (!legacyMaterializedAbsolutePath || !fs.existsSync(legacyMaterializedAbsolutePath))) {
      continue;
    }

    mergedAliasEntryMap.set(existingAliasEntry.originalRelativePath, Object.assign({}, existingAliasEntry, {
      kind,
      semanticRelativePath,
      materializedRelativePath,
    }));
  }

  return Array.from(mergedAliasEntryMap.values()).sort((left, right) =>
    left.originalRelativePath.localeCompare(right.originalRelativePath, "en")
  );
}

function writeBundleSemanticAliases(bundleState, bundleManifest, options) {
  const createSemanticSymlinks = Boolean(options && options.createSemanticSymlinks);
  const importSemanticDir = path.join(bundleState.bundleDir, "import", SEMANTIC_DIRNAME);
  const nativeSemanticDir = path.join(bundleState.bundleDir, "native", SEMANTIC_DIRNAME);

  if (fs.existsSync(importSemanticDir)) {
    fs.rmSync(importSemanticDir, { recursive: true, force: true });
  }
  if (fs.existsSync(nativeSemanticDir)) {
    fs.rmSync(nativeSemanticDir, { recursive: true, force: true });
  }

  if (createSemanticSymlinks) {
    for (const entry of [...bundleManifest.importAliases, ...bundleManifest.nativeAliases]) {
      const originalAbsolutePath = path.join(bundleState.bundleDir, entry.originalRelativePath);
      const kindDir = path.dirname(originalAbsolutePath);
      const semanticAbsolutePath = path.join(kindDir, entry.semanticRelativePath);
      ensureDirectory(path.dirname(semanticAbsolutePath));

      const symlinkTarget = path.relative(path.dirname(semanticAbsolutePath), originalAbsolutePath);
      fs.symlinkSync(symlinkTarget, semanticAbsolutePath);
    }
  }

  ensureDirectory(SEMANTIC_ALIAS_MANIFEST_DIR);
  const manifestPath = resolveBundleManifestPath(bundleState.bundleName);
  fs.writeFileSync(manifestPath, JSON.stringify(bundleManifest, null, 2) + "\n", "utf8");
}

function materializeBundleAssetNames(bundleState, bundleManifest, existingBundleManifest) {
  const aliasEntries = bundleManifest.importAliases.concat(bundleManifest.nativeAliases);
  const previousMaterializedPathByOriginalRelativePath = buildPreviousMaterializedPathMap(existingBundleManifest);
  const translatedCurrentFilePathMap = buildTranslatedCurrentFilePathMap(bundleState.bundleDir);

  for (const entry of aliasEntries) {
    if (!entry.materializedRelativePath) {
      continue;
    }

    const originalAbsolutePath = path.join(bundleState.bundleDir, entry.originalRelativePath);
    const materializedAbsolutePath = path.join(bundleState.bundleDir, entry.materializedRelativePath);
    const previousMaterializedRelativePath = previousMaterializedPathByOriginalRelativePath.get(entry.originalRelativePath) || "";
    const previousMaterializedAbsolutePath = previousMaterializedRelativePath
      ? path.join(bundleState.bundleDir, previousMaterializedRelativePath)
      : "";

    if (originalAbsolutePath === materializedAbsolutePath) {
      continue;
    }

    if (fs.existsSync(materializedAbsolutePath) && !fs.existsSync(originalAbsolutePath)) {
      continue;
    }

    if (
      previousMaterializedAbsolutePath &&
      previousMaterializedAbsolutePath !== materializedAbsolutePath &&
      fs.existsSync(previousMaterializedAbsolutePath) &&
      !fs.existsSync(materializedAbsolutePath)
    ) {
      ensureDirectory(path.dirname(materializedAbsolutePath));
      fs.renameSync(previousMaterializedAbsolutePath, materializedAbsolutePath);
      continue;
    }

    const translatedCurrentRelativePath = translatedCurrentFilePathMap.get(entry.materializedRelativePath) || "";
    const translatedCurrentAbsolutePath = translatedCurrentRelativePath
      ? path.join(bundleState.bundleDir, translatedCurrentRelativePath)
      : "";
    if (
      translatedCurrentAbsolutePath &&
      translatedCurrentAbsolutePath !== materializedAbsolutePath &&
      fs.existsSync(translatedCurrentAbsolutePath) &&
      !fs.existsSync(materializedAbsolutePath)
    ) {
      ensureDirectory(path.dirname(materializedAbsolutePath));
      fs.renameSync(translatedCurrentAbsolutePath, materializedAbsolutePath);
      translatedCurrentFilePathMap.set(entry.materializedRelativePath, entry.materializedRelativePath);
      continue;
    }

    if (!fs.existsSync(originalAbsolutePath)) {
      continue;
    }

    ensureDirectory(path.dirname(materializedAbsolutePath));
    fs.renameSync(originalAbsolutePath, materializedAbsolutePath);
  }

  materializeTranslatedCurrentFiles(bundleState.bundleDir);
  pruneUrlEncodedCompatibilityLinks(bundleState.bundleDir);
}

function buildPreviousMaterializedPathMap(existingBundleManifest) {
  const pathMap = new Map();
  const aliasEntries = existingBundleManifest
    ? [].concat(existingBundleManifest.importAliases || [], existingBundleManifest.nativeAliases || [])
    : [];

  for (const aliasEntry of aliasEntries) {
    if (!aliasEntry || typeof aliasEntry.originalRelativePath !== "string") {
      continue;
    }

    const previousMaterializedRelativePath = aliasEntry.materializedRelativePath ||
      buildMaterializedRelativePath(aliasEntry.kind || inferKindFromOriginalRelativePath(aliasEntry.originalRelativePath), aliasEntry.semanticRelativePath);
    if (!previousMaterializedRelativePath) {
      continue;
    }

    pathMap.set(aliasEntry.originalRelativePath, previousMaterializedRelativePath);
  }

  return pathMap;
}

function resolveImportCandidateAbsolutePath(
  bundleDir,
  originalRelativePath,
  fileStem,
  importAliasEntryByOriginalRelativePath,
  translatedCurrentFileBasePathMap,
  packAssetRecordsByPackId
) {
  const originalAbsolutePath = path.join(bundleDir, originalRelativePath);
  if (fs.existsSync(originalAbsolutePath)) {
    return originalAbsolutePath;
  }

  const aliasEntry = importAliasEntryByOriginalRelativePath.get(normalizePathForPosix(originalRelativePath));
  if (aliasEntry && typeof aliasEntry.materializedRelativePath === "string" && aliasEntry.materializedRelativePath.length > 0) {
    const materializedAbsolutePath = path.join(bundleDir, aliasEntry.materializedRelativePath);
    if (fs.existsSync(materializedAbsolutePath)) {
      return materializedAbsolutePath;
    }
  }

  const packAssetRecords = dedupeByCanonicalPath(packAssetRecordsByPackId.get(fileStem) || []);
  if (packAssetRecords.length === 0) {
    return "";
  }

  const inferredPackInfo = mergePackInfo(fileStem, packAssetRecords, null);
  if (!inferredPackInfo) {
    return "";
  }

  const semanticRelativePath = buildPackSemanticRelativePath("import", inferredPackInfo, "", new Set());
  const materializedRelativePath = buildMaterializedRelativePath("import", semanticRelativePath);
  const translatedBasePath = stripFileExtension(materializedRelativePath);
  const actualRelativePath = translatedCurrentFileBasePathMap.get(translatedBasePath) || "";
  if (actualRelativePath) {
    return path.join(bundleDir, actualRelativePath);
  }

  const translatedPrefixPath = buildPackMaterializedRelativePathPrefix(inferredPackInfo);
  const prefixedActualRelativePath = findTranslatedCurrentFilePathByPrefix(
    translatedCurrentFileBasePathMap,
    translatedPrefixPath
  );

  return prefixedActualRelativePath ? path.join(bundleDir, prefixedActualRelativePath) : "";
}

function buildTranslatedCurrentFilePathMap(bundleDir) {
  const translatedPathMap = new Map();

  for (const kind of ["import", "native"]) {
    const kindDir = path.join(bundleDir, kind);
    for (const relativePath of listFilesRecursive(kindDir)) {
      const kindRelativePath = path.posix.join(kind, relativePath);
      translatedPathMap.set(translateRelativePathSegments(kindRelativePath), kindRelativePath);
    }
  }

  return translatedPathMap;
}

function buildTranslatedCurrentFileBasePathMap(bundleDir) {
  const translatedBasePathMap = new Map();

  for (const kind of ["import", "native"]) {
    const kindDir = path.join(bundleDir, kind);
    for (const relativePath of listFilesRecursive(kindDir)) {
      const kindRelativePath = path.posix.join(kind, relativePath);
      translatedBasePathMap.set(
        stripFileExtension(translateRelativePathSegments(kindRelativePath)),
        kindRelativePath
      );
    }
  }

  return translatedBasePathMap;
}

function buildDeletedRootFileContentMatchMap(bundleDir, kind) {
  const bundleKindRelativeDir = normalizePathForPosix(path.relative(PROJECT_ROOT, path.join(bundleDir, kind)));
  if (!bundleKindRelativeDir) {
    return new Map();
  }

  const currentFileRelativePathByContent = new Map();
  for (const relativePath of listFilesRecursive(path.join(bundleDir, kind))) {
    const kindRelativePath = path.posix.join(kind, relativePath);
    try {
      const absolutePath = path.join(bundleDir, kindRelativePath);
      currentFileRelativePathByContent.set(fs.readFileSync(absolutePath, "utf8"), kindRelativePath);
    } catch (error) {
      continue;
    }
  }

  const matchedPathByOriginalRelativePath = new Map();
  for (const deletedFileName of listDeletedBundleRootFileNames(bundleDir, kind)) {
    const indexRelativePath = path.posix.join(bundleKindRelativeDir, deletedFileName);
    let deletedFileText = "";

    try {
      deletedFileText = childProcess.execFileSync(
        "git",
        ["show", `:${indexRelativePath}`],
        { cwd: PROJECT_ROOT, encoding: "utf8" }
      );
    } catch (error) {
      continue;
    }

    const currentKindRelativePath = currentFileRelativePathByContent.get(deletedFileText);
    if (!currentKindRelativePath) {
      continue;
    }

    matchedPathByOriginalRelativePath.set(path.posix.join(kind, deletedFileName), currentKindRelativePath);
  }

  return matchedPathByOriginalRelativePath;
}

function materializeTranslatedCurrentFiles(bundleDir) {
  const renameOperations = [];

  for (const kind of ["import", "native"]) {
    const kindDir = path.join(bundleDir, kind);
    for (const relativePath of listFilesRecursive(kindDir)) {
      const kindRelativePath = path.posix.join(kind, relativePath);
      const translatedRelativePath = translateRelativePathSegments(kindRelativePath);
      if (!translatedRelativePath || translatedRelativePath === kindRelativePath) {
        continue;
      }

      renameOperations.push({
        fromRelativePath: kindRelativePath,
        toRelativePath: translatedRelativePath,
      });
    }
  }

  renameOperations.sort((left, right) =>
    right.fromRelativePath.localeCompare(left.fromRelativePath, "en")
  );

  for (const renameOperation of renameOperations) {
    const fromAbsolutePath = path.join(bundleDir, renameOperation.fromRelativePath);
    const toAbsolutePath = path.join(bundleDir, renameOperation.toRelativePath);

    if (!fs.existsSync(fromAbsolutePath) || fs.existsSync(toAbsolutePath)) {
      continue;
    }

    ensureDirectory(path.dirname(toAbsolutePath));
    fs.renameSync(fromAbsolutePath, toAbsolutePath);
  }
}

function buildPackMaterializedRelativePathPrefix(packInfo) {
  const prefixSegments = packInfo.commonPrefixSegments.length > 0 ? packInfo.commonPrefixSegments : ["pack"];
  return path.posix.join(
    "import",
    "_packs",
    ...prefixSegments.map(sanitizeSegment),
    `${sanitizeSegment(packInfo.primaryLeafName)}__pack_`
  );
}

function findTranslatedCurrentFilePathByPrefix(translatedCurrentFileBasePathMap, translatedPrefixPath) {
  for (const [translatedBasePath, actualRelativePath] of translatedCurrentFileBasePathMap.entries()) {
    if (translatedBasePath.startsWith(translatedPrefixPath)) {
      return actualRelativePath;
    }
  }

  return "";
}

function listBundleRootFileNames(bundleDir, kind, existingAliasEntries) {
  const kindDir = path.join(bundleDir, kind);
  const rootFileNames = new Set(listFiles(kindDir));

  for (const aliasEntry of Array.isArray(existingAliasEntries) ? existingAliasEntries : []) {
    if (!aliasEntry || typeof aliasEntry.originalRelativePath !== "string") {
      continue;
    }

    const normalizedRelativePath = normalizePathForPosix(aliasEntry.originalRelativePath);
    if (!normalizedRelativePath.startsWith(`${kind}/`)) {
      continue;
    }

    rootFileNames.add(path.posix.basename(normalizedRelativePath));
  }

  for (const deletedFileName of listDeletedBundleRootFileNames(bundleDir, kind)) {
    rootFileNames.add(deletedFileName);
  }

  return Array.from(rootFileNames.values()).sort((left, right) => left.localeCompare(right, "en"));
}

function listDeletedBundleRootFileNames(bundleDir, kind) {
  const bundleKindRelativeDir = normalizePathForPosix(path.relative(PROJECT_ROOT, path.join(bundleDir, kind)));
  if (!bundleKindRelativeDir) {
    return [];
  }

  try {
    const rawOutput = childProcess.execFileSync(
      "git",
      ["diff", "--name-only", "--diff-filter=D", "--", bundleKindRelativeDir],
      { cwd: PROJECT_ROOT, encoding: "utf8" }
    );

    return rawOutput
      .split(/\r?\n/)
      .map((line) => normalizePathForPosix(line.trim()))
      .filter(Boolean)
      .map((relativePath) => path.posix.relative(bundleKindRelativeDir, relativePath))
      .filter((relativePath) => relativePath && !relativePath.includes("/"))
      .filter((relativePath) => !/%[0-9A-Fa-f]{2}/.test(path.posix.basename(relativePath)))
      .sort((left, right) => left.localeCompare(right, "en"));
  } catch (error) {
    return [];
  }
}

function inferKindFromOriginalRelativePath(originalRelativePath) {
  return String(originalRelativePath || "").startsWith("native/") ? "native" : "import";
}

function buildContentMatchedAliasEntry(kind, originalRelativePath, materializedRelativePath) {
  const normalizedMaterializedRelativePath = normalizePathForPosix(materializedRelativePath);
  const semanticRelativePath = normalizedMaterializedRelativePath.startsWith(`${kind}/`)
    ? path.posix.join(SEMANTIC_DIRNAME, path.posix.relative(kind, normalizedMaterializedRelativePath))
    : "";

  return {
    kind,
    originalRelativePath,
    semanticRelativePath,
    materializedRelativePath: normalizedMaterializedRelativePath,
    strategy: "exact-content-match",
    detail: {
      matchedFromDeletedRootFile: true,
    },
  };
}

function normalizeAliasEntryMaterializedPaths(bundleDir, aliasEntries) {
  return (Array.isArray(aliasEntries) ? aliasEntries : []).map((aliasEntry) => {
    if (!aliasEntry || typeof aliasEntry.materializedRelativePath !== "string" || aliasEntry.materializedRelativePath.length === 0) {
      return aliasEntry;
    }

    const resolvedMaterializedRelativePath = resolveExistingMaterializedRelativePath(
      bundleDir,
      aliasEntry.materializedRelativePath
    );
    if (!resolvedMaterializedRelativePath || resolvedMaterializedRelativePath === aliasEntry.materializedRelativePath) {
      return aliasEntry;
    }

    const kind = aliasEntry.kind || inferKindFromOriginalRelativePath(aliasEntry.originalRelativePath);
    const semanticRelativePath = resolvedMaterializedRelativePath.startsWith(`${kind}/`)
      ? path.posix.join(SEMANTIC_DIRNAME, path.posix.relative(kind, resolvedMaterializedRelativePath))
      : aliasEntry.semanticRelativePath;

    return Object.assign({}, aliasEntry, {
      kind,
      semanticRelativePath,
      materializedRelativePath: resolvedMaterializedRelativePath,
      detail: Object.assign({}, aliasEntry.detail, {
        resolvedFromExistingMaterializedFile: true,
      }),
    });
  });
}

function resolveExistingMaterializedRelativePath(bundleDir, materializedRelativePath) {
  const normalizedMaterializedRelativePath = normalizePathForPosix(materializedRelativePath);
  const materializedAbsolutePath = path.join(bundleDir, normalizedMaterializedRelativePath);
  if (fs.existsSync(materializedAbsolutePath)) {
    return normalizedMaterializedRelativePath;
  }

  const parentDirectoryPath = path.dirname(materializedAbsolutePath);
  if (!fs.existsSync(parentDirectoryPath)) {
    return normalizedMaterializedRelativePath;
  }

  const extension = path.extname(normalizedMaterializedRelativePath);
  const siblingFileNames = fs.readdirSync(parentDirectoryPath)
    .filter((entryName) => {
      const siblingAbsolutePath = path.join(parentDirectoryPath, entryName);
      try {
        const siblingStat = fs.lstatSync(siblingAbsolutePath);
        return siblingStat.isFile() && path.extname(entryName) === extension;
      } catch (error) {
        return false;
      }
    })
    .sort((left, right) => left.localeCompare(right, "en"));

  if (siblingFileNames.length !== 1) {
    return normalizedMaterializedRelativePath;
  }

  return normalizePathForPosix(path.join(path.dirname(normalizedMaterializedRelativePath), siblingFileNames[0]));
}

function writeRuntimeRemapManifest(bundleManifests) {
  const bundleManifestByName = new Map();

  for (const bundleName of getBundleNames()) {
    const bundleDir = path.join(SUBPACKAGES_DIR, bundleName);
    const existingBundleManifest = loadExistingBundleManifest(bundleDir);
    if (existingBundleManifest && existingBundleManifest.bundleName) {
      bundleManifestByName.set(existingBundleManifest.bundleName, existingBundleManifest);
    }
  }

  for (const bundleManifest of bundleManifests) {
    if (bundleManifest && bundleManifest.bundleName) {
      bundleManifestByName.set(bundleManifest.bundleName, bundleManifest);
    }
  }

  const runtimeManifest = {
    generatedAt: new Date().toISOString(),
    mappings: {},
  };

  for (const bundleManifest of bundleManifestByName.values()) {
    const bundleName = bundleManifest.bundleName;
    const aliasEntries = bundleManifest.importAliases.concat(bundleManifest.nativeAliases);

    for (const entry of aliasEntries) {
      if (!entry.materializedRelativePath) {
        continue;
      }

      const originalPath = path.posix.join("subpackages", bundleName, entry.originalRelativePath);
      const resolvedMaterializedRelativePath = resolveExistingMaterializedRelativePath(
        path.join(SUBPACKAGES_DIR, bundleName),
        entry.materializedRelativePath
      );
      const materializedPath = path.posix.join("subpackages", bundleName, resolvedMaterializedRelativePath);
      runtimeManifest.mappings[originalPath] = materializedPath;
    }
  }

  ensureDirectory(path.dirname(RUNTIME_REMAP_MANIFEST_PATH));
  fs.writeFileSync(
    RUNTIME_REMAP_MANIFEST_PATH,
    "\"use strict\";\n\nmodule.exports = " + JSON.stringify(runtimeManifest, null, 2) + ";\n",
    "utf8"
  );
}

function findCanonicalPathForUuidStem(
  uuidStem,
  directCanonicalPathByExactUuid,
  directCanonicalPathByNormalizedUuid,
  canonicalPathByCompressedUuid,
  canonicalPathByReportUuid,
  globalCanonicalPathByReportUuid,
  globalCanonicalPathByCompressedUuid
) {
  return directCanonicalPathByExactUuid.get(uuidStem) ||
    directCanonicalPathByExactUuid.get(stripUuidSuffix(uuidStem)) ||
    directCanonicalPathByNormalizedUuid.get(normalizeUuidKey(uuidStem)) ||
    canonicalPathByCompressedUuid.get(uuidStem) ||
    canonicalPathByCompressedUuid.get(stripUuidSuffix(uuidStem)) ||
    canonicalPathByCompressedUuid.get(normalizeUuidKey(uuidStem)) ||
    canonicalPathByReportUuid.get(normalizeUuidKey(uuidStem)) ||
    globalCanonicalPathByCompressedUuid.get(uuidStem) ||
    globalCanonicalPathByCompressedUuid.get(stripUuidSuffix(uuidStem)) ||
    globalCanonicalPathByCompressedUuid.get(normalizeUuidKey(uuidStem)) ||
    globalCanonicalPathByReportUuid.get(normalizeUuidKey(uuidStem)) ||
    "";
}

function mergePackInfo(packStem, packAssetRecords, parsedPackInfo) {
  const canonicalPaths = packAssetRecords.map((record) => record.canonicalPath).filter(Boolean);
  const collectedNames = [
    ...canonicalPaths.map((canonicalPath) => getMeaningfulLeafName(canonicalPath)),
    ...(parsedPackInfo ? parsedPackInfo.assetNames : []),
  ].filter(Boolean);

  const textureUuidKeys = dedupeArray((parsedPackInfo ? parsedPackInfo.textureUuidKeys : []).map(stripUuidSuffix).filter(Boolean));
  if (canonicalPaths.length === 0 && collectedNames.length === 0 && textureUuidKeys.length === 0) {
    return null;
  }

  const commonPrefixSegments = getCommonPrefixSegments(canonicalPaths.length > 0 ? canonicalPaths : collectedNames);
  const primaryLeafName = pickPrimaryLeafName(collectedNames);

  return {
    packStem,
    canonicalPaths,
    commonPrefixSegments,
    primaryLeafName,
    assetCount: Math.max(canonicalPaths.length, collectedNames.length, 1),
    textureUuidKeys,
  };
}

function parseImportFileForPackInfo(filePath) {
  let parsed;
  try {
    parsed = loadJson(filePath);
  } catch (error) {
    return null;
  }

  if (!Array.isArray(parsed)) {
    return null;
  }

  const assetNames = [];
  const textureUuidKeys = [];

  walkValue(parsed, (value) => {
    if (typeof value === "string") {
      if (looksLikeTextureReference(value)) {
        textureUuidKeys.push(stripUuidSuffix(value));
      }
      return;
    }

    if (value && typeof value === "object" && typeof value.name === "string" && value.name.length > 0) {
      assetNames.push(value.name);
    }
  });

  if (assetNames.length === 0 && textureUuidKeys.length === 0) {
    return null;
  }

  return {
    assetNames: dedupeArray(assetNames),
    textureUuidKeys: dedupeArray(textureUuidKeys),
  };
}

function walkValue(value, visitor) {
  visitor(value);

  if (Array.isArray(value)) {
    for (const child of value) {
      walkValue(child, visitor);
    }
    return;
  }

  if (value && typeof value === "object") {
    for (const child of Object.values(value)) {
      walkValue(child, visitor);
    }
  }
}

function buildDirectSemanticRelativePath(kind, canonicalPath, extension, usedPaths) {
  const pathSegments = splitCanonicalPath(canonicalPath);
  if (pathSegments.length === 0) {
    return "";
  }

  const fileName = `${sanitizeSegment(pathSegments[pathSegments.length - 1])}${extension}`;
  const relativePath = path.posix.join(SEMANTIC_DIRNAME, ...pathSegments.slice(0, -1).map(sanitizeSegment), fileName);
  return ensureUniqueRelativePath(relativePath, usedPaths);
}

function buildPackSemanticRelativePath(kind, packInfo, extension, usedPaths) {
  const prefixSegments = packInfo.commonPrefixSegments.length > 0 ? packInfo.commonPrefixSegments : ["pack"];
  const fileName = `${sanitizeSegment(packInfo.primaryLeafName)}__pack_${packInfo.assetCount}${extension}`;
  const relativePath = path.posix.join(SEMANTIC_DIRNAME, "_packs", ...prefixSegments.map(sanitizeSegment), fileName);
  return ensureUniqueRelativePath(relativePath, usedPaths);
}

function buildTextureSemanticRelativePath(textureInfo, extension, usedPaths) {
  const prefixSegments = textureInfo.commonPrefixSegments.length > 0 ? textureInfo.commonPrefixSegments : ["texture"];
  const fileName = `${sanitizeSegment(textureInfo.primaryLeafName)}__texture_${textureInfo.assetCount}${extension}`;
  const relativePath = path.posix.join(SEMANTIC_DIRNAME, ...prefixSegments.map(sanitizeSegment), fileName);
  return ensureUniqueRelativePath(relativePath, usedPaths);
}

function buildMaterializedRelativePath(kind, semanticRelativePath) {
  if (typeof semanticRelativePath !== "string" || semanticRelativePath.length === 0) {
    return "";
  }

  const semanticPrefix = `${SEMANTIC_DIRNAME}/`;
  const strippedRelativePath = semanticRelativePath.startsWith(semanticPrefix)
    ? semanticRelativePath.slice(semanticPrefix.length)
    : semanticRelativePath;

  return path.posix.join(kind, strippedRelativePath);
}

function translateRelativePathSegments(relativePath) {
  if (typeof relativePath !== "string" || relativePath.length === 0) {
    return "";
  }

  return normalizePathForPosix(relativePath)
    .split("/")
    .filter(Boolean)
    .map(translatePathSegment)
    .join("/");
}

function translatePathSegment(segment) {
  const normalizedSegment = String(segment || "");
  if (!normalizedSegment) {
    return normalizedSegment;
  }

  const extension = path.posix.extname(normalizedSegment);
  const stem = extension
    ? normalizedSegment.slice(0, -extension.length)
    : normalizedSegment;

  return translateSegmentStem(stem) + extension;
}

function translateSegmentStem(stem) {
  const normalizedStem = String(stem || "");
  if (!normalizedStem) {
    return normalizedStem;
  }

  const directTranslation = translateSemanticSegment(normalizedStem);
  if (directTranslation !== normalizedStem) {
    return directTranslation;
  }

  for (const marker of ["__texture_", "__pack_"]) {
    const markerIndex = normalizedStem.indexOf(marker);
    if (markerIndex > 0) {
      const semanticPrefix = normalizedStem.slice(0, markerIndex);
      const suffix = normalizedStem.slice(markerIndex);
      return translateSemanticSegment(semanticPrefix) + suffix;
    }
  }

  const duplicateSuffixMatch = normalizedStem.match(/^(.*?)(__\d+)$/);
  if (duplicateSuffixMatch) {
    return translateSemanticSegment(duplicateSuffixMatch[1]) + duplicateSuffixMatch[2];
  }

  return normalizedStem;
}

function ensureUniqueRelativePath(relativePath, usedPaths) {
  const parsed = path.posix.parse(relativePath);
  let candidate = relativePath;
  let suffixIndex = 2;

  while (usedPaths.has(candidate)) {
    candidate = path.posix.join(parsed.dir, `${parsed.name}__${suffixIndex}${parsed.ext}`);
    suffixIndex += 1;
  }

  usedPaths.add(candidate);
  return candidate;
}

function splitCanonicalPath(canonicalPath) {
  return canonicalPath
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function getCommonPrefixSegments(pathsOrNames) {
  const splitPaths = pathsOrNames
    .map((value) => splitCanonicalPath(value))
    .filter((segments) => segments.length > 0)
    .map((segments) => {
      const normalized = segments.slice();
      if (normalized.length > 1 && GENERIC_TRAILING_SEGMENTS.has(normalized[normalized.length - 1])) {
        normalized.pop();
      }
      return normalized;
    });

  if (splitPaths.length === 0) {
    return [];
  }

  const prefix = splitPaths[0].slice();
  for (let index = prefix.length - 1; index >= 0; index -= 1) {
    const expected = prefix[index];
    const allMatch = splitPaths.every((segments) => segments[index] === expected);
    if (!allMatch) {
      prefix.splice(index);
    }
  }

  return prefix;
}

function pickPrimaryLeafName(leafNames) {
  const filteredLeafNames = leafNames
    .map((leafName) => stripGenericSuffix(leafName))
    .filter(Boolean);

  if (filteredLeafNames.length === 0) {
    return "unnamed";
  }

  filteredLeafNames.sort((left, right) => left.length - right.length || left.localeCompare(right, "zh-Hans-CN"));
  return filteredLeafNames[0];
}

function getMeaningfulLeafName(canonicalPath) {
  const segments = splitCanonicalPath(canonicalPath);
  if (segments.length === 0) {
    return "";
  }

  const leaf = segments[segments.length - 1];
  if (!GENERIC_TRAILING_SEGMENTS.has(leaf)) {
    return leaf;
  }

  return segments.length >= 2 ? segments[segments.length - 2] : leaf;
}

function stripGenericSuffix(value) {
  const segments = splitCanonicalPath(value);
  if (segments.length === 0) {
    return "";
  }

  const leaf = segments[segments.length - 1];
  if (!GENERIC_TRAILING_SEGMENTS.has(leaf)) {
    return leaf;
  }

  return segments.length >= 2 ? segments[segments.length - 2] : leaf;
}

function sanitizeSegment(segment) {
  const translatedSegment = translateSemanticSegment(segment);
  const cleaned = String(translatedSegment)
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return cleaned || "unnamed";
}

function translateSemanticSegment(segment) {
  const normalizedSegment = String(segment || "").trim();
  if (!normalizedSegment) {
    return normalizedSegment;
  }

  const decodedSegment = decodeMaybeUrlEncodedSegment(normalizedSegment);
  if (Object.prototype.hasOwnProperty.call(SEMANTIC_NAME_TRANSLATIONS, decodedSegment)) {
    return SEMANTIC_NAME_TRANSLATIONS[decodedSegment];
  }

  if (Object.prototype.hasOwnProperty.call(SEMANTIC_NAME_TRANSLATIONS, normalizedSegment)) {
    return SEMANTIC_NAME_TRANSLATIONS[normalizedSegment];
  }

  return decodedSegment;
}

function decodeMaybeUrlEncodedSegment(segment) {
  const normalizedSegment = String(segment || "").trim();
  if (!/%[0-9A-Fa-f]{2}/.test(normalizedSegment)) {
    return normalizedSegment;
  }

  try {
    return decodeURIComponent(normalizedSegment);
  } catch (error) {
    return normalizedSegment;
  }
}

function normalizePathForPosix(inputPath) {
  return String(inputPath || "").replace(/\\/g, "/");
}

function resolveBundleManifestPath(bundleDirOrName) {
  const bundleName = path.basename(String(bundleDirOrName || ""));
  return path.join(SEMANTIC_ALIAS_MANIFEST_DIR, `${bundleName}.json`);
}

function pruneUrlEncodedCompatibilityLinks(bundleDir) {
  for (const kind of ["import", "native"]) {
    pruneUrlEncodedCompatibilityLinksInDirectory(path.join(bundleDir, kind));
  }
}

function pruneUrlEncodedCompatibilityLinksInDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  for (const childName of fs.readdirSync(directoryPath)) {
    const childPath = path.join(directoryPath, childName);
    let childStat;
    try {
      childStat = fs.lstatSync(childPath);
    } catch (error) {
      continue;
    }

    if (childStat.isSymbolicLink()) {
      if (/%[0-9A-Fa-f]{2}/.test(childName)) {
        fs.rmSync(childPath, { force: true });
      }
      continue;
    }

    if (childStat.isDirectory()) {
      pruneUrlEncodedCompatibilityLinksInDirectory(childPath);
    }
  }
}

function normalizeUuidKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/@.+$/, "")
    .replace(/-/g, "");
}

function stripUuidSuffix(value) {
  return String(value || "").replace(/@.+$/, "");
}

function getAssetStorageStem(fileName) {
  const extension = path.extname(fileName);
  const withoutExtension = fileName.slice(0, -extension.length);
  const lastDotIndex = withoutExtension.lastIndexOf(".");
  if (lastDotIndex < 0) {
    return withoutExtension;
  }
  return withoutExtension.slice(0, lastDotIndex);
}

function looksLikeTextureReference(value) {
  return /^[0-9a-f-]{9,40}@[\w]+$/i.test(value);
}

function dedupeArray(values) {
  return [...new Set(values)];
}

function dedupeByCanonicalPath(assetRecords) {
  const seen = new Set();
  const uniqueRecords = [];

  for (const assetRecord of assetRecords) {
    const key = `${assetRecord.canonicalPath || ""}::${assetRecord.uuid || ""}::${assetRecord.compressedUuid || ""}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueRecords.push(assetRecord);
  }

  return uniqueRecords;
}

function listFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs.readdirSync(directoryPath)
    .filter((name) => {
      try {
        const stat = fs.lstatSync(path.join(directoryPath, name));
        return stat.isFile();
      } catch (error) {
        return false;
      }
    })
    .sort();
}

function listFilesRecursive(directoryPath, currentPrefix) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const relativePrefix = normalizePathForPosix(currentPrefix || "");
  const discoveredFiles = [];

  for (const entryName of fs.readdirSync(directoryPath).sort()) {
    const absolutePath = path.join(directoryPath, entryName);
    const relativePath = relativePrefix
      ? path.posix.join(relativePrefix, entryName)
      : entryName;
    let stat;

    try {
      stat = fs.lstatSync(absolutePath);
    } catch (error) {
      continue;
    }

    if (stat.isSymbolicLink()) {
      continue;
    }

    if (stat.isDirectory()) {
      discoveredFiles.push(...listFilesRecursive(absolutePath, relativePath));
      continue;
    }

    if (stat.isFile()) {
      discoveredFiles.push(relativePath);
    }
  }

  return discoveredFiles;
}

function stripFileExtension(filePath) {
  const normalizedFilePath = normalizePathForPosix(filePath);
  const extension = path.posix.extname(normalizedFilePath);
  return extension
    ? normalizedFilePath.slice(0, -extension.length)
    : normalizedFilePath;
}

function loadJson(filePath) {
  const rawText = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(rawText);
  if (parsed && typeof parsed === "object") {
    parsed._configPath = filePath;
  }
  return parsed;
}

function decodeCompressedUuid(compressedUuid) {
  if (typeof compressedUuid !== "string" || compressedUuid.length !== 22) {
    return compressedUuid;
  }

  UUID_TEMPLATE[0] = compressedUuid[0];
  UUID_TEMPLATE[1] = compressedUuid[1];

  for (let sourceIndex = 2, targetIndex = 2; sourceIndex < 22; sourceIndex += 2) {
    const leftValue = BASE64_VALUES[compressedUuid.charCodeAt(sourceIndex)];
    const rightValue = BASE64_VALUES[compressedUuid.charCodeAt(sourceIndex + 1)];

    UUID_TEMPLATE[++targetIndex] = HEX_CHARS[leftValue >> 2];
    UUID_TEMPLATE[++targetIndex] = HEX_CHARS[((leftValue & 3) << 2) | (rightValue >> 4)];
    UUID_TEMPLATE[++targetIndex] = HEX_CHARS[rightValue & 15];

    if (targetIndex === 8 || targetIndex === 13 || targetIndex === 18 || targetIndex === 23) {
      targetIndex += 1;
    }
  }

  return UUID_TEMPLATE.join("");
}

function createBase64ValueMap() {
  const valueMap = [];

  for (let index = 0; index < BASE64_KEY_CHARS.length; index += 1) {
    valueMap[BASE64_KEY_CHARS.charCodeAt(index)] = index;
  }

  return valueMap;
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

main();
