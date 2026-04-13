'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const RUNTIME_MODULE_DIR = path.join(PROJECT_ROOT, 'runtime', 'gamejs-modules');
const SOURCE_MODULE_DIR = path.join(PROJECT_ROOT, 'source-project', 'runtime-modules');
const MANIFEST_JSON_PATH = path.join(RUNTIME_MODULE_DIR, 'manifest.json');
const MANIFEST_SCRIPT_PATH = path.join(RUNTIME_MODULE_DIR, 'manifest.js');
const HASH_SUFFIX_BEFORE_JS_RE = /\.([0-9a-f]{5})(?=\.js$)/gi;
const DASH_HASH_SUFFIX_BEFORE_JS_RE = /-[A-Za-z0-9]{8}(?=\.js$)/g;
const JS_SEGMENT_HASH_SUFFIX_RE = /\.js-[A-Za-z0-9]{8}(?=\.js$)/g;
const MODULE_ID_RENAME_OVERRIDES = Object.freeze({
  'cocos-js/_virtual_cc-cf1p7Jgo.js': 'cocos-js/_virtual_cc.js',
  'cocos-js/spine-BGFFnNyc.js': 'cocos-js/spine-wasm-path.js',
  'cocos-js/spine.asm-DxRECbrD.js': 'cocos-js/spine-asmjs-factory.js',
  'cocos-js/spine.js-1Pcan4ap.js': 'cocos-js/spine-asmjs-path.js',
  'cocos-js/spine.wasm-CKrzExoH.js': 'cocos-js/spine-wasm-runtime.js'
});

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = isTruthy(args['dry-run']);

  if (!isFile(MANIFEST_JSON_PATH)) {
    throw new Error('未找到 runtime manifest: ' + relativeProjectPath(MANIFEST_JSON_PATH));
  }

  const originalEntries = JSON.parse(fs.readFileSync(MANIFEST_JSON_PATH, 'utf8'));
  if (!Array.isArray(originalEntries) || originalEntries.length === 0) {
    throw new Error('runtime manifest 格式非法或为空');
  }

  const transformed = buildTransform(originalEntries);
  verifyRuntimeFilesExist(transformed.runtimeRenamePlan);
  verifySourceFilesExist(transformed.sourceRenamePlan);

  let rewrittenModuleFileCount = 0;
  let rewrittenSourceFileCount = 0;
  if (!dryRun) {
    executeRenamePlan(RUNTIME_MODULE_DIR, transformed.runtimeRenamePlan, 'oldName', 'newName');
    executeRenamePlan(SOURCE_MODULE_DIR, transformed.sourceRenamePlan, 'oldPath', 'newPath');
    rewrittenModuleFileCount = rewriteModuleFiles(transformed.nextEntries, transformed.literalReplacements);
    rewrittenSourceFileCount = rewriteSourceModuleFiles(transformed.literalReplacements);
    writeManifestFiles(transformed.nextEntries);
  }

  printSummary({
    dryRun: dryRun,
    totalEntries: transformed.nextEntries.length,
    dehashedModuleIdCount: transformed.dehashedModuleIdCount,
    dehashedRuntimeModuleIdCount: transformed.dehashedRuntimeModuleIdCount,
    renamedRuntimeFileCount: transformed.renamedRuntimeFileCount,
    renamedSourceFileCount: transformed.renamedSourceFileCount,
    rewrittenModuleFileCount: rewrittenModuleFileCount,
    rewrittenSourceFileCount: rewrittenSourceFileCount,
    replaceTokenCount: transformed.literalReplacements.length,
    renameSamples: transformed.runtimeRenamePlan
      .filter(function (item) {
        return item.oldName !== item.newName;
      })
      .slice(0, 20)
      .map(function (item) {
        return {
          from: item.oldName,
          to: item.newName
        };
      }),
    moduleIdSamples: transformed.moduleIdChanges.slice(0, 20)
  });
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function isTruthy(value) {
  return value === true || value === 'true' || value === '1';
}

