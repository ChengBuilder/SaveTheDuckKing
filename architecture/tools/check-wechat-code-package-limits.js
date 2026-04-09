'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');

const BYTES_PER_MB = 1024 * 1024;
const MAIN_PACKAGE_LIMIT_BYTES = 4 * BYTES_PER_MB;
const TOTAL_PACKAGE_LIMIT_BYTES = 30 * BYTES_PER_MB;
const INDEPENDENT_SUBPACKAGE_LIMIT_BYTES = 4 * BYTES_PER_MB;
const REPORT_JSON_RELATIVE_PATH = 'architecture/docs/wechat-code-package-report.json';
const REPORT_MARKDOWN_RELATIVE_PATH = 'architecture/docs/wechat-code-package-report.md';
const DEFAULT_MAIN_PACKAGE_ENTRIES = Object.freeze([
  'game.js',
  'game.json',
  'app-config.json',
  'assets',
  'cocos-js',
  'runtime',
  'src',
  'architecture/boot'
]);
const OFFICIAL_SOURCE_URLS = Object.freeze([
  'https://developers.weixin.qq.com/minigame/dev/guide/base-ability/code-package.html',
  'https://developers.weixin.qq.com/minigame/dev/guide/base-ability/subPackage/useSubPackage.html',
  'https://developers.weixin.qq.com/minigame/dev/guide/base-ability/workers.html'
]);

function main() {
  const args = process.argv.slice(2);
  const jsonOnly = args.includes('--json');
  const layout = resolveProjectLayout(__dirname);
  const gameConfig = readJson(layout, 'game.json');
  const report = buildCodePackageReport(layout, gameConfig);

  writeReportFiles(layout, report);

  if (jsonOnly) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanSummary(layout, report);
  }

  if (report.violations.length > 0) {
    process.exitCode = 1;
  }
}

function buildCodePackageReport(layout, gameConfig) {
  const generatedAt = new Date().toISOString();
  const subpackages = resolveSubpackages(gameConfig);
  const mainEntryPaths = collectMainPackageEntries(gameConfig);
  const mainPackage = summarizePackage(layout, {
    key: '__GAME__',
    label: '主包',
    limitBytes: MAIN_PACKAGE_LIMIT_BYTES,
    category: 'main',
    entryPaths: mainEntryPaths,
    independent: false
  });
  const subpackageReports = subpackages.map(function mapSubpackage(subpackage) {
    return summarizePackage(layout, {
      key: subpackage.name,
      label: subpackage.name,
      limitBytes: subpackage.independent ? INDEPENDENT_SUBPACKAGE_LIMIT_BYTES : null,
      category: subpackage.independent ? 'independent-subpackage' : 'subpackage',
      entryPaths: [subpackage.root],
      independent: Boolean(subpackage.independent)
    });
  });
  const workerPackage = resolveWorkerPackageReport(layout, gameConfig);
  const packageReports = [mainPackage].concat(subpackageReports);
  if (workerPackage) {
    packageReports.push(workerPackage);
  }

  const totalBytes = packageReports.reduce(function sumBytes(total, packageReport) {
    return total + packageReport.sizeBytes;
  }, 0);
  const totalFiles = packageReports.reduce(function sumFiles(total, packageReport) {
    return total + packageReport.fileCount;
  }, 0);
  const violations = collectViolations(packageReports, totalBytes);

  return {
    generatedAt: generatedAt,
    projectPath: layout.projectPathFromWorkspace || './',
    officialSourceUrls: OFFICIAL_SOURCE_URLS,
    notes: [
      '本报告按照当前小游戏运行入口、game.json 分包声明以及 worker 配置统计，用于本地快速护栏。',
      '若需要上传口径的精确包体信息，可结合微信开发者工具 CLI 的 auto-preview/upload --info-output 二次验证。'
    ],
    limits: {
      mainPackageBytes: MAIN_PACKAGE_LIMIT_BYTES,
      totalPackageBytes: TOTAL_PACKAGE_LIMIT_BYTES,
      independentSubpackageBytes: INDEPENDENT_SUBPACKAGE_LIMIT_BYTES
    },
    mainPackage: mainPackage,
    subpackages: subpackageReports,
    workerPackage: workerPackage,
    totals: {
      packageCount: packageReports.length,
      fileCount: totalFiles,
      sizeBytes: totalBytes,
      sizeText: formatBytes(totalBytes),
      limitBytes: TOTAL_PACKAGE_LIMIT_BYTES,
      limitText: formatBytes(TOTAL_PACKAGE_LIMIT_BYTES),
      withinLimit: totalBytes <= TOTAL_PACKAGE_LIMIT_BYTES
    },
    violations: violations
  };
}

