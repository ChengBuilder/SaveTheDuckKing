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
const SPLIT_MODULES_DIR_RELATIVE_PATH = 'runtime/gamejs-modules';
const SPLIT_MANIFEST_JSON_RELATIVE_PATH = 'runtime/gamejs-modules/manifest.json';
const RUNTIME_MODULE_ID_PREFIX = 'runtime/gamejs-modules/';
const REPORT_JSON_RELATIVE_PATH = 'architecture/docs/gamejs-deobfuscation-audit.json';
const REPORT_MD_RELATIVE_PATH = 'architecture/docs/gamejs-deobfuscation-audit.md';
const DEFAULT_EXPORT_DIR_RELATIVE_PATH = 'architecture/generated/gamejs-deobfuscated';

const KEYWORD_SET = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
  'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for',
  'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return',
  'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void',
  'while', 'with', 'yield', 'let', 'static', 'await', 'enum', 'implements',
  'interface', 'package', 'private', 'protected', 'public', 'arguments'
]);

function main() {
  const layout = resolveProjectLayout(__dirname);
  const gameJsPath = resolveProjectFilePath(layout, GAME_JS_RELATIVE_PATH);
  const reportJsonPath = resolveProjectFilePath(layout, REPORT_JSON_RELATIVE_PATH);
  const reportMarkdownPath = resolveProjectFilePath(layout, REPORT_MD_RELATIVE_PATH);
  const args = parseArgs(process.argv.slice(2), layout);

  const sourceCode = fs.readFileSync(gameJsPath, 'utf8');
  const captured = captureGameModules(layout, sourceCode, gameJsPath);
  const report = buildAuditReport(layout, captured);

  fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(reportMarkdownPath, buildMarkdown(report) + '\n');

  if (args.exportMode !== 'none' || args.explicitModules.length > 0) {
    exportModules(layout, captured, report, args);
  }

  console.log('[gamejs-deobfuscation-audit] 模块总数:', report.summary.defineModuleCount);
  console.log('[gamejs-deobfuscation-audit] 严格可达模块:', report.summary.strictReachableModuleCount);
  console.log('[gamejs-deobfuscation-audit] 严格不可达模块:', report.summary.strictUnreachableModuleCount);
  console.log('[gamejs-deobfuscation-audit] 保守不可达模块:', report.summary.conservativeUnreachableModuleCount);
  console.log('[gamejs-deobfuscation-audit] 壳模块候选:', report.summary.aliasModuleCount);
  console.log('[gamejs-deobfuscation-audit] 高混淆热点:', report.summary.highObfuscationModuleCount);
  console.log('[gamejs-deobfuscation-audit] 硬编码死分支模块:', report.summary.hardcodedFalseBranchModuleCount);
  console.log('report-json:', formatProjectPathFromWorkspace(layout, REPORT_JSON_RELATIVE_PATH));
  console.log('report-md:', formatProjectPathFromWorkspace(layout, REPORT_MD_RELATIVE_PATH));
}

function captureGameModules(layout, sourceCode, gameJsPath) {
  const capturedFromEntry = captureDefineModules(sourceCode, gameJsPath);
  if (capturedFromEntry.defineCalls.length > 0) {
    return capturedFromEntry;
  }

  if (!isSplitEntrySource(sourceCode)) {
    return capturedFromEntry;
  }

  const capturedFromSplitModules = captureDefineModulesFromSplitManifest(layout);
  return {
    defineCalls: capturedFromSplitModules.defineCalls,
    topLevelRequires: capturedFromEntry.topLevelRequires.concat(capturedFromSplitModules.topLevelRequires)
  };
}

function isSplitEntrySource(sourceCode) {
  return sourceCode.includes('runtime/gamejs-modules/manifest.js');
}

