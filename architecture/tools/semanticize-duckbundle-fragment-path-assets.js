'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');
const {
  updateConfigPathEntries,
  collectLegacyConfigPaths
} = require('./semanticize-shared');

const FRAGMENT_VARIANT_FAMILY_CODES = ['a', 'b', 'c', 'd', 'e'];
const FRAGMENT_VARIANT_SHAPE_SLOTS = [1, 2, 3, 4, 5, 6];
const LEGACY_FRAGMENT_PATH_PATTERN = /^tex\/fragment\/([a-e])\/([1-6])(?=\/|$)/;

const DUCK_BUNDLE_CONFIG_RELATIVE_PATH = 'subpackages/DuckBundle/config.duck-bundle.json';
const FRAGMENT_IMPORT_ROOT_RELATIVE_PATH = 'subpackages/DuckBundle/import/tex/fragment';
const FRAGMENT_NATIVE_ROOT_RELATIVE_PATH = 'subpackages/DuckBundle/native/tex/fragment';

function semanticizeDuckBundleFragmentCanonicalPaths() {
  const layout = resolveProjectLayout(__dirname);
  const configPath = resolveProjectFilePath(layout, DUCK_BUNDLE_CONFIG_RELATIVE_PATH);
  const importRootPath = resolveProjectFilePath(layout, FRAGMENT_IMPORT_ROOT_RELATIVE_PATH);
  const nativeRootPath = resolveProjectFilePath(layout, FRAGMENT_NATIVE_ROOT_RELATIVE_PATH);

  const configResult = updateConfigPathEntries(
    configPath,
    rewriteFragmentPathToSemantic,
    verifyNoLegacyConfigPaths
  );

  const importResult = migrateFragmentDirectoryRoot(importRootPath);
  const nativeResult = migrateFragmentDirectoryRoot(nativeRootPath);
  verifyNoLegacyConfigPathsFromFile(configPath);

  console.log('[fragment 路径语义化] 已完成 DuckBundle fragment canonical 路径收敛。');
  console.log(
    '[fragment 路径语义化] config 更新:',
    formatProjectPathFromWorkspace(layout, DUCK_BUNDLE_CONFIG_RELATIVE_PATH),
    '替换数:',
    configResult.replacementCount
  );
  console.log(
    '[fragment 路径语义化] import 迁移:',
    formatProjectPathFromWorkspace(layout, FRAGMENT_IMPORT_ROOT_RELATIVE_PATH),
    '重命名目录:',
    importResult.renamedDirectoryCount,
    '合并目录:',
    importResult.mergedDirectoryCount,
    '清理旧目录:',
    importResult.removedLegacyFamilyDirectoryCount
  );
  console.log(
    '[fragment 路径语义化] native 迁移:',
    formatProjectPathFromWorkspace(layout, FRAGMENT_NATIVE_ROOT_RELATIVE_PATH),
    '重命名目录:',
    nativeResult.renamedDirectoryCount,
    '合并目录:',
    nativeResult.mergedDirectoryCount,
    '清理旧目录:',
    nativeResult.removedLegacyFamilyDirectoryCount
  );
}

function rewriteFragmentPathToSemantic(assetPath) {
  const matchedTokens = LEGACY_FRAGMENT_PATH_PATTERN.exec(assetPath);
  if (!matchedTokens) {
    return assetPath;
  }

  const familyCode = matchedTokens[1];
  const shapeSlot = matchedTokens[2];
  const semanticPrefix = 'tex/fragment/' + buildVariantDirectoryName(familyCode) + '/shape' + shapeSlot;

  return assetPath.replace(LEGACY_FRAGMENT_PATH_PATTERN, semanticPrefix);
}

function verifyNoLegacyConfigPaths(parsedJson) {
  const legacyPathList = collectLegacyConfigPaths(parsedJson, isLegacyFragmentPath);
  if (legacyPathList.length === 0) {
    return;
  }

  throw new Error(
    '[fragment 路径语义化] config 仍残留 legacy fragment 路径：' +
      legacyPathList.slice(0, 10).join(', ')
  );
}

function verifyNoLegacyConfigPathsFromFile(configPath) {
  const parsedJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  verifyNoLegacyConfigPaths(parsedJson);
}

function isLegacyFragmentPath(assetPath) {
  return LEGACY_FRAGMENT_PATH_PATTERN.test(String(assetPath || ''));
}

