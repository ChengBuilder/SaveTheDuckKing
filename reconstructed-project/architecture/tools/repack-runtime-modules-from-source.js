'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const RUNTIME_DIR = path.join(PROJECT_ROOT, 'runtime', 'gamejs-modules');
const DEFAULT_MANIFEST = path.join(RUNTIME_DIR, 'manifest.json');
const DEFAULT_SOURCE_ROOT = path.join(PROJECT_ROOT, 'source-project', 'runtime-modules');

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = isTruthy(args['dry-run']);
  const strict = !isFalsey(args.strict);

  const manifestPath = resolvePath(args.manifest, DEFAULT_MANIFEST);
  const sourceRoot = resolvePath(args['source-root'], DEFAULT_SOURCE_ROOT);

  if (!isFile(manifestPath)) {
    throw new Error('manifest 不存在: ' + rel(manifestPath));
  }
  if (!isDirectory(sourceRoot)) {
    throw new Error('source-root 不存在: ' + rel(sourceRoot));
  }

  const entries = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('manifest 格式错误或为空');
  }

  const result = repack(entries, {
    dryRun: dryRun,
    strict: strict,
    sourceRoot: sourceRoot
  });

  printSummary(result, {
    dryRun: dryRun,
    strict: strict,
    sourceRoot: sourceRoot,
    manifestPath: manifestPath
  });

  if (strict && result.missing.length > 0) {
    process.exitCode = 2;
  }
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

function isFalsey(value) {
  return value === false || value === 'false' || value === '0';
}

function resolvePath(input, fallbackAbsolutePath) {
  if (!input) {
    return fallbackAbsolutePath;
  }
  return path.resolve(PROJECT_ROOT, String(input));
}

function repack(entries, options) {
  const dryRun = options.dryRun;
  const strict = options.strict;
  const sourceRoot = options.sourceRoot;

  const missing = [];
  const rewritten = [];
  const unchanged = [];
  const passthrough = [];

  for (const entry of entries) {
    const moduleId = String(entry.moduleId || '').trim();
    const runtimeModuleId = String(entry.runtimeModuleId || '').trim();
    const filename = String(entry.filename || '').trim();

    if (moduleId.length === 0 || filename.length === 0) {
      continue;
    }

    const sourcePath = path.join(sourceRoot, toModulePath(moduleId));
    const targetPath = path.join(RUNTIME_DIR, filename);

    if (!isFile(sourcePath)) {
      const item = {
        moduleId: moduleId,
        source: rel(sourcePath),
        target: rel(targetPath)
      };
      missing.push(item);
      if (strict) {
        continue;
      }
      if (!isFile(targetPath)) {
        continue;
      }
      unchanged.push({
        moduleId: moduleId,
        source: null,
        target: rel(targetPath),
        reason: 'source-missing-keep-target'
      });
      continue;
    }

    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    const outputContent = wrapSourceIfNeeded(sourceContent, runtimeModuleId, rel(sourcePath));
    const originalContent = isFile(targetPath) ? fs.readFileSync(targetPath, 'utf8') : null;

    if (originalContent === outputContent) {
      unchanged.push({
        moduleId: moduleId,
        source: rel(sourcePath),
        target: rel(targetPath),
        reason: 'content-equal'
      });
      continue;
    }

    if (!dryRun) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, outputContent, 'utf8');
    }

    rewritten.push({
      moduleId: moduleId,
      source: rel(sourcePath),
      target: rel(targetPath)
    });

    if (sourceContentIncludesDefineForRuntime(sourceContent, runtimeModuleId)) {
      passthrough.push({
        moduleId: moduleId,
        source: rel(sourcePath),
        target: rel(targetPath)
      });
    }
  }

  return {
    totalEntries: entries.length,
    rewritten: rewritten,
    unchanged: unchanged,
    passthrough: passthrough,
    missing: missing
  };
}

function sourceContentIncludesDefineForRuntime(sourceContent, runtimeModuleId) {
  const escapedRuntimeModuleId = escapeRegExp(runtimeModuleId || '');
  if (escapedRuntimeModuleId.length === 0) {
    return false;
  }
  const definePattern = new RegExp('define\\(\\s*["\\\']' + escapedRuntimeModuleId + '["\\\']\\s*,');
  return definePattern.test(sourceContent);
}

function wrapSourceIfNeeded(sourceContent, runtimeModuleId, sourceRelativePath) {
  if (sourceContentIncludesDefineForRuntime(sourceContent, runtimeModuleId)) {
    return ensureTrailingNewline(sourceContent);
  }

  const body = ensureTrailingNewline(sourceContent)
    .split('\n')
    .map(function indent(line) {
      if (line.length === 0) {
        return '';
      }
      return '  ' + line;
    })
    .join('\n');

  const lines = [
    '"use strict";',
    '',
    '// Repacked by architecture/tools/repack-runtime-modules-from-source.js',
    '// Source: ' + sourceRelativePath,
    'define("' + runtimeModuleId + '", function (require, module, exports) {',
    body,
    '});',
    ''
  ];

  return lines.join('\n');
}

function toModulePath(moduleId) {
  const normalized = String(moduleId || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const parsed = path.parse(normalized);
  if (parsed.ext.length > 0) {
    return normalized;
  }
  return normalized + '.js';
}

function ensureTrailingNewline(content) {
  const text = String(content || '');
  if (text.endsWith('\n')) {
    return text;
  }
  return text + '\n';
}

function printSummary(result, options) {
  console.log('[repack-runtime-modules-from-source] summary');
  console.log(
    JSON.stringify(
      {
        dryRun: options.dryRun,
        strict: options.strict,
        manifest: rel(options.manifestPath),
        sourceRoot: rel(options.sourceRoot),
        totalEntries: result.totalEntries,
        rewrittenCount: result.rewritten.length,
        unchangedCount: result.unchanged.length,
        passthroughCount: result.passthrough.length,
        missingCount: result.missing.length
      },
      null,
      2
    )
  );

  if (result.rewritten.length > 0) {
    console.log('[repack-runtime-modules-from-source] rewritten samples');
    for (const item of result.rewritten.slice(0, 20)) {
      console.log('- ' + item.source + ' -> ' + item.target);
    }
  }

  if (result.missing.length > 0) {
    console.log('[repack-runtime-modules-from-source] missing samples');
    for (const item of result.missing.slice(0, 20)) {
      console.log('- ' + item.moduleId + ' | source: ' + item.source + ' | target: ' + item.target);
    }
  }
}

function rel(absolutePath) {
  return path.relative(PROJECT_ROOT, absolutePath).replace(/\\/g, '/');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isFile(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
}

function isDirectory(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

main();