function collectMainPackageEntries(gameConfig) {
  const entrySet = new Set(DEFAULT_MAIN_PACKAGE_ENTRIES);
  const workersConfig = gameConfig.workers;

  if (typeof workersConfig === 'string' && workersConfig.trim().length > 0) {
    entrySet.add(trimSlashes(workersConfig));
  } else if (workersConfig && typeof workersConfig === 'object') {
    const workerPath = trimSlashes(workersConfig.path);
    if (workerPath && !workersConfig.isSubpackage) {
      entrySet.add(workerPath);
    }
  }

  return Array.from(entrySet).sort();
}

function resolveWorkerPackageReport(layout, gameConfig) {
  const workersConfig = gameConfig.workers;
  if (!workersConfig || typeof workersConfig !== 'object' || !workersConfig.isSubpackage) {
    return null;
  }

  const workerPath = trimSlashes(workersConfig.path);
  if (!workerPath) {
    throw new Error('game.json.workers.path 为空，但 isSubpackage 已开启。');
  }

  return summarizePackage(layout, {
    key: '__WORKERS__',
    label: 'workers 分包',
    limitBytes: null,
    category: 'worker-subpackage',
    entryPaths: [workerPath],
    independent: false
  });
}

function summarizePackage(layout, packageSpec) {
  const files = collectFiles(layout, packageSpec.entryPaths);
  const sizeBytes = files.reduce(function sumBytes(total, file) {
    return total + file.sizeBytes;
  }, 0);

  return {
    key: packageSpec.key,
    label: packageSpec.label,
    category: packageSpec.category,
    independent: packageSpec.independent,
    entryPaths: packageSpec.entryPaths.map(function mapEntryPath(entryPath) {
      return normalizePath(entryPath);
    }),
    fileCount: files.length,
    sizeBytes: sizeBytes,
    sizeText: formatBytes(sizeBytes),
    limitBytes: packageSpec.limitBytes,
    limitText: packageSpec.limitBytes === null ? null : formatBytes(packageSpec.limitBytes),
    withinLimit: packageSpec.limitBytes === null ? true : sizeBytes <= packageSpec.limitBytes,
    files: files
  };
}

function collectFiles(layout, entryPaths) {
  const fileMap = new Map();

  for (const entryPath of entryPaths) {
    const normalizedEntryPath = trimSlashes(entryPath);
    if (!normalizedEntryPath) {
      continue;
    }

    const absoluteEntryPath = resolveProjectFilePath(layout, normalizedEntryPath);
    if (!fs.existsSync(absoluteEntryPath)) {
      throw new Error('统计包体时缺少路径: ' + formatProjectPathFromWorkspace(layout, normalizedEntryPath));
    }

    const entryStat = fs.statSync(absoluteEntryPath);
    if (entryStat.isFile()) {
      fileMap.set(normalizedEntryPath, buildFileRecord(layout, absoluteEntryPath));
      continue;
    }

    walkDirectory(layout, absoluteEntryPath, fileMap);
  }

  return Array.from(fileMap.values()).sort(function compareFileRecord(left, right) {
    return left.path.localeCompare(right.path);
  });
}

function walkDirectory(layout, directoryPath, fileMap) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    const absoluteEntryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(layout, absoluteEntryPath, fileMap);
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }

    const relativeProjectPath = normalizePath(path.relative(layout.projectRoot, absoluteEntryPath));
    fileMap.set(relativeProjectPath, buildFileRecord(layout, absoluteEntryPath));
  }
}

function buildFileRecord(layout, absoluteFilePath) {
  const relativeProjectPath = normalizePath(path.relative(layout.projectRoot, absoluteFilePath));
  const fileStat = fs.statSync(absoluteFilePath);

  return {
    path: relativeProjectPath,
    displayPath: formatProjectPathFromWorkspace(layout, relativeProjectPath),
    sizeBytes: fileStat.size,
    sizeText: formatBytes(fileStat.size)
  };
}

function collectViolations(packageReports, totalBytes) {
  const violations = [];

  for (const packageReport of packageReports) {
    if (packageReport.limitBytes !== null && packageReport.sizeBytes > packageReport.limitBytes) {
      violations.push(
        packageReport.label + ' 超出上限：' + packageReport.sizeText + ' > ' + packageReport.limitText
      );
    }
  }

  if (totalBytes > TOTAL_PACKAGE_LIMIT_BYTES) {
    violations.push('总包超出上限：' + formatBytes(totalBytes) + ' > ' + formatBytes(TOTAL_PACKAGE_LIMIT_BYTES));
  }

  return violations;
}

