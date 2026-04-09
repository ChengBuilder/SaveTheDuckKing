'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const REFINED_DIRECTORY = 'restored/start-scene/refined';

/**
 * 校验手工还原层的语法正确性。
 * 目标：把 `*.refined.js` 纳入护栏，避免后续语义还原文件只靠人工阅读、不做机器校验。
 */
function verifyRefinedModuleSyntax() {
  const layout = resolveProjectLayout(__dirname);
  const refinedDirectoryPath = resolveProjectFilePath(layout, REFINED_DIRECTORY);

  if (!fs.existsSync(refinedDirectoryPath) || !fs.statSync(refinedDirectoryPath).isDirectory()) {
    console.log('[verify-refined-module-syntax] 跳过：未找到目录', formatProjectPathFromWorkspace(layout, REFINED_DIRECTORY));
    return;
  }

  const refinedFilePaths = fs.readdirSync(refinedDirectoryPath)
    .filter(function filterRefinedFile(fileName) {
      return /\.refined\.js$/i.test(fileName);
    })
    .sort();

  for (const fileName of refinedFilePaths) {
    const relativePath = REFINED_DIRECTORY + '/' + fileName;
    const absolutePath = resolveProjectFilePath(layout, relativePath);
    execFileSync(process.execPath, ['-c', absolutePath], {
      cwd: layout.workspaceRoot,
      stdio: 'inherit'
    });
  }

  console.log('[verify-refined-module-syntax] 通过，文件数:', refinedFilePaths.length);
}

verifyRefinedModuleSyntax();
