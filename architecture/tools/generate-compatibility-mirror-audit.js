'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');
const {
  ROOT_COMPATIBILITY_MIRROR_ALIAS_ENTRIES,
  buildRemapState,
  loadGeneratedRemapManifest,
  resolveRemappedAssetPath
} = require('../../runtime/asset-file-remap');

const COMPATIBILITY_AUDIT_JSON_PATH = 'architecture/docs/compatibility-mirror-audit.json';
const COMPATIBILITY_AUDIT_MARKDOWN_PATH = 'architecture/docs/compatibility-mirror-audit.md';
const MAX_SAMPLE_COUNT = 6;

function generateCompatibilityMirrorAudit() {
  const layout = resolveProjectLayout(__dirname);
  const remapState = buildRemapState(loadGeneratedRemapManifest());
  const mirrorAudits = ROOT_COMPATIBILITY_MIRROR_ALIAS_ENTRIES
    .map(function mapAliasEntry(aliasEntry) {
      return createMirrorAudit(layout, aliasEntry, remapState);
    })
    .filter(Boolean);
  const report = buildAuditReport(layout, mirrorAudits);
  const markdownLines = buildAuditMarkdownLines(report);

  fs.writeFileSync(
    resolveProjectFilePath(layout, COMPATIBILITY_AUDIT_JSON_PATH),
    JSON.stringify(report, null, 2) + '\n'
  );
  fs.writeFileSync(
    resolveProjectFilePath(layout, COMPATIBILITY_AUDIT_MARKDOWN_PATH),
    markdownLines.join('\n') + '\n'
  );

  console.log(
    '[兼容镜像审计] 已生成 Markdown:',
    formatProjectPathFromWorkspace(layout, COMPATIBILITY_AUDIT_MARKDOWN_PATH)
  );
  console.log(
    '[兼容镜像审计] 已生成 JSON:',
    formatProjectPathFromWorkspace(layout, COMPATIBILITY_AUDIT_JSON_PATH)
  );
}

function createMirrorAudit(layout, aliasEntry, remapState) {
  const mirrorDirectoryPath = resolveProjectFilePath(layout, aliasEntry.legacyPrefix.slice(0, -1));
  if (!fs.existsSync(mirrorDirectoryPath)) {
    return null;
  }

  const topLevelFiles = fs.readdirSync(mirrorDirectoryPath)
    .filter(function filterEntry(entryName) {
      return fs.statSync(path.join(mirrorDirectoryPath, entryName)).isFile();
    })
    .sort(function sortEntry(left, right) {
      return left.localeCompare(right);
    });
  const importAudit = createKindAudit(layout, mirrorDirectoryPath, 'import', remapState);
  const nativeAudit = createKindAudit(layout, mirrorDirectoryPath, 'native', remapState);

  return {
    legacyDirectoryPath: normalizePath(path.relative(layout.projectRoot, mirrorDirectoryPath)),
    canonicalPrefix: aliasEntry.canonicalPrefix,
    kind: 'root-bundle-compat-mirror',
    topLevelFiles: topLevelFiles,
    importAudit: importAudit,
    nativeAudit: nativeAudit,
    removableDirectories: [importAudit, nativeAudit]
      .filter(function filterAudit(kindAudit) {
        return kindAudit.exists && kindAudit.unresolvedCount === 0;
      })
      .map(function mapAudit(kindAudit) {
        return kindAudit.directoryPath;
      })
  };
}