function resolveSubpackages(gameConfig) {
  const primaryList = Array.isArray(gameConfig.subpackages) ? gameConfig.subpackages : [];
  const legacyList = Array.isArray(gameConfig.subPackages) ? gameConfig.subPackages : [];
  const effectiveList = primaryList.length > 0 ? primaryList : legacyList;

  return effectiveList.map(function mapSubpackage(subpackage) {
    return {
      name: String(subpackage.name || '').trim(),
      root: trimSlashes(subpackage.root),
      independent: Boolean(subpackage.independent)
    };
  });
}

function writeReportFiles(layout, report) {
  const jsonReportPath = resolveProjectFilePath(layout, REPORT_JSON_RELATIVE_PATH);
  const markdownReportPath = resolveProjectFilePath(layout, REPORT_MARKDOWN_RELATIVE_PATH);

  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  fs.writeFileSync(markdownReportPath, buildMarkdownReport(layout, report).join('\n') + '\n', 'utf8');
}

function buildMarkdownReport(layout, report) {
  const lines = [];

  lines.push('# 微信小游戏代码包体报告');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/check-wechat-code-package-limits.js` 生成。');
  lines.push('');
  lines.push('## 总览');
  lines.push('- 生成时间：' + report.generatedAt);
  lines.push('- 项目目录：`' + report.projectPath + '`');
  lines.push('- 主包：`' + report.mainPackage.sizeText + ' / ' + report.mainPackage.limitText + '`');
  lines.push('- 总包：`' + report.totals.sizeText + ' / ' + report.totals.limitText + '`');
  lines.push('- 违规项：' + (report.violations.length === 0 ? '0' : String(report.violations.length)));
  lines.push('');
  lines.push('## 官方依据');
  for (const sourceUrl of report.officialSourceUrls) {
    lines.push('- ' + sourceUrl);
  }
  lines.push('');
  lines.push('## 包体明细');
  lines.push('| 包 | 类型 | 文件数 | 大小 | 上限 | 状态 |');
  lines.push('| --- | --- | ---: | ---: | ---: | --- |');
  lines.push(renderPackageRow(report.mainPackage));
  for (const subpackage of report.subpackages) {
    lines.push(renderPackageRow(subpackage));
  }
  if (report.workerPackage) {
    lines.push(renderPackageRow(report.workerPackage));
  }
  lines.push('');
  lines.push('## 入口口径');
  for (const entryPath of report.mainPackage.entryPaths) {
    lines.push('- 主包入口：`' + entryPath + '`');
  }
  if (report.workerPackage) {
    for (const entryPath of report.workerPackage.entryPaths) {
      lines.push('- workers 分包入口：`' + entryPath + '`');
    }
  }
  lines.push('');
  lines.push('## 说明');
  for (const note of report.notes) {
    lines.push('- ' + note);
  }
  lines.push('');
  lines.push('## 失败信息');
  if (report.violations.length === 0) {
    lines.push('- 无');
  } else {
    for (const violation of report.violations) {
      lines.push('- ' + violation);
    }
  }
  lines.push('');

  return lines;
}

function renderPackageRow(packageReport) {
  const statusText = packageReport.withinLimit ? '通过' : '失败';
  const limitText = packageReport.limitText || '无';
  return '| ' + packageReport.label + ' | ' + packageReport.category + ' | ' + packageReport.fileCount + ' | ' + packageReport.sizeText + ' | ' + limitText + ' | ' + statusText + ' |';
}

function printHumanSummary(layout, report) {
  const reportMarkdownPath = formatProjectPathFromWorkspace(layout, REPORT_MARKDOWN_RELATIVE_PATH);

  console.log('[wechat-code-package] 官方包体规则已检查');
  console.log('- 主包:', report.mainPackage.sizeText + ' / ' + report.mainPackage.limitText);
  console.log('- 总包:', report.totals.sizeText + ' / ' + report.totals.limitText);
  for (const subpackage of report.subpackages) {
    const suffix = subpackage.limitText ? ' / ' + subpackage.limitText : '';
    console.log('- 分包 ' + subpackage.label + ':', subpackage.sizeText + suffix);
  }
  if (report.workerPackage) {
    console.log('- workers 分包:', report.workerPackage.sizeText);
  }
  console.log('- 报告:', reportMarkdownPath);

  if (report.violations.length === 0) {
    console.log('[wechat-code-package] 通过');
    return;
  }

  console.error('[wechat-code-package] 失败：');
  for (const violation of report.violations) {
    console.error('- ' + violation);
  }
}

function readJson(layout, relativePath) {
  const absolutePath = resolveProjectFilePath(layout, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function trimSlashes(input) {
  return normalizePath(String(input || '')).replace(/^\/+/, '').replace(/[\\/]+$/, '');
}

function formatBytes(byteCount) {
  return (byteCount / BYTES_PER_MB).toFixed(2) + ' MiB';
}

main();
