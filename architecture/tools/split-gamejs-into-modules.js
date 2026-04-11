#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const GAME_JS_RELATIVE_PATH = 'game.js';
const OUTPUT_DIR_RELATIVE_PATH = 'runtime/gamejs-modules';
const MANIFEST_JS_FILENAME = 'manifest.js';
const MANIFEST_JSON_FILENAME = 'manifest.json';
const RUNTIME_MODULE_ID_PREFIX = 'runtime/gamejs-modules';

function main() {
  const layout = resolveProjectLayout(__dirname);
  const gameJsPath = resolveProjectFilePath(layout, GAME_JS_RELATIVE_PATH);
  const outputDirPath = resolveProjectFilePath(layout, OUTPUT_DIR_RELATIVE_PATH);

  const sourceCode = fs.readFileSync(gameJsPath, 'utf8');
  let defineRecords = [];

  if (hasInlineDefineModules(sourceCode)) {
    const captured = captureDefineModules(sourceCode, gameJsPath);
    defineRecords = toDefineRecordsFromCapture(captured.defineCalls);
  } else if (isSlimEntrySource(sourceCode)) {
    defineRecords = captureDefineRecordsFromExistingSplit(outputDirPath);
  } else {
    throw new Error('split-gamejs: 当前 game.js 不含 define 模块且不是已拆分入口，已中止。');
  }

  if (defineRecords.length === 0) {
    throw new Error('split-gamejs: 未捕获到 define 模块，已中止。');
  }

  fs.rmSync(outputDirPath, { recursive: true, force: true });
  fs.mkdirSync(outputDirPath, { recursive: true });

  const moduleEntries = writeModuleFiles(outputDirPath, defineRecords);
  writeManifestFiles(outputDirPath, moduleEntries);
  writeSlimGameEntry(gameJsPath);

  console.log('[split-gamejs] 已拆分模块:', moduleEntries.length);
  console.log('[split-gamejs] 输出目录:', formatProjectPathFromWorkspace(layout, OUTPUT_DIR_RELATIVE_PATH));
  console.log('[split-gamejs] 入口文件:', formatProjectPathFromWorkspace(layout, GAME_JS_RELATIVE_PATH));
}

