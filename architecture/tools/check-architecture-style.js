'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 简单检查 architecture 层代码风格：
 * 1) 函数应带中文注释（通过 JSDoc + 中文字符粗略判断）
 * 2) 避免明显无语义变量名
 */
function checkArchitectureStyle() {
  const architectureDir = path.resolve(__dirname, '..');
  const files = collectJsFiles(architectureDir).filter((filePath) => !filePath.includes('/tools/'));
  const issues = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');

    const functionNames = Array.from(content.matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm)).map((m) => m[1]);
    for (const functionName of functionNames) {
      const functionIndex = content.indexOf(`function ${functionName}(`);
      const jsdocText = resolveNearestJsdoc(content, functionIndex);
      const hasJsdoc = jsdocText.length > 0;
      const hasChinese = /[\u4e00-\u9fa5]/.test(jsdocText);
      if (!hasJsdoc || !hasChinese) {
        issues.push(`${relative(architectureDir, filePath)}: 函数 ${functionName} 缺少中文 JSDoc`);
      }
    }

    for (const badVarMatch of content.matchAll(/\b(const|let|var)\s+([a-zA-Z])\s*=/g)) {
      issues.push(`${relative(architectureDir, filePath)}: 变量命名过短 -> ${badVarMatch[2]}`);
    }
  }

  if (issues.length > 0) {
    console.error('[check-architecture-style] 发现规范问题：');
    for (const issue of issues) {
      console.error('- ' + issue);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[check-architecture-style] 通过');
}

/**
 * 查找函数前最近的 JSDoc 注释块。
 * 仅接受“紧邻函数定义”的注释，避免误把远处注释当作有效说明。
 * @param {string} content 文件全文
 * @param {number} functionIndex 函数起始位置
 * @returns {string}
 */
function resolveNearestJsdoc(content, functionIndex) {
  const beforeFunction = content.slice(0, functionIndex);
  const jsdocMatch = beforeFunction.match(/\/\*\*[\s\S]*?\*\/\s*$/);
  return jsdocMatch ? jsdocMatch[0] : '';
}

function collectJsFiles(dirPath) {
  const result = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectJsFiles(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith('.js')) {
      result.push(fullPath);
    }
  }
  return result;
}

function relative(rootPath, fullPath) {
  return path.relative(rootPath, fullPath).replace(/\\/g, '/');
}

checkArchitectureStyle();
