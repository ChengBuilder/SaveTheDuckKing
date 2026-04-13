'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const RUNTIME_DIR = path.join(PROJECT_ROOT, 'runtime', 'gamejs-modules');
const DEFAULT_MANIFEST = path.join(RUNTIME_DIR, 'manifest.json');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'source-project', 'runtime-modules');
const DEFAULT_REPORT_DIR = path.join(PROJECT_ROOT, 'source-project', 'reports');

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = isTruthy(args['dry-run']);
  const clean = isTruthy(args.clean);

  const manifestPath = resolvePath(args.manifest, DEFAULT_MANIFEST);
  const outputDir = resolvePath(args.output, DEFAULT_OUTPUT_DIR);
  const reportDir = resolvePath(args['report-dir'], DEFAULT_REPORT_DIR);

  if (!isFile(manifestPath)) {
    throw new Error('manifest 不存在: ' + rel(manifestPath));
  }

  const entries = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('manifest 格式错误或为空');
  }

  if (clean && !dryRun && fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  const migration = migrate(entries, {
    outputDir: outputDir,
    dryRun: dryRun
  });

  if (!dryRun) {
    fs.mkdirSync(reportDir, { recursive: true });
    const migrationMapPath = path.join(reportDir, 'runtime-migration-map.json');
    const summaryPath = path.join(reportDir, 'runtime-migration-summary.json');

    fs.writeFileSync(migrationMapPath, JSON.stringify(migration.moduleMap, null, 2) + '\n', 'utf8');
    fs.writeFileSync(
      summaryPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          manifest: rel(manifestPath),
          output: rel(outputDir),
          totalEntries: migration.totalEntries,
          convertedCount: migration.convertedCount,
          passthroughCount: migration.passthroughCount,
          missingSourceCount: migration.missingSource.length,
          collisionCount: migration.collisions.length,
          missingSource: migration.missingSource,
          collisions: migration.collisions
        },
        null,
        2
      ) + '\n',
      'utf8'
    );

    writeSourceProjectReadme(path.dirname(outputDir), {
      manifestPath: manifestPath,
      outputDir: outputDir,
      totalEntries: migration.totalEntries,
      convertedCount: migration.convertedCount,
      passthroughCount: migration.passthroughCount
    });
  }

  printSummary(migration, {
    dryRun: dryRun,
    clean: clean,
    manifestPath: manifestPath,
    outputDir: outputDir,
    reportDir: reportDir
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

function resolvePath(inputPath, fallbackPath) {
  if (!inputPath) {
    return fallbackPath;
  }
  return path.resolve(PROJECT_ROOT, String(inputPath));
}

function migrate(entries, options) {
  const dryRun = options.dryRun;
  const outputDir = options.outputDir;

  const usedTargets = new Set();
  const moduleMap = [];
  const missingSource = [];
  const collisions = [];

  let convertedCount = 0;
  let passthroughCount = 0;

  for (const entry of entries) {
    const moduleId = String(entry.moduleId || '').trim();
    const runtimeModuleId = String(entry.runtimeModuleId || '').trim();
    const filename = String(entry.filename || '').trim();

    if (moduleId.length === 0 || filename.length === 0) {
      continue;
    }

    const runtimeFilePath = path.join(RUNTIME_DIR, filename);
    if (!isFile(runtimeFilePath)) {
      missingSource.push({
        moduleId: moduleId,
        runtimeModuleId: runtimeModuleId,
        source: rel(runtimeFilePath)
      });
      continue;
    }

    const plannedTarget = path.join(outputDir, toModulePath(moduleId));
    const targetPath = resolveCollisionSafePath(plannedTarget, usedTargets);
    if (targetPath !== plannedTarget) {
      collisions.push({
        moduleId: moduleId,
        originalTarget: rel(plannedTarget),
        resolvedTarget: rel(targetPath)
      });
    }

    const sourceContent = fs.readFileSync(runtimeFilePath, 'utf8');
    const unwrap = unwrapDefineWrapper(sourceContent, runtimeModuleId || 'runtime/gamejs-modules/' + moduleId);

    if (unwrap.unwrapped) {
      convertedCount += 1;
    } else {
      passthroughCount += 1;
    }

    if (!dryRun) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, unwrap.content, 'utf8');
    }

    moduleMap.push({
      moduleId: moduleId,
      runtimeModuleId: runtimeModuleId,
      source: rel(runtimeFilePath),
      target: rel(targetPath),
      unwrapped: unwrap.unwrapped
    });
  }

  return {
    totalEntries: entries.length,
    convertedCount: convertedCount,
    passthroughCount: passthroughCount,
    missingSource: missingSource,
    collisions: collisions,
    moduleMap: moduleMap
  };
}

function resolveCollisionSafePath(initialPath, usedTargets) {
  const normalize = function (targetPath) {
    return normalizeSlashes(targetPath).toLowerCase();
  };

  if (!usedTargets.has(normalize(initialPath))) {
    usedTargets.add(normalize(initialPath));
    return initialPath;
  }

  const parsed = path.parse(initialPath);
  let index = 2;
  while (true) {
    const candidate = path.join(parsed.dir, parsed.name + '__dup' + index + parsed.ext);
    if (!usedTargets.has(normalize(candidate))) {
      usedTargets.add(normalize(candidate));
      return candidate;
    }
    index += 1;
  }
}