function captureDefineModulesFromSplitManifest(layout) {
  const manifestPath = resolveProjectFilePath(layout, SPLIT_MANIFEST_JSON_RELATIVE_PATH);
  if (!fs.existsSync(manifestPath)) {
    throw new Error('未找到拆分入口清单: ' + formatProjectPathFromWorkspace(layout, SPLIT_MANIFEST_JSON_RELATIVE_PATH));
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error('拆分入口清单为空或格式不合法: ' + formatProjectPathFromWorkspace(layout, SPLIT_MANIFEST_JSON_RELATIVE_PATH));
  }

  const modulesDirectoryPath = resolveProjectFilePath(layout, SPLIT_MODULES_DIR_RELATIVE_PATH);
  const defineCalls = [];
  const topLevelRequires = [];

  for (const entry of manifest) {
    const filename = String(entry && entry.filename ? entry.filename : '').trim();
    if (filename.length === 0) {
      continue;
    }

    const moduleFilePath = path.join(modulesDirectoryPath, filename);
    if (!fs.existsSync(moduleFilePath)) {
      throw new Error('拆分入口模块文件缺失: ' + normalizePath(path.relative(layout.projectRoot, moduleFilePath)));
    }

    const sourceCode = fs.readFileSync(moduleFilePath, 'utf8');
    const captured = captureDefineModules(sourceCode, moduleFilePath);
    defineCalls.push.apply(defineCalls, captured.defineCalls);
    topLevelRequires.push.apply(topLevelRequires, captured.topLevelRequires);
  }

  return {
    defineCalls: defineCalls,
    topLevelRequires: topLevelRequires
  };
}

function parseArgs(rawArgs, layout) {
  let exportMode = 'none';
  let exportDir = resolveProjectFilePath(layout, DEFAULT_EXPORT_DIR_RELATIVE_PATH);
  const explicitModules = [];

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === '--export-all') {
      exportMode = 'all';
      continue;
    }
    if (arg === '--export-unreachable') {
      exportMode = 'unreachable';
      continue;
    }
    if (arg === '--export-high-obfuscation') {
      exportMode = 'high-obfuscation';
      continue;
    }
    if (!arg.startsWith('--export-dir=')) {
      if (arg.startsWith('--export-module=')) {
        const moduleId = normalizePath(arg.slice('--export-module='.length).trim());
        if (moduleId.length > 0) {
          explicitModules.push(moduleId);
        }
      }
      continue;
    }

    const inputDir = arg.slice('--export-dir='.length).trim();
    if (inputDir.length === 0) {
      continue;
    }

    exportDir = path.isAbsolute(inputDir)
      ? inputDir
      : path.resolve(layout.projectRoot, inputDir);
  }

  return {
    exportMode: exportMode,
    exportDir: exportDir,
    explicitModules: explicitModules
  };
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
      moduleId: moduleId,
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

