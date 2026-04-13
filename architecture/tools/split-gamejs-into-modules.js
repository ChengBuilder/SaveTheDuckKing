#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
let prettier = null;
let babelParser = null;
let babelTraverse = null;
let babelGenerator = null;
try {
  prettier = require('prettier');
} catch (error) {
  prettier = null;
}
try {
  babelParser = require('@babel/parser');
  babelTraverse = require('@babel/traverse').default;
  babelGenerator = require('@babel/generator').default;
} catch (error) {
  babelParser = null;
  babelTraverse = null;
  babelGenerator = null;
}
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
const KEYWORD_SET = new Set([
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
  'let',
  'static',
  'await',
  'enum',
  'implements',
  'interface',
  'package',
  'private',
  'protected',
  'public',
  'arguments'
]);

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

    fs.writeFileSync(targetPath, formatModuleSourceForReadability(content));

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

    return semanticizeSystemRegisterImportAliases(patchGetComponentImportedClassRefs(patchedSource));
  }

  if (moduleId === 'assets/internal/index.internal.js' || moduleId === 'cocos-js/_virtual_cc-cf1p7Jgo.js') {
    return patchGetComponentImportedClassRefs(factorySource);
  }

  return factorySource;
}

function patchGetComponentImportedClassRefs(factorySource) {
  const token = 'System.register(';
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
    requireUppercaseExport: false
  });
  const ccComponentImportNameMap = collectImportNameMapFromSystemRegisterChunk(chunkSource, {
    onlyLocalScriptDeps: false,
    requireUppercaseExport: true,
    includeDependencyPaths: ['cc'],
    exportNameAllowSet: CC_COMPONENT_EXPORT_NAMES
  });
  const dependencyImportNameMap = collectImportNameMapFromSystemRegisterChunk(chunkSource, {
    onlyLocalScriptDeps: false,
    requireUppercaseExport: false
  });

  let patchedChunk = chunkSource;
  for (const [identifier, exportName] of localClassImportNameMap.entries()) {
    const getComponentPattern = new RegExp('\\.getComponent\\(' + escapeRegExp(identifier) + '\\)', 'g');
    const getComponentsPattern = new RegExp('\\.getComponents\\(' + escapeRegExp(identifier) + '\\)', 'g');
    patchedChunk = patchedChunk
      .replace(getComponentPattern, '.getComponent("' + exportName + '")')
      .replace(getComponentsPattern, '.getComponents("' + exportName + '")');
  }

  for (const [identifier, exportName] of ccComponentImportNameMap.entries()) {
    const getComponentPattern = new RegExp('\\.getComponent\\(' + escapeRegExp(identifier) + '\\)', 'g');
    const getComponentsPattern = new RegExp('\\.getComponents\\(' + escapeRegExp(identifier) + '\\)', 'g');
    patchedChunk = patchedChunk
      .replace(getComponentPattern, '.getComponent("cc.' + exportName + '")')
      .replace(getComponentsPattern, '.getComponents("cc.' + exportName + '")');
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

  const moduleId = getSystemRegisterModuleId(chunkSource);
  if (moduleId && Object.prototype.hasOwnProperty.call(MODULE_SPECIFIC_COMPONENT_IDENTIFIER_MAP, moduleId)) {
    const identifierMap = MODULE_SPECIFIC_COMPONENT_IDENTIFIER_MAP[moduleId];
    for (const identifier of Object.keys(identifierMap)) {
      const componentName = identifierMap[identifier];
      const getComponentPattern = new RegExp('\\.getComponent\\(' + escapeRegExp(identifier) + '\\)', 'g');
      const getComponentsPattern = new RegExp('\\.getComponents\\(' + escapeRegExp(identifier) + '\\)', 'g');
      patchedChunk = patchedChunk
        .replace(getComponentPattern, '.getComponent("' + componentName + '")')
        .replace(getComponentsPattern, '.getComponents("' + componentName + '")');
    }
  }

  return patchedChunk;
}