function createKindAudit(layout, mirrorDirectoryPath, kind, remapState) {
  const kindDirectoryPath = path.join(mirrorDirectoryPath, kind);
  const relativeDirectoryPath = normalizePath(path.relative(layout.projectRoot, kindDirectoryPath));
  if (!fs.existsSync(kindDirectoryPath)) {
    return {
      directoryPath: relativeDirectoryPath,
      exists: false,
      fileCount: 0,
      sizeBytes: 0,
      unresolvedCount: 0,
      unresolvedSamples: [],
      resolvedTargetSamples: []
    };
  }

  const filePaths = collectFiles(kindDirectoryPath);
  const unresolvedSamples = [];
  const resolvedTargetSamples = [];
  let sizeBytes = 0;
  let unresolvedCount = 0;

  for (const filePath of filePaths) {
    const relativeFilePath = normalizePath(path.relative(layout.projectRoot, filePath));
    const remappedPath = normalizePath(resolveRemappedAssetPath(relativeFilePath, remapState));
    const remappedAbsolutePath = resolveProjectFilePath(layout, remappedPath);
    const fileSize = fs.statSync(filePath).size;
    sizeBytes += fileSize;

    if (!remappedPath || remappedPath === relativeFilePath || !fs.existsSync(remappedAbsolutePath)) {
      unresolvedCount += 1;
      if (unresolvedSamples.length < MAX_SAMPLE_COUNT) {
        unresolvedSamples.push({
          sourcePath: relativeFilePath,
          remappedPath: remappedPath
        });
      }
      continue;
    }

    if (resolvedTargetSamples.length < MAX_SAMPLE_COUNT) {
      resolvedTargetSamples.push({
        sourcePath: relativeFilePath,
        targetPath: remappedPath
      });
    }
  }

  return {
    directoryPath: relativeDirectoryPath,
    exists: true,
    fileCount: filePaths.length,
    sizeBytes: sizeBytes,
    unresolvedCount: unresolvedCount,
    unresolvedSamples: unresolvedSamples,
    resolvedTargetSamples: resolvedTargetSamples
  };
}

function collectFiles(directoryPath) {
  const filePaths = [];
  const stack = [directoryPath];

  while (stack.length > 0) {
    const currentPath = stack.pop();
    const entryNames = fs.readdirSync(currentPath);

    for (const entryName of entryNames) {
      const targetPath = path.join(currentPath, entryName);
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        stack.push(targetPath);
        continue;
      }
      filePaths.push(targetPath);
    }
  }

  return filePaths.sort(function sortPath(left, right) {
    return left.localeCompare(right);
  });
}

function buildAuditReport(layout, mirrorAudits) {
  return {
    projectPath: formatProjectPathFromWorkspace(layout, ''),
    summary: {
      totalMirrorDirectories: mirrorAudits.length,
      totalImportFiles: sumByKind(mirrorAudits, 'importAudit', 'fileCount'),
      totalNativeFiles: sumByKind(mirrorAudits, 'nativeAudit', 'fileCount'),
      totalImportBytes: sumByKind(mirrorAudits, 'importAudit', 'sizeBytes'),
      totalNativeBytes: sumByKind(mirrorAudits, 'nativeAudit', 'sizeBytes'),
      totalUnresolvedFiles: sumByKind(mirrorAudits, 'importAudit', 'unresolvedCount')
        + sumByKind(mirrorAudits, 'nativeAudit', 'unresolvedCount')
    },
    cleanupDecision: {
      canPruneCompatibilityMirrorAssetDirectories: mirrorAudits.every(function everyMirrorAudit(mirrorAudit) {
        return mirrorAudit.importAudit.unresolvedCount === 0 && mirrorAudit.nativeAudit.unresolvedCount === 0;
      }),
      note: '当前仅审计 root 兼容镜像目录。若 import/native 文件全部可重定向到 canonical 目录，可继续收缩到只保留 config/index 的薄壳。'
    },
    mirrors: mirrorAudits
  };
}

function sumByKind(mirrorAudits, kindField, valueField) {
  return mirrorAudits.reduce(function reduceTotal(total, mirrorAudit) {
    const kindAudit = mirrorAudit && mirrorAudit[kindField];
    return total + Number(kindAudit && kindAudit[valueField] ? kindAudit[valueField] : 0);
  }, 0);
}

