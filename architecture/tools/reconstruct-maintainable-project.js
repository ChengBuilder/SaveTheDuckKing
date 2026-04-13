'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const RUNTIME_MODULE_DIR = path.join(PROJECT_ROOT, 'runtime', 'gamejs-modules');
const RUNTIME_MANIFEST_PATH = path.join(RUNTIME_MODULE_DIR, 'manifest.json');
const RESTORE_HASHED_ASSETS_SCRIPT = path.join(__dirname, 'restore-hashed-assets.js');
const DEFAULT_OUTPUT_RELATIVE = 'reconstructed-project';

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = isTruthy(args['dry-run']);
  const clean = isTruthy(args.clean);
  const outputRelative = String(args.output || DEFAULT_OUTPUT_RELATIVE).trim();
  const outputAbsolute = path.resolve(PROJECT_ROOT, outputRelative);
  const mappingPath = resolveOptionalPath(args.mapping || args.settings);

  const assetsRestoreOutput = path.join(outputAbsolute, 'assets-restored');
  const runtimeSourceOutput = path.join(outputAbsolute, 'source', 'runtime-modules');
  const reportOutput = path.join(outputAbsolute, 'reports', 'reconstruction-report.json');
  const runtimeMapOutput = path.join(outputAbsolute, 'reports', 'runtime-module-map.json');

  if (clean && !dryRun && fs.existsSync(outputAbsolute)) {
    fs.rmSync(outputAbsolute, { recursive: true, force: true });
  }

  ensureDirectory(path.dirname(reportOutput), dryRun);

  const assetsRestoreResult = runAssetsRestore({
    outputAbsolute: assetsRestoreOutput,
    mappingPath: mappingPath,
    dryRun: dryRun,
    clean: clean,
    mode: isTruthy(args['move-assets']) ? 'move' : 'copy'
  });

  const runtimeResult = rebuildRuntimeModules({
    outputAbsolute: runtimeSourceOutput,
    dryRun: dryRun
  });

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: dryRun,
    output: normalizeSlashes(path.relative(PROJECT_ROOT, outputAbsolute)),
    assetsRestore: assetsRestoreResult,
    runtimeRebuild: runtimeResult
  };

  if (!dryRun) {
    fs.writeFileSync(reportOutput, JSON.stringify(report, null, 2) + '\n', 'utf8');
    fs.writeFileSync(runtimeMapOutput, JSON.stringify(runtimeResult.moduleMap, null, 2) + '\n', 'utf8');
    writeReadme(outputAbsolute, report, runtimeResult);
  }

  printSummary(report, runtimeResult);
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

function resolveOptionalPath(inputPath) {
  if (!inputPath) {
    return null;
  }
  const absolutePath = path.resolve(PROJECT_ROOT, String(inputPath));
  if (!isFile(absolutePath)) {
    throw new Error('映射文件不存在: ' + normalizeSlashes(path.relative(PROJECT_ROOT, absolutePath)));
  }
  return absolutePath;
}

function runAssetsRestore(options) {
  const scriptRelative = normalizeSlashes(path.relative(PROJECT_ROOT, RESTORE_HASHED_ASSETS_SCRIPT));
  const outputRelative = normalizeSlashes(path.relative(PROJECT_ROOT, options.outputAbsolute));

  const commandArgs = [scriptRelative, '--output', outputRelative, '--mode', options.mode];

  if (options.mappingPath) {
    const mappingRelative = normalizeSlashes(path.relative(PROJECT_ROOT, options.mappingPath));
    commandArgs.push('--mapping', mappingRelative);
  }
  if (options.dryRun) {
    commandArgs.push('--dry-run');
  }
  if (options.clean) {
    commandArgs.push('--clean');
  }

  const commandLine = ['node'].concat(commandArgs).join(' ');
  const result = childProcess.spawnSync('node', commandArgs, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    throw new Error(
      '[assets-restore] 执行失败\n' +
        'command: ' + commandLine + '\n' +
        (result.stdout || '') + '\n' +
        (result.stderr || '')
    );
  }

  const summary = parseInlineJson(result.stdout, '[restore-hashed-assets] summary');

  return {
    command: commandLine,
    summary: summary,
    stdoutSample: tailLines(result.stdout, 40)
  };
}