function buildAuditReport(layout, captured) {
  const duplicatesById = new Map();
  const moduleRecords = [];

  for (const defineCall of captured.defineCalls) {
    const moduleId = toLogicalModuleId(defineCall.moduleId);
    duplicatesById.set(moduleId, (duplicatesById.get(moduleId) || 0) + 1);

    moduleRecords.push({
      moduleId: moduleId,
      factorySource: defineCall.factorySource,
      bodySource: extractFunctionBody(defineCall.factorySource)
    });
  }

  const moduleIdSet = new Set(moduleRecords.map((record) => record.moduleId));
  const modulesById = new Map();

  for (const record of moduleRecords) {
    if (modulesById.has(record.moduleId)) {
      continue;
    }

    const requireRequests = extractRequireRequests(record.bodySource);
    const resolvedRequireRequests = requireRequests.map((request) =>
      resolveModuleRequest(moduleIdSet, record.moduleId, request)
    );
    const aliasTarget = detectAliasTarget(record.bodySource);
    const metrics = computeObfuscationMetrics(record.bodySource);
    const systemRegisterIds = extractSystemRegisterIds(record.bodySource);

    modulesById.set(record.moduleId, {
      moduleId: record.moduleId,
      factorySource: record.factorySource,
      bodySource: record.bodySource,
      requireRequests: requireRequests,
      resolvedRequireRequests: resolvedRequireRequests,
      aliasTarget: aliasTarget,
      metrics: metrics,
      systemRegisterIds: systemRegisterIds
    });
  }

  const normalizedTopLevelRequires = captured.topLevelRequires
    .map((request) => toLogicalModuleId(request))
    .filter(Boolean);
  const strictRootModules = Array.from(
    new Set(
      normalizedTopLevelRequires.filter((moduleId) => modulesById.has(moduleId))
    )
  ).sort();
  const heuristicRootModules = collectHeuristicRootModuleIds(Array.from(modulesById.keys()));
  const analysisRootModules = Array.from(
    new Set(strictRootModules.concat(heuristicRootModules))
  ).sort();

  const strictReachableModuleIds = collectReachableModules(modulesById, strictRootModules);
  const analysisReachableModuleIds = collectReachableModules(modulesById, analysisRootModules);

  const strictUnreachableModules = Array.from(modulesById.keys())
    .filter((moduleId) => !strictReachableModuleIds.has(moduleId))
    .sort();
  const conservativeUnreachableModules = Array.from(modulesById.keys())
    .filter((moduleId) => !analysisReachableModuleIds.has(moduleId))
    .sort();

  const aliasModules = Array.from(modulesById.values())
    .filter((moduleInfo) => moduleInfo.aliasTarget !== null)
    .map((moduleInfo) => ({
      moduleId: moduleInfo.moduleId,
      aliasTarget: moduleInfo.aliasTarget,
      resolvedAliasTarget: resolveModuleRequest(
        moduleIdSet,
        moduleInfo.moduleId,
        moduleInfo.aliasTarget
      )
    }))
    .sort((left, right) => left.moduleId.localeCompare(right.moduleId));

  const highObfuscationModules = Array.from(modulesById.values())
    .filter((moduleInfo) => isHighObfuscationModule(moduleInfo.metrics))
    .map((moduleInfo) => ({
      moduleId: moduleInfo.moduleId,
      declaredVariableCount: moduleInfo.metrics.declaredVariableCount,
      shortVariableCount: moduleInfo.metrics.shortVariableCount,
      shortVariableRatio: moduleInfo.metrics.shortVariableRatio,
      maxLineLength: moduleInfo.metrics.maxLineLength
    }))
    .sort((left, right) => {
      if (right.shortVariableRatio !== left.shortVariableRatio) {
        return right.shortVariableRatio - left.shortVariableRatio;
      }
      return right.declaredVariableCount - left.declaredVariableCount;
    });

  const deadBranchModules = Array.from(modulesById.values())
    .filter((moduleInfo) => moduleInfo.metrics.hardcodedFalseBranchCount > 0)
    .map((moduleInfo) => ({
      moduleId: moduleInfo.moduleId,
      hardcodedFalseBranchCount: moduleInfo.metrics.hardcodedFalseBranchCount
    }))
    .sort((left, right) => right.hardcodedFalseBranchCount - left.hardcodedFalseBranchCount);

  const duplicateDefineModules = Array.from(duplicatesById.entries())
    .filter((entry) => entry[1] > 1)
    .map((entry) => ({
      moduleId: entry[0],
      defineCount: entry[1]
    }))
    .sort((left, right) => right.defineCount - left.defineCount || left.moduleId.localeCompare(right.moduleId));

  const moduleSummaries = Array.from(modulesById.values())
    .map((moduleInfo) => ({
      moduleId: moduleInfo.moduleId,
      requireCount: moduleInfo.requireRequests.length,
      resolvedInternalRequireCount: moduleInfo.resolvedRequireRequests.filter((request) =>
        modulesById.has(request)
      ).length,
      systemRegisterCount: moduleInfo.systemRegisterIds.length,
      aliasTarget: moduleInfo.aliasTarget,
      declaredVariableCount: moduleInfo.metrics.declaredVariableCount,
      shortVariableCount: moduleInfo.metrics.shortVariableCount,
      shortVariableRatio: moduleInfo.metrics.shortVariableRatio,
      maxLineLength: moduleInfo.metrics.maxLineLength,
      averageLineLength: moduleInfo.metrics.averageLineLength,
      hardcodedFalseBranchCount: moduleInfo.metrics.hardcodedFalseBranchCount,
      isStrictReachable: strictReachableModuleIds.has(moduleInfo.moduleId),
      isAnalysisReachable: analysisReachableModuleIds.has(moduleInfo.moduleId),
      isHighObfuscation: isHighObfuscationModule(moduleInfo.metrics)
    }))
    .sort((left, right) => left.moduleId.localeCompare(right.moduleId));

  return {
    source: {
      gameJs: formatProjectPathFromWorkspace(layout, GAME_JS_RELATIVE_PATH)
    },
    summary: {
      defineModuleCount: modulesById.size,
      duplicateDefineModuleCount: duplicateDefineModules.length,
      topLevelRequireCount: normalizedTopLevelRequires.length,
      strictRootModuleCount: strictRootModules.length,
      heuristicRootModuleCount: heuristicRootModules.length,
      analysisRootModuleCount: analysisRootModules.length,
      strictReachableModuleCount: strictReachableModuleIds.size,
      strictUnreachableModuleCount: strictUnreachableModules.length,
      analysisReachableModuleCount: analysisReachableModuleIds.size,
      conservativeUnreachableModuleCount: conservativeUnreachableModules.length,
      aliasModuleCount: aliasModules.length,
      highObfuscationModuleCount: highObfuscationModules.length,
      hardcodedFalseBranchModuleCount: deadBranchModules.length
    },
    topLevelRequires: normalizedTopLevelRequires,
    strictRootModules: strictRootModules,
    heuristicRootModules: heuristicRootModules,
    analysisRootModules: analysisRootModules,
    duplicateDefineModules: duplicateDefineModules,
    strictUnreachableModules: strictUnreachableModules,
    conservativeUnreachableModules: conservativeUnreachableModules,
    aliasModules: aliasModules,
    highObfuscationModules: highObfuscationModules,
    hardcodedFalseBranchModules: deadBranchModules,
    modules: moduleSummaries
  };
}