function buildAuditMarkdownLines(report) {
  const lines = [];
  lines.push('# 兼容镜像审计（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-compatibility-mirror-audit.js` 生成。');
  lines.push('');
  lines.push('## 结论');
  lines.push('');
  lines.push('- 当前仅保留 root 兼容镜像目录：`assets/internalbundle`、`assets/start-scenebundle`。');
  lines.push('- 若 `import/native` 文件都能通过运行时重定向落到 canonical 目录，则镜像目录可以继续收缩为“只保留 config/index 的薄壳目录”。');
  lines.push('- 本次检查结果：`unresolved files = ' + report.summary.totalUnresolvedFiles + '`。');
  lines.push('');
  lines.push('## 汇总');
  lines.push('');
  lines.push('| 项目 | 数量 |');
  lines.push('| --- | ---: |');
  lines.push('| 兼容镜像目录数 | ' + report.summary.totalMirrorDirectories + ' |');
  lines.push('| import 镜像文件数 | ' + report.summary.totalImportFiles + ' |');
  lines.push('| native 镜像文件数 | ' + report.summary.totalNativeFiles + ' |');
  lines.push('| import 镜像体积（bytes） | ' + report.summary.totalImportBytes + ' |');
  lines.push('| native 镜像体积（bytes） | ' + report.summary.totalNativeBytes + ' |');
  lines.push('| 未覆盖文件数 | ' + report.summary.totalUnresolvedFiles + ' |');
  lines.push('');
  lines.push('## 目录明细');
  lines.push('');

  for (const mirrorAudit of report.mirrors) {
    lines.push('### ' + mirrorAudit.legacyDirectoryPath);
    lines.push('');
    lines.push('- 类型：' + mirrorAudit.kind);
    lines.push('- canonical 前缀：`' + mirrorAudit.canonicalPrefix + '`');
    lines.push('- 保留顶层文件：' + formatStringList(mirrorAudit.topLevelFiles));
    lines.push('- import 目录：' + formatKindSummary(mirrorAudit.importAudit));
    lines.push('- import 目标样例：' + formatResolvedSamples(mirrorAudit.importAudit.resolvedTargetSamples));
    lines.push('- import 未覆盖样例：' + formatUnresolvedSamples(mirrorAudit.importAudit.unresolvedSamples));
    lines.push('- native 目录：' + formatKindSummary(mirrorAudit.nativeAudit));
    lines.push('- native 目标样例：' + formatResolvedSamples(mirrorAudit.nativeAudit.resolvedTargetSamples));
    lines.push('- native 未覆盖样例：' + formatUnresolvedSamples(mirrorAudit.nativeAudit.unresolvedSamples));
    lines.push('- 可删目录：' + formatStringList(mirrorAudit.removableDirectories));
    lines.push('');
  }

  return lines;
}

function formatKindSummary(kindAudit) {
  if (!kindAudit.exists) {
    return '不存在';
  }

  return '`' + kindAudit.directoryPath + '`，files=' + kindAudit.fileCount + '，bytes=' + kindAudit.sizeBytes + '，unresolved=' + kindAudit.unresolvedCount;
}

function formatStringList(values) {
  const entries = Array.isArray(values) ? values : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapEntry(entry) {
    return '`' + entry + '`';
  }).join('，');
}

function formatResolvedSamples(samples) {
  const entries = Array.isArray(samples) ? samples : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapSample(sample) {
    return '`' + sample.sourcePath + '` -> `' + sample.targetPath + '`';
  }).join('；');
}

function formatUnresolvedSamples(samples) {
  const entries = Array.isArray(samples) ? samples : [];
  if (entries.length === 0) {
    return '无';
  }

  return entries.map(function mapSample(sample) {
    return '`' + sample.sourcePath + '` -> `' + sample.remappedPath + '`';
  }).join('；');
}

generateCompatibilityMirrorAudit();