function buildTransform(originalEntries) {
  const usedNames = new Map();
  const nextEntries = [];
  const runtimeRenamePlan = [];
  const moduleIdChanges = [];
  let dehashedModuleIdCount = 0;
  let dehashedRuntimeModuleIdCount = 0;

  const moduleIdOwner = new Map();
  const runtimeModuleIdOwner = new Map();

  for (let index = 0; index < originalEntries.length; index += 1) {
    const sourceEntry = originalEntries[index];
    const oldModuleId = String(sourceEntry.moduleId || '').trim();
    const oldFilename = String(sourceEntry.filename || '').trim();

    if (oldModuleId.length === 0 || oldFilename.length === 0) {
      throw new Error('manifest 存在空字段条目: ' + JSON.stringify(sourceEntry));
    }

    const oldRuntimeModuleId = String(sourceEntry.runtimeModuleId || '').trim();
    const newModuleId = normalizeModuleId(oldModuleId);
    const newRuntimeModuleId = 'runtime/gamejs-modules/' + newModuleId;

    if (newModuleId !== oldModuleId) {
      dehashedModuleIdCount += 1;
      moduleIdChanges.push({
        from: oldModuleId,
        to: newModuleId
      });
    }
    if (newRuntimeModuleId !== oldRuntimeModuleId) {
      dehashedRuntimeModuleIdCount += 1;
    }

    assertUniqueByKey(moduleIdOwner, newModuleId, oldModuleId, 'moduleId 去 hash 后发生冲突');
    assertUniqueByKey(runtimeModuleIdOwner, newRuntimeModuleId, oldRuntimeModuleId, 'runtimeModuleId 去 hash 后发生冲突');

    let newFilename = toCanonicalFilename(newModuleId);
    if (path.extname(newFilename) !== '.js') {
      newFilename += '.js';
    }
    newFilename = ensureUniqueName(newFilename, usedNames);

    const nextEntry = {
      moduleId: newModuleId,
      runtimeModuleId: newRuntimeModuleId,
      filename: newFilename
    };

    nextEntries.push(nextEntry);
    runtimeRenamePlan.push({
      oldName: oldFilename,
      newName: newFilename
    });
  }

  const replacementMap = new Map();
  for (let index = 0; index < originalEntries.length; index += 1) {
    const sourceEntry = originalEntries[index];
    const targetEntry = nextEntries[index];

    addLiteralReplacement(replacementMap, String(sourceEntry.runtimeModuleId || ''), targetEntry.runtimeModuleId);
    addLiteralReplacement(replacementMap, String(sourceEntry.moduleId || ''), targetEntry.moduleId);
    const oldModuleFileName = path.basename(String(sourceEntry.moduleId || ''));
    const newModuleFileName = path.basename(targetEntry.moduleId);
    if (oldModuleFileName !== newModuleFileName) {
      addLiteralReplacement(replacementMap, './' + oldModuleFileName, './' + newModuleFileName);
    }
  }

  const literalReplacements = Array.from(replacementMap.entries())
    .map(function toItem(entry) {
      return {
        from: entry[0],
        to: entry[1]
      };
    })
    .filter(function meaningful(item) {
      return item.from.length > 0 && item.from !== item.to;
    })
    .sort(function sortByLength(leftItem, rightItem) {
      return rightItem.from.length - leftItem.from.length;
    });

  const sourceRenamePlan = buildSourceRenamePlan(originalEntries, nextEntries);

  return {
    nextEntries: nextEntries,
    runtimeRenamePlan: runtimeRenamePlan,
    sourceRenamePlan: sourceRenamePlan,
    literalReplacements: literalReplacements,
    dehashedModuleIdCount: dehashedModuleIdCount,
    dehashedRuntimeModuleIdCount: dehashedRuntimeModuleIdCount,
    renamedRuntimeFileCount: runtimeRenamePlan.filter(function (item) {
      return item.oldName !== item.newName;
    }).length,
    renamedSourceFileCount: sourceRenamePlan.filter(function (item) {
      return item.oldPath !== item.newPath;
    }).length,
    moduleIdChanges: moduleIdChanges
  };
}