function unwrapDefineWrapper(content, runtimeModuleId) {
  const runtimePattern = escapeRegExp(String(runtimeModuleId || ''));
  const headerRegex = new RegExp(
    'define\\(\\s*["\\\']' + runtimePattern + '["\\\']\\s*,\\s*function\\s*\\(\\s*require\\s*,\\s*module\\s*,\\s*exports\\s*\\)\\s*\\{'
  );
  const headerMatch = headerRegex.exec(content);

  if (!headerMatch) {
    return {
      unwrapped: false,
      content: normalizeExtractedSource(content)
    };
  }

  const bodyStart = headerMatch.index + headerMatch[0].length;
  const bodyEnd = content.lastIndexOf('});');
  if (bodyEnd <= bodyStart) {
    return {
      unwrapped: false,
      content: normalizeExtractedSource(content)
    };
  }

  return {
    unwrapped: true,
    content: normalizeExtractedSource(content.slice(bodyStart, bodyEnd))
  };
}

function normalizeExtractedSource(rawContent) {
  let text = ensureTrailingNewline(String(rawContent || ''));
  text = dedentCommonIndent(text);
  let lines = text.split('\n');

  lines = lines.filter(function (line) {
    const trimmed = line.trim();
    if (/^\/\/\s*Repacked by architecture\/tools\/repack-runtime-modules-from-source\.js$/.test(trimmed)) {
      return false;
    }
    if (/^\/\/\s*Source:\s+/.test(trimmed)) {
      return false;
    }
    return true;
  });

  while (lines.length > 0 && lines[0].trim().length === 0) {
    lines.shift();
  }

  // 顶部仅保留一个 use strict，避免多轮封装后重复。
  const normalized = [];
  let strictCaptured = false;
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!strictCaptured && trimmed.length === 0 && normalized.length === 0) {
      index += 1;
      continue;
    }
    if (trimmed === '"use strict";') {
      if (strictCaptured) {
        index += 1;
        continue;
      }
      strictCaptured = true;
      normalized.push('"use strict";');
      index += 1;
      continue;
    }
    normalized.push(line);
    index += 1;
  }

  const compact = normalized.join('\n').replace(/\n{3,}/g, '\n\n');
  return ensureTrailingNewline(compact);
}

function dedentCommonIndent(text) {
  const lines = String(text || '').split('\n');
  let minIndent = null;

  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }
    const match = /^(\s*)/.exec(line);
    const indent = match ? match[1].length : 0;
    if (minIndent == null || indent < minIndent) {
      minIndent = indent;
    }
  }

  if (!minIndent || minIndent <= 0) {
    return lines.join('\n');
  }

  return lines
    .map(function (line) {
      if (line.trim().length === 0) {
        return '';
      }
      return line.slice(minIndent);
    })
    .join('\n');
}

function toModulePath(moduleId) {
  const normalized = String(moduleId || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\.\.(\/|$)/g, '__up__$1');

  const parsed = path.parse(normalized);
  if (parsed.ext.length > 0) {
    return normalized;
  }
  return normalized + '.js';
}

function writeSourceProjectReadme(sourceProjectRoot, context) {
  const readmePath = path.join(sourceProjectRoot, 'README.md');
  const lines = [
    '# Source Project (Maintainable)',
    '',
    '该目录作为可维护源码主编辑区，不直接改 `runtime/gamejs-modules`。',
    '',
    '## Workflow',
    '',
    '1. 修改 `runtime-modules/` 内源码。',
    '2. 执行 `npm run runtime:repack-from-source` 回封装到运行目录。',
    '3. 执行 `npm run guardrails` 校验完整性。',
    '',
    '## Snapshot',
    '',
    '- Manifest: `' + rel(context.manifestPath) + '`',
    '- Runtime Source Output: `' + rel(context.outputDir) + '`',
    '- Total Modules: ' + context.totalEntries,
    '- Unwrapped Modules: ' + context.convertedCount,
    '- Passthrough Modules: ' + context.passthroughCount,
    ''
  ];

  fs.writeFileSync(readmePath, lines.join('\n'), 'utf8');
}

function printSummary(result, options) {
  console.log('[migrate-runtime-to-source-project] summary');
  console.log(
    JSON.stringify(
      {
        dryRun: options.dryRun,
        clean: options.clean,
        manifest: rel(options.manifestPath),
        output: rel(options.outputDir),
        reportDir: rel(options.reportDir),
        totalEntries: result.totalEntries,
        convertedCount: result.convertedCount,
        passthroughCount: result.passthroughCount,
        missingSourceCount: result.missingSource.length,
        collisionCount: result.collisions.length
      },
      null,
      2
    )
  );

  if (result.moduleMap.length > 0) {
    console.log('[migrate-runtime-to-source-project] samples');
    for (const item of result.moduleMap.slice(0, 20)) {
      console.log('- ' + item.source + ' -> ' + item.target + (item.unwrapped ? ' (unwrapped)' : ''));
    }
  }

  if (result.missingSource.length > 0) {
    console.log('[migrate-runtime-to-source-project] missing source samples');
    for (const item of result.missingSource.slice(0, 20)) {
      console.log('- ' + item.moduleId + ' -> ' + item.source);
    }
  }
}

function ensureTrailingNewline(content) {
  const text = String(content || '');
  if (text.endsWith('\n')) {
    return text;
  }
  return text + '\n';
}

function normalizeSlashes(value) {
  return String(value).replace(/\\/g, '/');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rel(targetPath) {
  return path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/');
}

function isFile(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
}

main();