function rebuildRuntimeModules(options) {
  if (!isFile(RUNTIME_MANIFEST_PATH)) {
    throw new Error('缺少 runtime manifest: ' + normalizeSlashes(path.relative(PROJECT_ROOT, RUNTIME_MANIFEST_PATH)));
  }

  const manifestEntries = JSON.parse(fs.readFileSync(RUNTIME_MANIFEST_PATH, 'utf8'));
  if (!Array.isArray(manifestEntries) || manifestEntries.length === 0) {
    throw new Error('runtime manifest 为空或格式不正确');
  }

  ensureDirectory(options.outputAbsolute, options.dryRun);

  const usedTargetPaths = new Set();
  const moduleMap = [];
  let copiedCount = 0;
  let unwrappedCount = 0;
  let untouchedCount = 0;

  for (const entry of manifestEntries) {
    const moduleId = String(entry.moduleId || '').trim();
    const filename = String(entry.filename || '').trim();
    const runtimeModuleId = String(entry.runtimeModuleId || '').trim();

    if (moduleId.length === 0 || filename.length === 0) {
      continue;
    }

    const sourcePath = path.join(RUNTIME_MODULE_DIR, filename);
    if (!isFile(sourcePath)) {
      throw new Error('runtime 模块缺失: ' + normalizeSlashes(path.relative(PROJECT_ROOT, sourcePath)));
    }

    const targetPath = resolveRuntimeTargetPath(moduleId, options.outputAbsolute, usedTargetPaths);
    usedTargetPaths.add(normalizeSlashes(targetPath).toLowerCase());

    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    const unwrapResult = unwrapDefineWrapper(sourceContent, runtimeModuleId || 'runtime/gamejs-modules/' + moduleId);

    if (unwrapResult.unwrapped) {
      unwrappedCount += 1;
    } else {
      untouchedCount += 1;
    }

    if (!options.dryRun) {
      ensureDirectory(path.dirname(targetPath), false);
      fs.writeFileSync(targetPath, unwrapResult.content, 'utf8');
    }

    copiedCount += 1;
    moduleMap.push({
      moduleId: moduleId,
      runtimeModuleId: runtimeModuleId,
      source: normalizeSlashes(path.relative(PROJECT_ROOT, sourcePath)),
      target: normalizeSlashes(path.relative(PROJECT_ROOT, targetPath)),
      unwrapped: unwrapResult.unwrapped
    });
  }

  return {
    totalManifestEntries: manifestEntries.length,
    generatedModules: copiedCount,
    unwrappedDefineModules: unwrappedCount,
    keptRawModules: untouchedCount,
    moduleMap: moduleMap,
    sample: moduleMap.slice(0, 20)
  };
}

function resolveRuntimeTargetPath(moduleId, outputRoot, usedTargetPaths) {
  const normalized = normalizeModuleIdToPath(moduleId);
  const parsed = path.parse(normalized);
  const hasExtension = parsed.ext.length > 0;
  const baseRelative = hasExtension ? normalized : normalized + '.js';

  let candidate = path.join(outputRoot, baseRelative);
  let suffix = 2;
  while (usedTargetPaths.has(normalizeSlashes(candidate).toLowerCase())) {
    const nextName = parsed.name + '__dup' + suffix + (hasExtension ? parsed.ext : '.js');
    candidate = path.join(outputRoot, parsed.dir, nextName);
    suffix += 1;
  }
  return candidate;
}

function normalizeModuleIdToPath(moduleId) {
  let normalized = String(moduleId || '').replace(/\\/g, '/').replace(/^\/+/, '');
  normalized = normalized.replace(/\.\.(\/|$)/g, '__up__$1');
  return normalized;
}