function migrateFragmentDirectoryRoot(rootDirectoryPath) {
  let renamedDirectoryCount = 0;
  let mergedDirectoryCount = 0;
  let removedLegacyFamilyDirectoryCount = 0;

  for (const familyCode of FRAGMENT_VARIANT_FAMILY_CODES) {
    const legacyFamilyDirectoryPath = path.join(rootDirectoryPath, familyCode);
    const semanticFamilyDirectoryPath = path.join(rootDirectoryPath, buildVariantDirectoryName(familyCode));

    for (const shapeSlot of FRAGMENT_VARIANT_SHAPE_SLOTS) {
      const legacyShapeDirectoryPath = path.join(legacyFamilyDirectoryPath, String(shapeSlot));
      const semanticShapeDirectoryPath = path.join(semanticFamilyDirectoryPath, 'shape' + String(shapeSlot));
      const migrateResult = migrateDirectory(legacyShapeDirectoryPath, semanticShapeDirectoryPath);
      renamedDirectoryCount += migrateResult.renamedDirectoryCount;
      mergedDirectoryCount += migrateResult.mergedDirectoryCount;
    }

    if (removeDirectoryIfEmpty(legacyFamilyDirectoryPath)) {
      removedLegacyFamilyDirectoryCount += 1;
    }
  }

  return {
    renamedDirectoryCount: renamedDirectoryCount,
    mergedDirectoryCount: mergedDirectoryCount,
    removedLegacyFamilyDirectoryCount: removedLegacyFamilyDirectoryCount
  };
}

function migrateDirectory(sourceDirectoryPath, targetDirectoryPath) {
  if (!directoryExists(sourceDirectoryPath)) {
    return {
      renamedDirectoryCount: 0,
      mergedDirectoryCount: 0
    };
  }

  ensureDirectory(path.dirname(targetDirectoryPath));

  if (!fs.existsSync(targetDirectoryPath)) {
    fs.renameSync(sourceDirectoryPath, targetDirectoryPath);
    return {
      renamedDirectoryCount: 1,
      mergedDirectoryCount: 0
    };
  }

  if (!directoryExists(targetDirectoryPath)) {
    throw new Error('[fragment 路径语义化] 目标路径不是目录：' + targetDirectoryPath);
  }

  mergeDirectoryRecursively(sourceDirectoryPath, targetDirectoryPath);
  removeDirectoryIfEmpty(sourceDirectoryPath);

  return {
    renamedDirectoryCount: 0,
    mergedDirectoryCount: 1
  };
}

function mergeDirectoryRecursively(sourceDirectoryPath, targetDirectoryPath) {
  const entries = fs.readdirSync(sourceDirectoryPath, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDirectoryPath, entry.name);
    const targetPath = path.join(targetDirectoryPath, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.renameSync(sourcePath, targetPath);
        continue;
      }

      if (!directoryExists(targetPath)) {
        throw new Error('[fragment 路径语义化] 目录合并冲突：' + targetPath);
      }

      mergeDirectoryRecursively(sourcePath, targetPath);
      removeDirectoryIfEmpty(sourcePath);
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      fs.renameSync(sourcePath, targetPath);
      continue;
    }

    if (!filesHaveSameContent(sourcePath, targetPath)) {
      throw new Error('[fragment 路径语义化] 文件合并冲突：' + targetPath);
    }

    fs.unlinkSync(sourcePath);
  }
}

function filesHaveSameContent(sourceFilePath, targetFilePath) {
  const sourceContent = fs.readFileSync(sourceFilePath);
  const targetContent = fs.readFileSync(targetFilePath);
  return Buffer.compare(sourceContent, targetContent) === 0;
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function removeDirectoryIfEmpty(directoryPath) {
  if (!directoryExists(directoryPath)) {
    return false;
  }

  if (fs.readdirSync(directoryPath).length > 0) {
    return false;
  }

  fs.rmdirSync(directoryPath);
  return true;
}

function directoryExists(directoryPath) {
  return fs.existsSync(directoryPath) && fs.statSync(directoryPath).isDirectory();
}

function buildVariantDirectoryName(familyCode) {
  return 'variant' + String(familyCode || '').toUpperCase();
}

semanticizeDuckBundleFragmentCanonicalPaths();