function hasInlineDefineModules(sourceCode) {
  return /define\(\s*["'][^"']+["']\s*,\s*function/.test(sourceCode);
}

function isSlimEntrySource(sourceCode) {
  return sourceCode.includes('runtime/gamejs-modules/manifest.js');
}

function toDefineRecordsFromCapture(defineCalls) {
  const records = [];
  const seenModuleIds = new Set();

  for (const defineCall of defineCalls) {
    const originalModuleId = normalizePath(stripRuntimeModulePrefix(defineCall.moduleId));
    if (originalModuleId.length === 0 || seenModuleIds.has(originalModuleId)) {
      continue;
    }

    seenModuleIds.add(originalModuleId);
    records.push({
      moduleId: originalModuleId,
      factorySource: String(defineCall.factorySource)
    });
  }

  return records;
}

function captureDefineRecordsFromExistingSplit(outputDirPath) {
  const manifestPath = path.join(outputDirPath, MANIFEST_JSON_FILENAME);
  if (!fs.existsSync(manifestPath) || !fs.statSync(manifestPath).isFile()) {
    throw new Error('split-gamejs: 已拆分入口缺少 manifest.json，请先恢复模块清单后再执行。');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error('split-gamejs: manifest.json 为空或格式错误，请先恢复模块清单后再执行。');
  }

  const records = [];
  const seenModuleIds = new Set();

  for (const entry of manifest) {
    const moduleFilePath = resolveManifestModuleFilePath(outputDirPath, entry);
    if (!moduleFilePath) {
      continue;
    }

    if (!fs.existsSync(moduleFilePath) || !fs.statSync(moduleFilePath).isFile()) {
      throw new Error('split-gamejs: 清单引用的模块文件不存在: ' + normalizePath(path.relative(process.cwd(), moduleFilePath)));
    }

    const moduleSource = fs.readFileSync(moduleFilePath, 'utf8');
    const captured = captureDefineModules(moduleSource, moduleFilePath);
    if (captured.defineCalls.length === 0) {
      throw new Error('split-gamejs: 模块文件未包含 define 调用: ' + normalizePath(path.relative(process.cwd(), moduleFilePath)));
    }

    const firstDefine = captured.defineCalls[0];
    const manifestModuleId = normalizePath(String(entry && entry.moduleId ? entry.moduleId : ''));
    const originalModuleId = manifestModuleId.length > 0
      ? manifestModuleId
      : normalizePath(stripRuntimeModulePrefix(firstDefine.moduleId));

    if (originalModuleId.length === 0 || seenModuleIds.has(originalModuleId)) {
      continue;
    }

    seenModuleIds.add(originalModuleId);
    records.push({
      moduleId: originalModuleId,
      factorySource: String(firstDefine.factorySource)
    });
  }

  return records;
}

function resolveManifestModuleFilePath(outputDirPath, entry) {
  const filename = String(entry && entry.filename ? entry.filename : '').trim();
  const relativeModulePath = String(entry && entry.relativeModulePath ? entry.relativeModulePath : '').trim();

  if (relativeModulePath.length > 0) {
    return path.join(outputDirPath, relativeModulePath);
  }
  if (filename.length > 0) {
    return path.join(outputDirPath, filename);
  }
  return '';
}

function captureDefineModules(sourceCode, filename) {
  const defineCalls = [];
  const topLevelRequires = [];
  const sandbox = createSandbox(defineCalls, topLevelRequires);

  vm.createContext(sandbox);
  vm.runInContext(sourceCode, sandbox, {
    filename: filename,
    timeout: 5000
  });

  return {
    defineCalls: defineCalls,
    topLevelRequires: topLevelRequires
  };
}

function createSandbox(defineCalls, topLevelRequires) {
  function captureDefine(moduleId, factory) {
    if (typeof moduleId !== 'string' || typeof factory !== 'function') {
      return;
    }

    defineCalls.push({
      moduleId: normalizePath(moduleId),
      factorySource: String(factory)
    });
  }

  function captureRequire(request) {
    topLevelRequires.push(String(request || ''));
    return {};
  }

  const noop = function noop() {};
  const sandbox = {
    define: captureDefine,
    require: captureRequire,
    GameGlobal: {},
    console: {
      log: noop,
      info: noop,
      warn: noop,
      error: noop
    },
    setTimeout: noop,
    clearTimeout: noop,
    setInterval: noop,
    clearInterval: noop,
    Array: Array,
    Object: Object,
    Number: Number,
    String: String,
    Boolean: Boolean,
    Math: Math,
    Date: Date,
    RegExp: RegExp,
    JSON: JSON,
    Symbol: Symbol,
    Error: Error,
    TypeError: TypeError
  };

  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

function writeModuleFiles(outputDirPath, defineRecords) {
  const moduleEntries = [];

  for (let index = 0; index < defineRecords.length; index += 1) {
    const record = defineRecords[index];
    const moduleId = normalizePath(record.moduleId);
    const runtimeModuleId = toRuntimeModuleId(moduleId);
    const filename = createModuleFilename(moduleId, index);
    const targetPath = path.join(outputDirPath, filename);
    const factorySource = patchFactorySourceForRuntimeId(moduleId, String(record.factorySource));

    const content = [
      '\'use strict\';',
      '',
      '// Auto-generated by architecture/tools/split-gamejs-into-modules.js',
      'define(' + JSON.stringify(runtimeModuleId) + ', ' + factorySource + ');',
      ''
    ].join('\n');

    fs.writeFileSync(targetPath, content);

    moduleEntries.push({
      moduleId: moduleId,
      runtimeModuleId: runtimeModuleId,
      filename: filename
    });
  }

  return moduleEntries;
}

function patchFactorySourceForRuntimeId(moduleId, factorySource) {
  if (moduleId === 'game.js') {
    return factorySource
      .replace(/require\((['"])\.\/runtime\/asset-file-remap\.js\1\)/g, 'require("../../runtime/asset-file-remap.js")')
      .replace(/require\((['"])\.\/architecture\/boot\/game-bootstrap\.js\1\)/g, 'require("../../architecture/boot/game-bootstrap.js")');
  }

  if (moduleId === 'assets/start-scene/index.start-scene.js') {
    // Keep known hot-path fixes and then apply a generic rewrite.
    // We rewrite getComponent(<local-import-identifier>) into getComponent("<ExportName>")
    // to avoid circular-import timing producing undefined class refs at runtime (Cocos error 3804).
    const patchedSource = factorySource
      .replace(/p\("Canvas"\)\.getComponent\(A\)/g, 'p("Canvas").getComponent("DuckController")')
      .replace(/a\("Canvas"\)\.getComponent\(w\)/g, 'a("Canvas").getComponent("DuckController")')
      .replace(/y\("Canvas"\)\.getComponent\(P\)/g, 'y("Canvas").getComponent("Game2Controller")');

    return patchGetComponentImportedClassRefs(patchedSource);
  }

  return factorySource;
}

function patchGetComponentImportedClassRefs(factorySource) {
  const token = 'System.register("';
  const startIndices = [];
  let cursor = factorySource.indexOf(token);

  while (cursor !== -1) {
    startIndices.push(cursor);
    cursor = factorySource.indexOf(token, cursor + token.length);
  }

  if (startIndices.length === 0) {
    return factorySource;
  }

  let patchedSource = '';
  let previousEnd = 0;

  for (let index = 0; index < startIndices.length; index += 1) {
    const start = startIndices[index];
    const end = index + 1 < startIndices.length ? startIndices[index + 1] : factorySource.length;
    const chunk = factorySource.slice(start, end);

    patchedSource += factorySource.slice(previousEnd, start);
    patchedSource += patchSystemRegisterChunkGetComponentRefs(chunk);
    previousEnd = end;
  }

  return patchedSource;
}

function patchSystemRegisterChunkGetComponentRefs(chunkSource) {
  const localClassImportNameMap = collectImportNameMapFromSystemRegisterChunk(chunkSource, {
    onlyLocalScriptDeps: true,
    requireUppercaseExport: true
  });
  const dependencyImportNameMap = collectImportNameMapFromSystemRegisterChunk(chunkSource, {
    onlyLocalScriptDeps: false,
    requireUppercaseExport: false
  });

  if (localClassImportNameMap.size === 0 && dependencyImportNameMap.size === 0) {
    return chunkSource;
  }

  let patchedChunk = chunkSource;
  for (const [identifier, exportName] of localClassImportNameMap.entries()) {
    const getComponentPattern = new RegExp('\\.getComponent\\(' + escapeRegExp(identifier) + '\\)', 'g');
    const getComponentsPattern = new RegExp('\\.getComponents\\(' + escapeRegExp(identifier) + '\\)', 'g');
    patchedChunk = patchedChunk
      .replace(getComponentPattern, '.getComponent("' + exportName + '")')
      .replace(getComponentsPattern, '.getComponents("' + exportName + '")');
  }

  for (const [identifier, exportName] of dependencyImportNameMap.entries()) {
    const getComponentPattern = new RegExp('\\.getComponent\\(' + escapeRegExp(identifier) + '\\.([A-Za-z_$][\\w$]*)\\)', 'g');
    const getComponentsPattern = new RegExp('\\.getComponents\\(' + escapeRegExp(identifier) + '\\.([A-Za-z_$][\\w$]*)\\)', 'g');
    patchedChunk = patchedChunk
      .replace(getComponentPattern, function replaceNamespaceGetComponent(match, memberName) {
        return '.getComponent("' + exportName + '.' + memberName + '")';
      })
      .replace(getComponentsPattern, function replaceNamespaceGetComponents(match, memberName) {
        return '.getComponents("' + exportName + '.' + memberName + '")';
      });
  }

  return patchedChunk;
}

function collectImportNameMapFromSystemRegisterChunk(chunkSource, options) {
  const map = new Map();
  const conflicts = new Set();
  const settings = options || {};
  const onlyLocalScriptDeps = settings.onlyLocalScriptDeps === true;
  const requireUppercaseExport = settings.requireUppercaseExport === true;
  const depsStart = chunkSource.indexOf('[');
  const depsEnd = chunkSource.indexOf('],(function(e){', depsStart);
  const settersStart = chunkSource.indexOf('setters:[', depsEnd);
  const executeStart = chunkSource.indexOf('],execute:function', settersStart);

  if (depsStart === -1 || depsEnd === -1 || settersStart === -1 || executeStart === -1) {
    return map;
  }

  let dependencies = [];
  try {
    const depsLiteral = chunkSource.slice(depsStart, depsEnd + 1);
    dependencies = Function('"use strict"; return (' + depsLiteral + ');')();
  } catch (error) {
    return map;
  }

  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    return map;
  }

  const settersBlock = chunkSource.slice(settersStart + 'setters:['.length, executeStart);
  const setterBodies = collectSetterBodies(settersBlock);
  const setterCount = Math.min(dependencies.length, setterBodies.length);

  for (let index = 0; index < setterCount; index += 1) {
    const dependency = dependencies[index];
    if (onlyLocalScriptDeps && !isLocalScriptDependency(dependency)) {
      continue;
    }

    const setterBody = setterBodies[index];
    const assignmentPattern = /\b([A-Za-z_$][\w$]*)\s*=\s*e\.([A-Za-z_$][\w$]*)/g;
    let match = assignmentPattern.exec(setterBody);

    while (match) {
      const identifier = match[1];
      const exportName = match[2];

      if (exportName !== 'default' && (!requireUppercaseExport || /^[A-Z]/.test(exportName))) {
        if (!map.has(identifier)) {
          map.set(identifier, exportName);
        } else if (map.get(identifier) !== exportName) {
          conflicts.add(identifier);
        }
      }

      match = assignmentPattern.exec(setterBody);
    }
  }

  for (const conflict of conflicts.values()) {
    map.delete(conflict);
  }

  return map;
}

function collectSetterBodies(settersBlockSource) {
  const bodies = [];
  const token = 'function(e){';
  let cursor = 0;

  while (true) {
    const start = settersBlockSource.indexOf(token, cursor);
    if (start === -1) {
      break;
    }

    const bodyStart = start + token.length;
    let depth = 1;
    let index = bodyStart;

    while (index < settersBlockSource.length && depth > 0) {
      const char = settersBlockSource[index];
      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
      }
      index += 1;
    }

    if (depth !== 0) {
      break;
    }

    bodies.push(settersBlockSource.slice(bodyStart, index - 1));
    cursor = index;
  }

  return bodies;
}

function isLocalScriptDependency(dependency) {
  if (typeof dependency !== 'string') {
    return false;
  }
  return dependency.startsWith('./') && dependency.endsWith('.ts');
}

function writeManifestFiles(outputDirPath, moduleEntries) {
  const manifestJsonPath = path.join(outputDirPath, MANIFEST_JSON_FILENAME);
  const manifestJsPath = path.join(outputDirPath, MANIFEST_JS_FILENAME);

  fs.writeFileSync(manifestJsonPath, JSON.stringify(moduleEntries, null, 2) + '\n');

  const lines = [];
  lines.push('\'use strict\';');
  lines.push('');
  lines.push('// Auto-generated by architecture/tools/split-gamejs-into-modules.js');
  for (const entry of moduleEntries) {
    lines.push('require(\'./' + entry.filename + '\');');
  }
  lines.push('');

  fs.writeFileSync(manifestJsPath, lines.join('\n'));
}

function writeSlimGameEntry(gameJsPath) {
  const content = [
    '\'use strict\';',
    '',
    '// Slim entrypoint generated by architecture/tools/split-gamejs-into-modules.js',
    '// Keep plugin bridge and runtime boot order stable, while module definitions live in runtime/gamejs-modules/.',
    'var globalObject = (function () { return this; })();',
    'if (!globalObject && typeof GameGlobal !== "undefined") {',
    '  globalObject = GameGlobal;',
    '}',
    '',
    'var pluginInfoMap = {};',
    '',
    'globalObject.requirePlugin = globalObject.requirePlugin || function(path) {',
    '  var position = path.indexOf("/");',
    '  var alias = "";',
    '  var pagePath = "";',
    '',
    '  if (position !== -1) {',
    '    alias = path.substr(0, position);',
    '    pagePath = path.substr(position + 1, path.length);',
    '  } else {',
    '    alias = path;',
    '  }',
    '',
    '  if (Object.prototype.hasOwnProperty.call(pluginInfoMap, alias)) {',
    '    if (pagePath.length === 0) {',
    '      return require("__plugin__/" + pluginInfoMap[alias].appid);',
    '    }',
    '    return require("__plugin__/" + pluginInfoMap[alias].appid + "/" + pagePath);',
    '  }',
    '',
    '  console.error("not found alias: ", alias);',
    '  throw new Error("Plugin " + alias + " is not defined.");',
    '};',
    '',
    'require("./runtime/gamejs-modules/manifest.js");',
    'require("runtime/gamejs-modules/game.js");',
    ''
  ].join('\n');

  fs.writeFileSync(gameJsPath, content);
}

function toRuntimeModuleId(moduleId) {
  return normalizePath(path.posix.join(RUNTIME_MODULE_ID_PREFIX, moduleId));
}

function stripRuntimeModulePrefix(moduleId) {
  const normalizedModuleId = normalizePath(moduleId);
  const prefix = RUNTIME_MODULE_ID_PREFIX + '/';
  if (normalizedModuleId.startsWith(prefix)) {
    return normalizedModuleId.slice(prefix.length);
  }
  return normalizedModuleId;
}

function createModuleFilename(moduleId, index) {
  const indexLabel = String(index + 1).padStart(3, '0');
  const safeName = moduleId
    .replace(/[^A-Za-z0-9._-]+/g, '__')
    .replace(/^_+|_+$/g, '')
    .slice(0, 72) || 'module';
  return indexLabel + '__' + safeName + '__' + hashText(moduleId).toString(16) + '.js';
}

function hashText(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function normalizePath(targetPath) {
  return String(targetPath || '').replace(/\\/g, '/');
}

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