function unwrapDefineWrapper(content, runtimeModuleId) {
  const moduleIdPattern = escapeRegExp(String(runtimeModuleId || ''));
  const defineHeader = new RegExp(
    'define\\(\\s*["\\\']' + moduleIdPattern + '["\\\']\\s*,\\s*function\\s*\\(\\s*require\\s*,\\s*module\\s*,\\s*exports\\s*\\)\\s*\\{'
  );
  const headerMatch = defineHeader.exec(content);

  if (!headerMatch) {
    return {
      unwrapped: false,
      content: content
    };
  }

  const bodyStart = headerMatch.index + headerMatch[0].length;
  const wrapperEnd = content.lastIndexOf('});');
  if (wrapperEnd <= bodyStart) {
    return {
      unwrapped: false,
      content: content
    };
  }

  const prefix = content.slice(0, headerMatch.index).trimEnd();
  const body = content.slice(bodyStart, wrapperEnd).replace(/^\s*\n/, '').replace(/\n\s*$/, '\n');

  let output = '';
  if (prefix.length > 0) {
    output += prefix + '\n';
  }
  output += body;
  if (!output.endsWith('\n')) {
    output += '\n';
  }

  return {
    unwrapped: true,
    content: output
  };
}

function writeReadme(outputAbsolute, report, runtimeResult) {
  const readmePath = path.join(outputAbsolute, 'README.md');
  const lines = [
    '# Reconstructed Maintainable Project',
    '',
    '- Generated at: `' + report.generatedAt + '`',
    '- Source repo: `' + normalizeSlashes(PROJECT_ROOT) + '`',
    '',
    '## Structure',
    '',
    '- `assets-restored/`: Restored assets tree from hashed bundle layout.',
    '- `source/runtime-modules/`: Runtime JS modules reconstructed by moduleId path.',
    '- `reports/reconstruction-report.json`: Full reconstruction summary.',
    '- `reports/runtime-module-map.json`: Module source->target mapping.',
    '',
    '## Runtime Rebuild Summary',
    '',
    '- totalManifestEntries: ' + runtimeResult.totalManifestEntries,
    '- generatedModules: ' + runtimeResult.generatedModules,
    '- unwrappedDefineModules: ' + runtimeResult.unwrappedDefineModules,
    '- keptRawModules: ' + runtimeResult.keptRawModules,
    '',
    '## Notes',
    '',
    '- This output is reconstructed from wxPKG-unpacked build artifacts.',
    '- It is designed for maintainability and refactoring, not guaranteed to be an exact original Cocos Creator source project.'
  ];

  fs.writeFileSync(readmePath, lines.join('\n') + '\n', 'utf8');
}

function parseInlineJson(stdoutText, marker) {
  const text = String(stdoutText || '');
  const markerIndex = text.indexOf(marker);
  if (markerIndex < 0) {
    return null;
  }

  const jsonStart = text.indexOf('{', markerIndex);
  if (jsonStart < 0) {
    return null;
  }

  let depth = 0;
  let jsonEnd = -1;
  for (let index = jsonStart; index < text.length; index += 1) {
    const char = text[index];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        jsonEnd = index;
        break;
      }
    }
  }

  if (jsonEnd < 0) {
    return null;
  }

  const jsonText = text.slice(jsonStart, jsonEnd + 1);
  try {
    return JSON.parse(jsonText);
  } catch (_error) {
    return null;
  }
}

function tailLines(text, lineCount) {
  const lines = String(text || '').trim().split(/\r?\n/);
  if (lines.length <= lineCount) {
    return lines;
  }
  return lines.slice(lines.length - lineCount);
}

function printSummary(report, runtimeResult) {
  console.log('[reconstruct-maintainable-project] summary');
  console.log(
    JSON.stringify(
      {
        dryRun: report.dryRun,
        output: report.output,
        assetsRestore: report.assetsRestore.summary,
        runtimeModules: {
          totalManifestEntries: runtimeResult.totalManifestEntries,
          generatedModules: runtimeResult.generatedModules,
          unwrappedDefineModules: runtimeResult.unwrappedDefineModules,
          keptRawModules: runtimeResult.keptRawModules
        }
      },
      null,
      2
    )
  );

  if (runtimeResult.sample.length > 0) {
    console.log('[reconstruct-maintainable-project] runtime samples');
    for (const item of runtimeResult.sample) {
      console.log('- ' + item.source + ' -> ' + item.target + (item.unwrapped ? ' (unwrapped)' : ''));
    }
  }
}

function ensureDirectory(targetPath, dryRun) {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(targetPath, { recursive: true });
}

function normalizeSlashes(input) {
  return String(input || '').replace(/\\/g, '/');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isFile(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
}

main();