function addLiteralReplacement(replacementMap, fromValue, toValue) {
  const from = String(fromValue || '');
  const to = String(toValue || '');
  if (from.length === 0 || from === to) {
    return;
  }
  if (replacementMap.has(from)) {
    if (replacementMap.get(from) !== to) {
      throw new Error('同一替换键出现不同目标，存在歧义: ' + from);
    }
    return;
  }
  replacementMap.set(from, to);
}

function assertUniqueByKey(ownerMap, key, owner, errorPrefix) {
  if (!ownerMap.has(key)) {
    ownerMap.set(key, owner);
    return;
  }
  const existingOwner = ownerMap.get(key);
  if (existingOwner !== owner) {
    throw new Error(errorPrefix + ': "' + key + '" <- [' + existingOwner + '] / [' + owner + ']');
  }
}

function normalizeModuleId(moduleId) {
  const rawModuleId = String(moduleId || '');
  if (Object.prototype.hasOwnProperty.call(MODULE_ID_RENAME_OVERRIDES, rawModuleId)) {
    return MODULE_ID_RENAME_OVERRIDES[rawModuleId];
  }
  return stripHashSuffixBeforeJs(rawModuleId);
}

function stripHashSuffixBeforeJs(value) {
  return String(value || '')
    .replace(JS_SEGMENT_HASH_SUFFIX_RE, '')
    .replace(HASH_SUFFIX_BEFORE_JS_RE, '')
    .replace(DASH_HASH_SUFFIX_BEFORE_JS_RE, '');
}

function buildSourceRenamePlan(originalEntries, nextEntries) {
  const plan = [];
  for (let index = 0; index < originalEntries.length; index += 1) {
    const sourceModuleId = String(originalEntries[index].moduleId || '').trim();
    const nextModuleId = String(nextEntries[index].moduleId || '').trim();
    if (sourceModuleId.length === 0 || nextModuleId.length === 0) {
      continue;
    }
    plan.push({
      oldPath: toModulePath(sourceModuleId),
      newPath: toModulePath(nextModuleId)
    });
  }
  return plan;
}

function toCanonicalFilename(moduleId) {
  const normalizedModuleId = String(moduleId || '')
    .replace(/^@/, '')
    .replace(/\//g, '__')
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+/, '');
  return 'mod__' + normalizedModuleId;
}

function ensureUniqueName(candidateName, usedNames) {
  const lowerName = candidateName.toLowerCase();
  if (!usedNames.has(lowerName)) {
    usedNames.set(lowerName, 1);
    return candidateName;
  }

  const nextIndex = usedNames.get(lowerName) + 1;
  usedNames.set(lowerName, nextIndex);

  const parsed = path.parse(candidateName);
  return parsed.name + '__' + nextIndex + parsed.ext;
}

function verifyRuntimeFilesExist(renamePlan) {
  for (const item of renamePlan) {
    const sourcePath = path.join(RUNTIME_MODULE_DIR, item.oldName);
    if (!isFile(sourcePath)) {
      throw new Error('源文件不存在: ' + relativeProjectPath(sourcePath));
    }
  }
}

function verifySourceFilesExist(renamePlan) {
  for (const item of renamePlan) {
    const sourcePath = path.join(SOURCE_MODULE_DIR, item.oldPath);
    if (!isFile(sourcePath)) {
      throw new Error('source-project 模块不存在: ' + relativeProjectPath(sourcePath));
    }
  }
}

function executeRenamePlan(rootDir, renamePlan, oldKey, newKey) {
  for (const item of renamePlan) {
    if (item[oldKey] === item[newKey]) {
      continue;
    }
    const sourcePath = path.join(rootDir, item[oldKey]);
    const tempPath = sourcePath + '.__renaming_tmp__';
    fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
    fs.renameSync(sourcePath, tempPath);
    item.tempPath = tempPath;
  }

  for (const item of renamePlan) {
    if (item[oldKey] === item[newKey]) {
      continue;
    }
    const targetPath = path.join(rootDir, item[newKey]);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    if (fs.existsSync(targetPath)) {
      throw new Error('目标文件已存在: ' + relativeProjectPath(targetPath));
    }
    fs.renameSync(item.tempPath, targetPath);
  }
}

