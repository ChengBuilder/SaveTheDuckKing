'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const FRAGMENT_VARIANT_FAMILY_CODES = ['a', 'b', 'c', 'd', 'e'];
const FRAGMENT_VARIANT_SHAPE_SLOTS = [1, 2, 3, 4, 5, 6];
const FRAGMENT_IMPORT_ROOT_RELATIVE_PATH = 'subpackages/DuckBundle/import/tex/fragment';
const LEGACY_NAME_PATTERN = /"name":"([1-6])"/;

/**
 * 把 DuckBundle fragment 的 SpriteFrame 元数据名从裸数字收敛到稳定可读名。
 * 当前只处理已被稳定证明的两条轴：
 * - a..e：fragment 变体族
 * - 1..6：fragment 形状槽位
 */
function semanticizeDuckBundleFragmentAssets() {
  const layout = resolveProjectLayout(__dirname);
  const importRootPath = resolveProjectFilePath(layout, FRAGMENT_IMPORT_ROOT_RELATIVE_PATH);
  const result = updateFragmentSpriteFrameNames(
    importRootPath,
    formatProjectPathFromWorkspace(layout, FRAGMENT_IMPORT_ROOT_RELATIVE_PATH)
  );

  console.log('[fragment 语义化] 已完成 DuckBundle fragment SpriteFrame 名称收敛。');
  console.log(
    '[fragment 语义化] 元数据更新:',
    result.label,
    '文件更新数:',
    result.updatedFileCount,
    '名称改写数:',
    result.replacementCount
  );
}

function updateFragmentSpriteFrameNames(rootDirectoryPath, displayLabel) {
  let updatedFileCount = 0;
  let replacementCount = 0;

  for (const familyCode of FRAGMENT_VARIANT_FAMILY_CODES) {
    for (const shapeSlot of FRAGMENT_VARIANT_SHAPE_SLOTS) {
      const filePath = path.join(rootDirectoryPath, familyCode, String(shapeSlot), 'spriteFrame__2.json');
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const semanticName = buildFragmentSemanticName(familyCode, shapeSlot);

      if (originalContent.includes('"name":"' + semanticName + '"')) {
        continue;
      }

      const legacyMatch = originalContent.match(LEGACY_NAME_PATTERN);
      if (!legacyMatch) {
        throw new Error('[fragment 语义化] 未找到预期旧名称：' + filePath);
      }

      if (Number(legacyMatch[1]) !== shapeSlot) {
        throw new Error(
          '[fragment 语义化] 文件路径与旧名称槽位不一致：' +
            filePath +
            '，旧名称=' +
            legacyMatch[1] +
            '，槽位=' +
            shapeSlot
        );
      }

      const nextContent = originalContent.replace(LEGACY_NAME_PATTERN, '"name":"' + semanticName + '"');
      fs.writeFileSync(filePath, nextContent);
      updatedFileCount += 1;
      replacementCount += 1;
    }
  }

  verifyNoLegacyFragmentNames(rootDirectoryPath);

  return {
    label: displayLabel,
    updatedFileCount: updatedFileCount,
    replacementCount: replacementCount
  };
}

function buildFragmentSemanticName(familyCode, shapeSlot) {
  return 'fragmentVariant' + familyCode.toUpperCase() + 'Shape' + String(shapeSlot);
}

function verifyNoLegacyFragmentNames(rootDirectoryPath) {
  for (const familyCode of FRAGMENT_VARIANT_FAMILY_CODES) {
    for (const shapeSlot of FRAGMENT_VARIANT_SHAPE_SLOTS) {
      const filePath = path.join(rootDirectoryPath, familyCode, String(shapeSlot), 'spriteFrame__2.json');
      const content = fs.readFileSync(filePath, 'utf8');
      const matchedLegacyName = content.match(LEGACY_NAME_PATTERN);

      if (matchedLegacyName) {
        throw new Error(
          '[fragment 语义化] 仍残留旧数字名称：' +
            filePath +
            '，命中=' +
            matchedLegacyName[0]
        );
      }
    }
  }
}

semanticizeDuckBundleFragmentAssets();
