'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const TARGET_RULES = Object.freeze([
  {
    relativePath: 'architecture/tools/generate-asset-readability-audit.js',
    checks: [
      {
        label: 'generatedAt 动态时间戳字段',
        pattern: /generatedAt:\s*new Date\(\)\.toISOString\(\)/
      },
      {
        label: 'Markdown 生成时间行',
        pattern: /lines\.push\(\s*['"`]-\s*生成时间：/
      }
    ]
  },
  {
    relativePath: 'architecture/tools/generate-audio-usage-audit.js',
    checks: [
      {
        label: 'generatedAt 动态时间戳字段',
        pattern: /generatedAt:\s*new Date\(\)\.toISOString\(\)/
      },
      {
        label: 'Markdown 生成时间行',
        pattern: /lines\.push\(\s*['"`]-\s*生成时间：/
      }
    ]
  },
  {
    relativePath: 'architecture/tools/generate-bundle-asset-catalog.js',
    checks: [
      {
        label: 'generatedAt 动态时间戳字段',
        pattern: /generatedAt:\s*new Date\(\)\.toISOString\(\)/
      },
      {
        label: 'Markdown 生成时间行',
        pattern: /lines\.push\(\s*['"`]-\s*生成时间：/
      }
    ]
  },
  {
    relativePath: 'architecture/tools/generate-subpackage-structure-audit.js',
    checks: [
      {
        label: 'generatedAt 动态时间戳字段',
        pattern: /generatedAt:\s*new Date\(\)\.toISOString\(\)/
      },
      {
        label: 'Markdown 生成时间行',
        pattern: /lines\.push\(\s*['"`]-\s*生成时间：/
      }
    ]
  },
  {
    relativePath: 'architecture/tools/generate-uuid-asset-report.js',
    checks: [
      {
        label: 'generatedAt 动态时间戳字段',
        pattern: /generatedAt:\s*new Date\(\)\.toISOString\(\)/
      },
      {
        label: 'Markdown 生成时间行',
        pattern: /lines\.push\(\s*['"`]-\s*生成时间：/
      }
    ]
  }
]);

/**
 * 校验审计生成器未重新引入 volatile 时间戳输出。
 */
function checkNoVolatileReportTimestamps() {
  const layout = resolveProjectLayout(__dirname);
  const findings = [];

  for (const targetRule of TARGET_RULES) {
    const absolutePath = resolveProjectFilePath(layout, targetRule.relativePath);
    const content = fs.readFileSync(absolutePath, 'utf8');

    for (const check of targetRule.checks) {
      if (check.pattern.test(content)) {
        findings.push({
          relativePath: targetRule.relativePath,
          label: check.label
        });
      }
    }
  }

  if (findings.length > 0) {
    console.error('[check-no-volatile-report-timestamps] 失败：发现审计生成器重新引入时间戳噪音。');
    for (const finding of findings) {
      console.error(
        '- 文件:',
        formatProjectPathFromWorkspace(layout, finding.relativePath),
        '规则:',
        finding.label
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log('[check-no-volatile-report-timestamps] 通过');
}

checkNoVolatileReportTimestamps();