function rewriteModuleFiles(nextEntries, literalReplacements) {
  let rewrittenCount = 0;
  for (const entry of nextEntries) {
    const modulePath = path.join(RUNTIME_MODULE_DIR, entry.filename);
    if (!isFile(modulePath)) {
      throw new Error('重写阶段缺少模块文件: ' + relativeProjectPath(modulePath));
    }
    const originalContent = fs.readFileSync(modulePath, 'utf8');
    const nextContent = applyReplacements(originalContent, literalReplacements);
    if (nextContent === originalContent) {
      continue;
    }
    fs.writeFileSync(modulePath, nextContent, 'utf8');
    rewrittenCount += 1;
  }
  return rewrittenCount;
}

function rewriteSourceModuleFiles(literalReplacements) {
  let rewrittenCount = 0;
  const sourceFiles = listFilesRecursively(SOURCE_MODULE_DIR).filter(function (filePath) {
    return path.extname(filePath).toLowerCase() === '.js';
  });
  for (const sourceFilePath of sourceFiles) {
    const originalContent = fs.readFileSync(sourceFilePath, 'utf8');
    const nextContent = applyReplacements(originalContent, literalReplacements);
    if (nextContent === originalContent) {
      continue;
    }
    fs.writeFileSync(sourceFilePath, nextContent, 'utf8');
    rewrittenCount += 1;
  }
  return rewrittenCount;
}

function applyReplacements(content, replacements) {
  let output = content;
  for (const item of replacements) {
    output = output.split(item.from).join(item.to);
  }
  return output;
}

function listFilesRecursively(rootDir) {
  const results = [];
  if (!fs.existsSync(rootDir)) {
    return results;
  }
  const stack = [rootDir];
  while (stack.length > 0) {
    const currentDir = stack.pop();
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile()) {
        results.push(entryPath);
      }
    }
  }
  return results;
}

function writeManifestFiles(manifestEntries) {
  fs.writeFileSync(MANIFEST_JSON_PATH, JSON.stringify(manifestEntries, null, 2) + '\n', 'utf8');

  const lines = [
    '\'use strict\';',
    '',
    '// Auto-generated by architecture/tools/normalize-runtime-module-filenames.js'
  ];

  for (const entry of manifestEntries) {
    lines.push('require(\'./' + entry.filename + '\');');
  }
  lines.push('');

  fs.writeFileSync(MANIFEST_SCRIPT_PATH, lines.join('\n'), 'utf8');
}

function printSummary(summary) {
  console.log('[normalize-runtime-module-filenames] summary');
  console.log(JSON.stringify({
    dryRun: summary.dryRun,
    totalEntries: summary.totalEntries,
    dehashedModuleIdCount: summary.dehashedModuleIdCount,
    dehashedRuntimeModuleIdCount: summary.dehashedRuntimeModuleIdCount,
    renamedRuntimeFileCount: summary.renamedRuntimeFileCount,
    renamedSourceFileCount: summary.renamedSourceFileCount,
    rewrittenModuleFileCount: summary.rewrittenModuleFileCount,
    rewrittenSourceFileCount: summary.rewrittenSourceFileCount,
    replaceTokenCount: summary.replaceTokenCount
  }, null, 2));

  if (summary.renameSamples.length > 0) {
    console.log('[normalize-runtime-module-filenames] rename samples');
    for (const item of summary.renameSamples) {
      console.log('- ' + item.from + ' -> ' + item.to);
    }
  }

  if (summary.moduleIdSamples.length > 0) {
    console.log('[normalize-runtime-module-filenames] moduleId samples');
    for (const item of summary.moduleIdSamples) {
      console.log('- ' + item.from + ' -> ' + item.to);
    }
  }
}

function relativeProjectPath(targetPath) {
  return path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/');
}

function toModulePath(moduleId) {
  const normalized = String(moduleId || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const parsed = path.parse(normalized);
  if (parsed.ext.length > 0) {
    return normalized;
  }
  return normalized + '.js';
}

function isFile(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
}

main();
