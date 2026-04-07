'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 从 game.js 中提取 define/System.register 模块索引，生成可读清单。
 */
function generateModuleIndex() {
  const rootDir = path.resolve(__dirname, '..', '..');
  const gamePath = path.join(rootDir, 'game.js');
  const outputPath = path.join(rootDir, 'architecture', 'docs', 'module-index.md');
  const source = fs.readFileSync(gamePath, 'utf8');

  const defineModules = new Set();
  const systemModules = new Set();

  for (const match of source.matchAll(/define\("([^"]+)"/g)) {
    defineModules.add(match[1]);
  }

  for (const match of source.matchAll(/System\.register\("([^"]+)"/g)) {
    systemModules.add(match[1]);
  }

  const defineList = Array.from(defineModules).sort();
  const systemList = Array.from(systemModules).sort();

  const lines = [];
  lines.push('# 模块索引（自动生成）');
  lines.push('');
  lines.push('> 本文件由 `architecture/tools/generate-module-index.js` 生成。');
  lines.push('');
  lines.push('## 统计');
  lines.push(`- define 模块数：${defineList.length}`);
  lines.push(`- System.register 模块数：${systemList.length}`);
  lines.push('');
  lines.push('## define 模块');
  for (const moduleName of defineList) {
    lines.push(`- \`${moduleName}\``);
  }
  lines.push('');
  lines.push('## System.register 模块');
  for (const moduleName of systemList) {
    lines.push(`- \`${moduleName}\``);
  }
  lines.push('');

  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log('[generate-module-index] wrote:', outputPath);
}

generateModuleIndex();