function collectImportNameMapFromSystemRegisterChunk(chunkSource, options) {
  const map = new Map();
  const conflicts = new Set();
  const settings = options || {};
  const onlyLocalScriptDeps = settings.onlyLocalScriptDeps === true;
  const requireUppercaseExport = settings.requireUppercaseExport === true;
  const includeDependencyPaths = Array.isArray(settings.includeDependencyPaths) ? settings.includeDependencyPaths : null;
  const exportNameAllowSet = settings.exportNameAllowSet instanceof Set ? settings.exportNameAllowSet : null;
  const depsStart = chunkSource.indexOf('[');
  const depsEnd = findPatternIndex(chunkSource, /\],\s*(?:\(\s*)?function\s*\(/g, depsStart);
  const settersStart = findPatternIndex(chunkSource, /setters:\s*\[/g, depsEnd);
  const executeStart = findPatternIndex(chunkSource, /\],\s*execute:\s*function/g, settersStart);

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

  const settersBlockSource = chunkSource.slice(settersStart, executeStart);
  const settersArrayStart = findPatternIndex(settersBlockSource, /setters:\s*\[/g, 0);
  const settersBlock = settersArrayStart === -1
    ? ''
    : settersBlockSource.slice(settersArrayStart + settersBlockSource.match(/setters:\s*\[/)[0].length);
  const setterBlocks = collectSetterBlocks(settersBlock);
  const setterCount = Math.min(dependencies.length, setterBlocks.length);

  for (let index = 0; index < setterCount; index += 1) {
    const dependency = dependencies[index];
    if (onlyLocalScriptDeps && !isLocalScriptDependency(dependency)) {
      continue;
    }
    if (includeDependencyPaths && !includeDependencyPaths.includes(dependency)) {
      continue;
    }

    const setter = setterBlocks[index];
    const setterBody = setter.bodySource;
    const assignmentPattern = new RegExp(
      '([A-Za-z_$][\\w$]*)\\s*=\\s*' + escapeRegExp(setter.paramName) + '\\.([A-Za-z_$][\\w$]*)',
      'g'
    );
    let match = assignmentPattern.exec(setterBody);

    while (match) {
      const identifier = match[1];
      const exportName = match[2];

      if (exportName !== 'default' && (!requireUppercaseExport || /^[A-Z]/.test(exportName))) {
        if (exportNameAllowSet && !exportNameAllowSet.has(exportName)) {
          match = assignmentPattern.exec(setterBody);
          continue;
        }
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

function collectSetterBlocks(settersBlockSource) {
  const setterBlocks = [];
  const functionPattern = /function\s*\(([A-Za-z_$][\w$]*)\)\s*\{/g;
  let match = functionPattern.exec(settersBlockSource);

  while (match) {
    const paramName = match[1];
    const bodyStart = match.index + match[0].length;
    let depth = 1;
    let cursor = bodyStart;

    while (cursor < settersBlockSource.length && depth > 0) {
      const char = settersBlockSource[cursor];
      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
      }
      cursor += 1;
    }

    if (depth !== 0) {
      break;
    }

    setterBlocks.push({
      paramName: paramName,
      bodySource: settersBlockSource.slice(bodyStart, cursor - 1)
    });

    functionPattern.lastIndex = cursor;
    match = functionPattern.exec(settersBlockSource);
  }

  return setterBlocks;
}

function isLocalScriptDependency(dependency) {
  if (typeof dependency !== 'string') {
    return false;
  }
  return dependency.startsWith('./') && dependency.endsWith('.ts');
}

const CC_COMPONENT_EXPORT_NAMES = new Set([
  'Button',
  'BoxCollider2D',
  'Camera',
  'CircleCollider2D',
  'Component',
  'DistanceJoint2D',
  'EditBox',
  'Graphics',
  'HingeJoint2D',
  'HorizontalTextAlignment',
  'Joint2D',
  'Label',
  'Mask',
  'PolygonCollider2D',
  'ProgressBar',
  'RigidBody2D',
  'ScrollView',
  'Sprite',
  'UIOpacity',
  'UITransform',
  'VerticalTextAlignment'
]);

const MODULE_SPECIFIC_COMPONENT_IDENTIFIER_MAP = {
  'chunks:///_virtual/Fruit.ts': {
    t: 'Fruit'
  },
  'chunks:///_virtual/Nail.ts': {
    t: 'Nail'
  },
  'chunks:///_virtual/MathGridItem.ts': {
    t: 'MathGridItem'
  }
};

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

function formatModuleSourceForReadability(sourceCode) {
  if (!prettier || typeof prettier.format !== 'function') {
    return sourceCode;
  }

  try {
    return prettier.format(sourceCode, {
      parser: 'babel',
      printWidth: 120,
      singleQuote: false,
      trailingComma: 'none',
      semi: true
    });
  } catch (error) {
    return sourceCode;
  }
}

function semanticizeSystemRegisterImportAliases(factorySource) {
  if (!babelParser || typeof babelTraverse !== 'function' || typeof babelGenerator !== 'function') {
    return factorySource;
  }

  const wrapperSource = 'const __factory__ = ' + factorySource + ';';
  let ast = null;

  try {
    ast = babelParser.parse(wrapperSource, {
      sourceType: 'script'
    });
  } catch (error) {
    return factorySource;
  }

  let hasChanges = false;

  babelTraverse(ast, {
    CallExpression(pathRef) {
      if (!isSystemRegisterCallExpression(pathRef.node)) {
        return;
      }

      const argumentsPath = pathRef.get('arguments');
      if (!Array.isArray(argumentsPath) || argumentsPath.length < 3) {
        return;
      }

      const dependencyPathNode = argumentsPath[1];
      const callbackPathNode = argumentsPath[2];
      if (!dependencyPathNode.isArrayExpression() || !callbackPathNode.isFunction()) {
        return;
      }

      const dependencyPaths = dependencyPathNode.node.elements.map((element) =>
        element && element.type === 'StringLiteral' ? element.value : ''
      );
      const setterDefinitions = collectSetterAliasDefinitions(callbackPathNode.node);
      if (setterDefinitions.length === 0) {
        return;
      }

      const renamePlan = buildAliasRenamePlan(setterDefinitions, dependencyPaths, callbackPathNode.scope);
      if (renamePlan.length === 0) {
        return;
      }

      for (const planItem of renamePlan) {
        callbackPathNode.scope.rename(planItem.oldName, planItem.newName);
      }

      hasChanges = true;
    }
  });

  if (!hasChanges) {
    return factorySource;
  }

  const declarationNode = ast.program.body[0];
  if (!declarationNode || declarationNode.type !== 'VariableDeclaration') {
    return factorySource;
  }
  const declaration = declarationNode.declarations[0];
  if (!declaration || !declaration.init) {
    return factorySource;
  }

  return babelGenerator(declaration.init, {
    compact: false,
    comments: true,
    retainLines: false
  }).code;
}

function isSystemRegisterCallExpression(node) {
  return Boolean(
    node &&
      node.type === 'CallExpression' &&
      node.callee &&
      node.callee.type === 'MemberExpression' &&
      node.callee.object &&
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'System' &&
      node.callee.property &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'register'
  );
}

function collectSetterAliasDefinitions(callbackNode) {
  if (!callbackNode || callbackNode.type !== 'FunctionExpression') {
    return [];
  }

  const returnStatement = callbackNode.body.body.find((statement) => statement.type === 'ReturnStatement');
  if (!returnStatement || !returnStatement.argument || returnStatement.argument.type !== 'ObjectExpression') {
    return [];
  }

  const settersProperty = returnStatement.argument.properties.find((property) => {
    if (property.type !== 'ObjectProperty' && property.type !== 'Property') {
      return false;
    }
    if (property.key.type === 'Identifier') {
      return property.key.name === 'setters';
    }
    return property.key.type === 'StringLiteral' && property.key.value === 'setters';
  });

  if (!settersProperty || !settersProperty.value || settersProperty.value.type !== 'ArrayExpression') {
    return [];
  }

  const definitions = [];
  const setterElements = settersProperty.value.elements;

  for (let setterIndex = 0; setterIndex < setterElements.length; setterIndex += 1) {
    const setterElement = setterElements[setterIndex];
    if (!setterElement || setterElement.type !== 'FunctionExpression') {
      continue;
    }
    if (setterElement.params.length === 0 || setterElement.params[0].type !== 'Identifier') {
      continue;
    }

    const setterParamName = setterElement.params[0].name;
    const bodyStatements = setterElement.body.body || [];
    for (const statement of bodyStatements) {
      if (statement.type !== 'ExpressionStatement') {
        continue;
      }
      collectAliasDefinitionsFromExpression(statement.expression, setterParamName, setterIndex, definitions);
    }
  }

  return definitions;
}

function collectAliasDefinitionsFromExpression(expressionNode, setterParamName, setterIndex, sink) {
  if (!expressionNode) {
    return;
  }

  if (expressionNode.type === 'SequenceExpression') {
    for (const subExpression of expressionNode.expressions) {
      collectAliasDefinitionsFromExpression(subExpression, setterParamName, setterIndex, sink);
    }
    return;
  }

  if (expressionNode.type !== 'AssignmentExpression' || expressionNode.operator !== '=') {
    return;
  }
  if (!expressionNode.left || expressionNode.left.type !== 'Identifier') {
    return;
  }
  if (!expressionNode.right || expressionNode.right.type !== 'MemberExpression') {
    return;
  }
  if (!expressionNode.right.object || expressionNode.right.object.type !== 'Identifier') {
    return;
  }
  if (expressionNode.right.object.name !== setterParamName) {
    return;
  }
  if (!expressionNode.right.property || expressionNode.right.property.type !== 'Identifier') {
    return;
  }

  sink.push({
    setterIndex: setterIndex,
    localAlias: expressionNode.left.name,
    exportName: expressionNode.right.property.name
  });
}

function buildAliasRenamePlan(definitions, dependencyPaths, callbackScope) {
  const aliasToDefinition = new Map();
  for (const definition of definitions) {
    if (!definition.localAlias || definition.localAlias.length === 0) {
      continue;
    }
    const oldDefinition = aliasToDefinition.get(definition.localAlias);
    if (!oldDefinition) {
      aliasToDefinition.set(definition.localAlias, definition);
      continue;
    }
    if (
      oldDefinition.exportName !== definition.exportName ||
      oldDefinition.setterIndex !== definition.setterIndex
    ) {
      aliasToDefinition.set(definition.localAlias, null);
    }
  }

  const usedNames = new Set(Object.keys(callbackScope.bindings));
  const renamePlan = [];

  for (const [localAlias, definition] of aliasToDefinition.entries()) {
    if (!definition) {
      continue;
    }
    if (!callbackScope.bindings[localAlias]) {
      continue;
    }
    if (!shouldSemanticizeAlias(localAlias)) {
      continue;
    }

    const dependencyPath = dependencyPaths[definition.setterIndex] || '';
    const readableName = createReadableAliasName(localAlias, definition.exportName, dependencyPath, usedNames);
    if (!readableName || readableName === localAlias) {
      continue;
    }

    usedNames.delete(localAlias);
    usedNames.add(readableName);
    renamePlan.push({
      oldName: localAlias,
      newName: readableName
    });
  }

  return renamePlan;
}

function shouldSemanticizeAlias(identifier) {
  return /^[A-Za-z_$][\w$]*$/.test(identifier) && identifier.length <= 2;
}

function createReadableAliasName(localAlias, exportName, dependencyPath, usedNames) {
  const dependencyToken = dependencyPathToToken(dependencyPath);
  let baseName = exportName;

  if (!baseName || baseName === 'default') {
    baseName = dependencyToken;
  } else if (baseName === '_decorator') {
    baseName = 'cc_decorator';
  } else if (baseName === 'cclegacy') {
    baseName = 'cc_legacy';
  } else if (baseName === 'default') {
    baseName = dependencyToken;
  }

  if (!baseName) {
    baseName = localAlias;
  }

  let candidate = sanitizeIdentifier(baseName);
  if (candidate.length === 0) {
    candidate = localAlias;
  }
  if (KEYWORD_SET.has(candidate)) {
    candidate = candidate + '_alias';
  }

  const originalCandidate = candidate;
  let suffix = 2;
  while (usedNames.has(candidate) && candidate !== localAlias) {
    candidate = originalCandidate + '_' + suffix;
    suffix += 1;
  }

  return candidate;
}

function dependencyPathToToken(dependencyPath) {
  if (!dependencyPath) {
    return '';
  }
  if (dependencyPath === 'cc') {
    return 'cc';
  }

  const normalized = normalizePath(String(dependencyPath || ''));
  const segments = normalized.split('/');
  const lastSegment = segments[segments.length - 1] || '';
  const withoutExtension = lastSegment.replace(/\.[A-Za-z0-9]+$/, '');
  return sanitizeIdentifier(withoutExtension);
}

function sanitizeIdentifier(rawName) {
  let normalized = String(rawName || '')
    .replace(/[^A-Za-z0-9_$]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (normalized.length === 0) {
    return '';
  }
  if (!/^[A-Za-z_$]/.test(normalized)) {
    normalized = '_' + normalized;
  }
  return normalized;
}

function getSystemRegisterModuleId(chunkSource) {
  const match = chunkSource.match(/^System\.register\("([^"]+)"/);
  return match ? match[1] : '';
}

function findPatternIndex(sourceCode, pattern, startIndex) {
  if (!(pattern instanceof RegExp)) {
    return -1;
  }

  const safeStartIndex = Number.isFinite(startIndex) ? Math.max(0, startIndex) : 0;
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
  const matcher = new RegExp(pattern.source, flags);
  matcher.lastIndex = safeStartIndex;
  const match = matcher.exec(sourceCode);
  return match ? match.index : -1;
}

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