function extractFunctionBody(factorySource) {
  const startIndex = factorySource.indexOf('{');
  const endIndex = factorySource.lastIndexOf('}');
  if (startIndex < 0 || endIndex <= startIndex) {
    return factorySource;
  }
  return factorySource.slice(startIndex + 1, endIndex);
}

function extractRequireRequests(moduleBodySource) {
  const requireRequests = [];
  const pattern = /require\(\s*(['"])([^'"\\]*(?:\\.[^'"\\]*)*)\1\s*\)/g;
  let match = pattern.exec(moduleBodySource);
  while (match) {
    requireRequests.push(unescapeQuoted(match[2]));
    match = pattern.exec(moduleBodySource);
  }
  return requireRequests;
}

function extractSystemRegisterIds(moduleBodySource) {
  const moduleIds = [];
  const pattern = /System\.register\(\s*(['"])([^'"\\]*(?:\\.[^'"\\]*)*)\1/g;
  let match = pattern.exec(moduleBodySource);
  while (match) {
    moduleIds.push(unescapeQuoted(match[2]));
    match = pattern.exec(moduleBodySource);
  }
  return moduleIds;
}

function detectAliasTarget(moduleBodySource) {
  const compact = moduleBodySource.replace(/\s+/g, '');
  let match = compact.match(/^["']usestrict["'];require\((['"])([^'"\\]*(?:\\.[^'"\\]*)*)\1\);?$/);
  if (match) {
    return unescapeQuoted(match[2]);
  }
  match = compact.match(/^require\((['"])([^'"\\]*(?:\\.[^'"\\]*)*)\1\);?$/);
  if (match) {
    return unescapeQuoted(match[2]);
  }
  return null;
}

function computeObfuscationMetrics(moduleBodySource) {
  const lines = moduleBodySource.split('\n');
  let maxLineLength = 0;
  let totalLineLength = 0;
  for (const line of lines) {
    const lineLength = line.length;
    if (lineLength > maxLineLength) {
      maxLineLength = lineLength;
    }
    totalLineLength += lineLength;
  }

  const declaredIdentifiers = extractDeclaredIdentifiers(moduleBodySource);
  const shortVariableCount = declaredIdentifiers.filter(isShortIdentifier).length;
  const shortVariableRatio = declaredIdentifiers.length === 0
    ? 0
    : shortVariableCount / declaredIdentifiers.length;

  return {
    declaredVariableCount: declaredIdentifiers.length,
    shortVariableCount: shortVariableCount,
    shortVariableRatio: Number(shortVariableRatio.toFixed(4)),
    maxLineLength: maxLineLength,
    averageLineLength: Number((totalLineLength / Math.max(lines.length, 1)).toFixed(2)),
    hardcodedFalseBranchCount: countPattern(moduleBodySource, /if\s*\(\s*(?:false|!1|0)\s*\)/g)
  };
}

function countPattern(sourceCode, pattern) {
  const matches = sourceCode.match(pattern);
  return matches ? matches.length : 0;
}

function extractDeclaredIdentifiers(sourceCode) {
  const identifiers = [];
  const declarationPattern = /\b(?:var|let|const)\s+([^;]+)/g;
  let declarationMatch = declarationPattern.exec(sourceCode);
  while (declarationMatch) {
    const declarationBody = declarationMatch[1];
    const segments = declarationBody.split(',');
    for (const segment of segments) {
      const trimmedSegment = segment.trim();
      const identifierMatch = trimmedSegment.match(/^([A-Za-z_$][A-Za-z0-9_$]*)/);
      if (!identifierMatch) {
        continue;
      }
      const identifier = identifierMatch[1];
      if (KEYWORD_SET.has(identifier)) {
        continue;
      }
      identifiers.push(identifier);
    }
    declarationMatch = declarationPattern.exec(sourceCode);
  }
  return identifiers;
}

function isShortIdentifier(identifier) {
  return identifier.length <= 2 || /^[a-z]\d?$/.test(identifier);
}

function isHighObfuscationModule(metrics) {
  if (metrics.declaredVariableCount < 8) {
    return false;
  }
  if (metrics.shortVariableRatio >= 0.75) {
    return true;
  }
  return metrics.maxLineLength >= 6000 && metrics.shortVariableRatio >= 0.55;
}

function resolveModuleRequest(moduleIdSet, currentModuleId, request) {
  const normalizedRequest = normalizePath(request);
  if (!normalizedRequest.startsWith('.')) {
    return normalizedRequest;
  }

  const currentDirectory = path.posix.dirname(currentModuleId);
  const resolved = path.posix.normalize(path.posix.join(currentDirectory, normalizedRequest));
  if (moduleIdSet.has(resolved)) {
    return resolved;
  }
  if (moduleIdSet.has(resolved + '.js')) {
    return resolved + '.js';
  }
  if (moduleIdSet.has(path.posix.join(resolved, 'index.js'))) {
    return path.posix.join(resolved, 'index.js');
  }
  return resolved;
}

function collectReachableModules(modulesById, rootModuleIds) {
  const reachable = new Set();
  const queue = rootModuleIds.slice();

  while (queue.length > 0) {
    const moduleId = queue.shift();
    if (reachable.has(moduleId) || !modulesById.has(moduleId)) {
      continue;
    }
    reachable.add(moduleId);
    const moduleInfo = modulesById.get(moduleId);
    for (const dependencyId of moduleInfo.resolvedRequireRequests) {
      if (modulesById.has(dependencyId) && !reachable.has(dependencyId)) {
        queue.push(dependencyId);
      }
    }
  }

  return reachable;
}

function collectHeuristicRootModuleIds(moduleIds) {
  const roots = [];
  const alwaysRootPattern = /^(?:application-main|engine-adapter|first-screen|web-adapter|subpackages-bootstrap)\.js$/;
  const assetsEntryPattern = /^assets\/.+\/index(?:\.[^.]+)?\.js$/;
  const subpackageEntryPattern = /^subpackages\/.+\/game\.js$/;
  const sourceEntryPattern = /^src\/(?:import-map|system\.bundle|polyfills\.bundle)\..+\.js$/;
  const gameScriptsPattern = /^src\/chunks\/game-scripts\.js$/;
  const cocosRuntimePattern = /^cocos-js\/.+\.js$/;
  const babelHelperPattern = /^@babel\/runtime\/helpers\/.+\.js$/;

  for (const moduleId of moduleIds) {
    if (
      alwaysRootPattern.test(moduleId) ||
      assetsEntryPattern.test(moduleId) ||
      subpackageEntryPattern.test(moduleId) ||
      sourceEntryPattern.test(moduleId) ||
      gameScriptsPattern.test(moduleId) ||
      cocosRuntimePattern.test(moduleId) ||
      babelHelperPattern.test(moduleId)
    ) {
      roots.push(moduleId);
    }
  }

  return Array.from(new Set(roots)).sort();
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# game.js 反混淆审计报告');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-gamejs-deobfuscation-audit.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- 来源：`' + report.source.gameJs + '`');
  lines.push('- define 模块总数：' + report.summary.defineModuleCount);
  lines.push('- 严格根模块数（仅顶层 require）：' + report.summary.strictRootModuleCount);
  lines.push('- 启发式根模块数（小游戏运行入口补齐）：' + report.summary.heuristicRootModuleCount);
  lines.push('- 分析根模块数（严格 + 启发式）：' + report.summary.analysisRootModuleCount);
  lines.push('- 严格可达模块数：' + report.summary.strictReachableModuleCount);
  lines.push('- 严格不可达模块数：' + report.summary.strictUnreachableModuleCount);
  lines.push('- 保守不可达模块数（剔除动态入口后仍不可达）：' + report.summary.conservativeUnreachableModuleCount);
  lines.push('- 壳模块候选数：' + report.summary.aliasModuleCount);
  lines.push('- 高混淆热点数：' + report.summary.highObfuscationModuleCount);
  lines.push('- 硬编码死分支模块数：' + report.summary.hardcodedFalseBranchModuleCount);
  lines.push('');

  lines.push('## 严格 Root Modules');
  if (report.strictRootModules.length === 0) {
    lines.push('- 无');
  } else {
    for (const moduleId of report.strictRootModules) {
      lines.push('- `' + moduleId + '`');
    }
  }
  lines.push('');

  lines.push('## 启发式 Root Modules');
  if (report.heuristicRootModules.length === 0) {
    lines.push('- 无');
  } else {
    for (const moduleId of report.heuristicRootModules.slice(0, 80)) {
      lines.push('- `' + moduleId + '`');
    }
    if (report.heuristicRootModules.length > 80) {
      lines.push('- ... 共 ' + report.heuristicRootModules.length + ' 个');
    }
  }
  lines.push('');

  lines.push('## 保守不可达模块（高优先级候选死代码）');
  if (report.conservativeUnreachableModules.length === 0) {
    lines.push('- 无');
  } else {
    for (const moduleId of report.conservativeUnreachableModules.slice(0, 80)) {
      lines.push('- `' + moduleId + '`');
    }
    if (report.conservativeUnreachableModules.length > 80) {
      lines.push('- ... 共 ' + report.conservativeUnreachableModules.length + ' 个');
    }
  }
  lines.push('');

  lines.push('## 壳模块候选');
  if (report.aliasModules.length === 0) {
    lines.push('- 无');
  } else {
    lines.push('| 模块 | 直接转发到 | 解析后目标 |');
    lines.push('| --- | --- | --- |');
    for (const aliasInfo of report.aliasModules.slice(0, 80)) {
      lines.push(
        '| `' + aliasInfo.moduleId + '` | `' + aliasInfo.aliasTarget + '` | `' + aliasInfo.resolvedAliasTarget + '` |'
      );
    }
  }
  lines.push('');

  lines.push('## 硬编码死分支信号');
  if (report.hardcodedFalseBranchModules.length === 0) {
    lines.push('- 无');
  } else {
    lines.push('| 模块 | if(false/!1/0) 次数 |');
    lines.push('| --- | ---: |');
    for (const moduleInfo of report.hardcodedFalseBranchModules.slice(0, 80)) {
      lines.push(
        '| `' + moduleInfo.moduleId + '` | ' + moduleInfo.hardcodedFalseBranchCount + ' |'
      );
    }
  }
  lines.push('');

  lines.push('## 高混淆热点');
  if (report.highObfuscationModules.length === 0) {
    lines.push('- 无');
  } else {
    lines.push('| 模块 | 声明变量数 | 短变量数 | 短变量比例 | 最大行长 |');
    lines.push('| --- | ---: | ---: | ---: | ---: |');
    for (const moduleInfo of report.highObfuscationModules.slice(0, 80)) {
      lines.push(
        '| `' + moduleInfo.moduleId + '` | ' +
          moduleInfo.declaredVariableCount + ' | ' +
          moduleInfo.shortVariableCount + ' | ' +
          moduleInfo.shortVariableRatio + ' | ' +
          moduleInfo.maxLineLength + ' |'
      );
    }
  }
  lines.push('');

  return lines.join('\n');
}

function exportModules(layout, captured, report, args) {
  const modulesById = new Map();
  for (const defineCall of captured.defineCalls) {
    const moduleId = toLogicalModuleId(defineCall.moduleId);
    if (modulesById.has(moduleId)) {
      continue;
    }
    modulesById.set(moduleId, {
      moduleId: moduleId,
      bodySource: extractFunctionBody(defineCall.factorySource)
    });
  }

  let targetModuleIds = [];
  if (args.explicitModules.length > 0) {
    targetModuleIds = args.explicitModules.slice();
  } else if (args.exportMode === 'all') {
    targetModuleIds = report.modules.map((moduleInfo) => moduleInfo.moduleId);
  } else if (args.exportMode === 'unreachable') {
    targetModuleIds = report.conservativeUnreachableModules.slice();
  } else if (args.exportMode === 'high-obfuscation') {
    targetModuleIds = report.highObfuscationModules.map((moduleInfo) => moduleInfo.moduleId);
  }

  fs.mkdirSync(args.exportDir, { recursive: true });
  const manifest = [];

  for (const moduleId of targetModuleIds) {
    if (!modulesById.has(moduleId)) {
      continue;
    }
    const moduleInfo = modulesById.get(moduleId);
    const filename = createExportFilename(moduleId);
    const targetPath = path.join(args.exportDir, filename);
    const formattedBody = formatForReadability(moduleInfo.bodySource);
    const exportedContent = [
      '\'use strict\';',
      '',
      '// Auto-exported from game.js define("' + moduleId + '").',
      'module.exports = function exportedModule(require, module, exports) {',
      formattedBody,
      '};',
      ''
    ].join('\n');
    fs.writeFileSync(targetPath, exportedContent);

    manifest.push({
      moduleId: moduleId,
      filename: filename
    });
  }

  fs.writeFileSync(
    path.join(args.exportDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );

  console.log(
    '[gamejs-deobfuscation-audit] 已导出模块:',
    manifest.length,
    'output:',
    path.relative(layout.projectRoot, args.exportDir)
  );
}

function createExportFilename(moduleId) {
  const baseName = moduleId
    .replace(/[^A-Za-z0-9._-]+/g, '__')
    .replace(/^_+|_+$/g, '');
  return baseName + '__' + hashText(moduleId).toString(16) + '.js';
}

function hashText(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function unescapeQuoted(value) {
  return value
    .replace(/\\'/g, '\'')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function normalizePath(targetPath) {
  return String(targetPath || '').replace(/\\/g, '/');
}

function toLogicalModuleId(moduleId) {
  const normalizedModuleId = normalizePath(moduleId);
  if (normalizedModuleId.startsWith(RUNTIME_MODULE_ID_PREFIX)) {
    return normalizedModuleId.slice(RUNTIME_MODULE_ID_PREFIX.length);
  }
  return normalizedModuleId;
}

function formatForReadability(sourceCode) {
  const indentUnit = '  ';
  let indentLevel = 1;
  let result = '';
  let tokenBuffer = '';

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escapeNext = false;

  function flushToken() {
    if (tokenBuffer.trim().length === 0) {
      tokenBuffer = '';
      return;
    }
    result += indentUnit.repeat(indentLevel) + tokenBuffer.trim() + '\n';
    tokenBuffer = '';
  }

  for (let index = 0; index < sourceCode.length; index += 1) {
    const char = sourceCode[index];
    const nextChar = sourceCode[index + 1] || '';

    if (inLineComment) {
      tokenBuffer += char;
      if (char === '\n') {
        flushToken();
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      tokenBuffer += char;
      if (char === '*' && nextChar === '/') {
        tokenBuffer += '/';
        index += 1;
        inBlockComment = false;
      }
      continue;
    }

    if (inSingleQuote || inDoubleQuote || inTemplate) {
      tokenBuffer += char;
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      if (inSingleQuote && char === '\'') {
        inSingleQuote = false;
      } else if (inDoubleQuote && char === '"') {
        inDoubleQuote = false;
      } else if (inTemplate && char === '`') {
        inTemplate = false;
      }
      continue;
    }

    if (char === '/' && nextChar === '/') {
      flushToken();
      tokenBuffer += '//';
      index += 1;
      inLineComment = true;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      flushToken();
      tokenBuffer += '/*';
      index += 1;
      inBlockComment = true;
      continue;
    }

    if (char === '\'') {
      tokenBuffer += char;
      inSingleQuote = true;
      continue;
    }

    if (char === '"') {
      tokenBuffer += char;
      inDoubleQuote = true;
      continue;
    }

    if (char === '`') {
      tokenBuffer += char;
      inTemplate = true;
      continue;
    }

    if (char === '{') {
      tokenBuffer += '{';
      flushToken();
      indentLevel += 1;
      continue;
    }

    if (char === '}') {
      flushToken();
      indentLevel = Math.max(1, indentLevel - 1);
      tokenBuffer += '}';
      flushToken();
      continue;
    }

    if (char === ';') {
      tokenBuffer += ';';
      flushToken();
      continue;
    }

    if (char === '\n' || char === '\r' || char === '\t') {
      tokenBuffer += ' ';
      continue;
    }

    tokenBuffer += char;
  }

  flushToken();
  return result.trimEnd();
}

main();
