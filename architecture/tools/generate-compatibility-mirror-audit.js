'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
} = require('./project-paths');

const COMPATIBILITY_AUDIT_JSON_PATH = 'architecture/docs/compatibility-mirror-audit.json';
const COMPATIBILITY_AUDIT_MARKDOWN_PATH = 'architecture/docs/compatibility-mirror-audit.md';

function generateCompatibilityMirrorAudit() {
  const layout = resolveProjectLayout(__dirname);
  const report = {
    projectPath: formatProjectPathFromWorkspace(layout, ''),
    mode: 'no-remap',
    summary: {
      totalMirrorDirectories: 0,
      totalImportFiles: 0,
      totalNativeFiles: 0,
      totalImportBytes: 0,
      totalNativeBytes: 0,
      totalUnresolvedFiles: 0,
    },
    cleanupDecision: {
      canPruneCompatibilityMirrorAssetDirectories: true,
      note: '运行时 remap 已彻底移除，兼容镜像审计不再生效。',
    },
    mirrors: [],
  };
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

function buildAuditMarkdownLines(report) {
  return [
    '# 兼容镜像审计（自动生成）',
    '',
    '> 本文件由 `architecture/tools/generate-compatibility-mirror-audit.js` 生成。',
    '',
    '## 结论',
    '',
    '- 运行时 remap 已移除，兼容镜像目录的重定向审计已停用。',
    '- 后续建议直接删除旧镜像目录与对应兼容层代码，不再做路径映射兼容。',
    '',
    '## 汇总',
    '',
    '| 项目 | 数量 |',
    '| --- | ---: |',
    '| 兼容镜像目录数 | ' + report.summary.totalMirrorDirectories + ' |',
    '| import 镜像文件数 | ' + report.summary.totalImportFiles + ' |',
    '| native 镜像文件数 | ' + report.summary.totalNativeFiles + ' |',
    '| 未覆盖文件数 | ' + report.summary.totalUnresolvedFiles + ' |',
  ];
}

generateCompatibilityMirrorAudit();
