#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const ANALYSE_PATH = path.join(PROJECT_ROOT, 'analyse-data.json');
const PROJECT_CONFIG_PATH = path.join(PROJECT_ROOT, 'project.config.json');
const REPORT_JSON_PATH = path.join(PROJECT_ROOT, 'architecture', 'docs', 'unused-safe-ignore-report.json');
const REPORT_MD_PATH = path.join(PROJECT_ROOT, 'architecture', 'docs', 'unused-safe-ignore-report.md');

const SAFE_DEV_PREFIXES = [
  '.git/',
  '.idea/',
  'architecture/docs/',
  'architecture/generated/',
  'architecture/memory/',
  'architecture/skills/',
  'architecture/tools/',
  'wechat-test/',
  'tools/'
];

const PROTECTED_RUNTIME_PREFIXES = [
  'game.js',
  'game.json',
  'app-config.json',
  'src/',
  'runtime/',
  'assets/',
  'subpackages/',
  'cocos-js/',
  'architecture/boot/'
];

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizePath(p) {
  return p.replace(/\\\\/g, '/');
}

function matchesPrefix(filePath, prefixes) {
  return prefixes.some((prefix) => filePath === prefix || filePath.startsWith(prefix));
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function classifyUnusedFile(filePath) {
  if (matchesPrefix(filePath, PROTECTED_RUNTIME_PREFIXES)) {
    return 'protected-runtime';
  }
  if (matchesPrefix(filePath, SAFE_DEV_PREFIXES)) {
    return 'safe-dev';
  }
  return 'manual-review';
}

function toIgnoreKey(item) {
  return `${item.type}:${item.value}`;
}

function buildReport(stats) {
  return {
    source: {
      analyseData: path.relative(PROJECT_ROOT, ANALYSE_PATH),
      projectConfig: path.relative(PROJECT_ROOT, PROJECT_CONFIG_PATH)
    },
    policy: {
      safeDevPrefixes: SAFE_DEV_PREFIXES,
      protectedRuntimePrefixes: PROTECTED_RUNTIME_PREFIXES
    },
    summary: stats.summary,
    addableSafeIgnoreCandidates: stats.addableSafeIgnoreCandidates,
    blockedProtectedRuntimeSamples: stats.blockedProtectedRuntimeSamples,
    manualReviewSamples: stats.manualReviewSamples
  };
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# Unused File Safe Ignore Report');
  lines.push('');
  lines.push(`- Source: ${report.source.analyseData}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total unused files: ${report.summary.totalUnusedFiles}`);
  lines.push(`- Already covered by existing ignore rules: ${report.summary.alreadyCovered}`);
  lines.push(`- Not covered: ${report.summary.notCovered}`);
  lines.push(`- Protected runtime files in not-covered set: ${report.summary.notCoveredProtectedRuntime}`);
  lines.push(`- Safe dev files in not-covered set: ${report.summary.notCoveredSafeDev}`);
  lines.push(`- Manual review files in not-covered set: ${report.summary.notCoveredManualReview}`);
  lines.push(`- Safe candidates added this run: ${report.summary.addedSafeCandidates}`);
  lines.push('');
  lines.push('## Added Safe Candidates');
  lines.push('');
  if (report.addableSafeIgnoreCandidates.length === 0) {
    lines.push('- None');
  } else {
    report.addableSafeIgnoreCandidates.forEach((filePath) => lines.push(`- ${filePath}`));
  }
  lines.push('');
  lines.push('## Blocked (Protected Runtime) Samples');
  lines.push('');
  report.blockedProtectedRuntimeSamples.forEach((filePath) => lines.push(`- ${filePath}`));
  lines.push('');
  lines.push('## Manual Review Samples');
  lines.push('');
  report.manualReviewSamples.forEach((filePath) => lines.push(`- ${filePath}`));
  lines.push('');
  return lines.join('\n');
}

function main() {
  const shouldApply = process.argv.includes('--apply');

  const analyseData = loadJson(ANALYSE_PATH);
  const projectConfig = loadJson(PROJECT_CONFIG_PATH);

  projectConfig.packOptions = projectConfig.packOptions || {};
  projectConfig.packOptions.ignore = ensureArray(projectConfig.packOptions.ignore);

  const ignoreItems = projectConfig.packOptions.ignore;
  const ignoreFolders = ignoreItems
    .filter((item) => item && item.type === 'folder' && typeof item.value === 'string')
    .map((item) => normalizePath(item.value).replace(/\/$/, ''));
  const ignoreKeys = new Set(
    ignoreItems
      .filter((item) => item && typeof item.type === 'string' && typeof item.value === 'string')
      .map((item) => toIgnoreKey({ type: item.type, value: normalizePath(item.value) }))
  );

  const unusedFiles = ensureArray(analyseData.unusedCodeFiles)
    .map((item) => normalizePath(item.path || ''))
    .filter(Boolean);

  const notCovered = [];
  let alreadyCovered = 0;

  for (const filePath of unusedFiles) {
    if (ignoreKeys.has(`file:${filePath}`)) {
      alreadyCovered += 1;
      continue;
    }
    if (ignoreFolders.some((folder) => filePath === folder || filePath.startsWith(`${folder}/`))) {
      alreadyCovered += 1;
      continue;
    }
    notCovered.push(filePath);
  }

  const classified = {
    'protected-runtime': [],
    'safe-dev': [],
    'manual-review': []
  };

  for (const filePath of notCovered) {
    classified[classifyUnusedFile(filePath)].push(filePath);
  }

  const safeAddable = classified['safe-dev'].filter((filePath) => !ignoreKeys.has(`file:${filePath}`));

  let addedSafeCandidates = 0;
  if (shouldApply) {
    for (const filePath of safeAddable) {
      const key = `file:${filePath}`;
      if (ignoreKeys.has(key)) {
        continue;
      }
      ignoreItems.push({ type: 'file', value: filePath });
      ignoreKeys.add(key);
      addedSafeCandidates += 1;
    }

    projectConfig.setting = projectConfig.setting || {};
    if (projectConfig.setting.ignoreDevUnusedFiles !== true) {
      projectConfig.setting.ignoreDevUnusedFiles = true;
    }

    fs.writeFileSync(PROJECT_CONFIG_PATH, JSON.stringify(projectConfig, null, 2) + '\n');
  }

  const report = buildReport({
    summary: {
      totalUnusedFiles: unusedFiles.length,
      alreadyCovered,
      notCovered: notCovered.length,
      notCoveredProtectedRuntime: classified['protected-runtime'].length,
      notCoveredSafeDev: classified['safe-dev'].length,
      notCoveredManualReview: classified['manual-review'].length,
      addedSafeCandidates
    },
    addableSafeIgnoreCandidates: safeAddable,
    blockedProtectedRuntimeSamples: classified['protected-runtime'].slice(0, 25),
    manualReviewSamples: classified['manual-review'].slice(0, 25)
  });

  fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(REPORT_MD_PATH, buildMarkdown(report));

  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`report-json: ${path.relative(PROJECT_ROOT, REPORT_JSON_PATH)}`);
  console.log(`report-md: ${path.relative(PROJECT_ROOT, REPORT_MD_PATH)}`);
}

main();
