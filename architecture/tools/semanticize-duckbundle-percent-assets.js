'use strict';

const fs = require('fs');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace
} = require('./project-paths');

const DUCK_BUNDLE_CONFIG_RELATIVE_PATH = 'subpackages/DuckBundle/config.duck-bundle.json';

const PERCENT_PATH_MAP = Object.freeze({
  'tex/%2': 'tex/percent2',
  'tex/%2/texture': 'tex/percent2/texture',
  'tex/%2/spriteFrame': 'tex/percent2/spriteFrame'
});

const LEGACY_PERCENT_PATHS = Object.freeze(Object.keys(PERCENT_PATH_MAP));

function semanticizeDuckBundlePercentAssets() {
  const layout = resolveProjectLayout(__dirname);
  const configAbsolutePath = resolveProjectFilePath(layout, DUCK_BUNDLE_CONFIG_RELATIVE_PATH);
  const configDisplayLabel = formatProjectPathFromWorkspace(layout, DUCK_BUNDLE_CONFIG_RELATIVE_PATH);

  const result = updateDuckBundleConfig(configAbsolutePath, configDisplayLabel);
  console.log(
    '[DuckBundle %2 语义化]',
    result.label,
    'canonical path 改写数:',
    result.replacementCount
  );
}

function updateDuckBundleConfig(filePath, displayLabel) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const parsedJson = JSON.parse(originalContent);
  const paths = parsedJson.paths || {};
  let replacementCount = 0;

  for (const pathEntry of Object.values(paths)) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }

    const semanticPath = PERCENT_PATH_MAP[pathEntry[0]];
    if (!semanticPath) {
      continue;
    }
    if (semanticPath !== pathEntry[0]) {
      pathEntry[0] = semanticPath;
      replacementCount += 1;
    }
  }

  verifyNoLegacyPercentPaths(paths, displayLabel);

  const nextContent = JSON.stringify(parsedJson, null, 2) + '\n';
  if (nextContent !== originalContent) {
    fs.writeFileSync(filePath, nextContent);
  }

  return {
    label: displayLabel,
    replacementCount: replacementCount
  };
}

function verifyNoLegacyPercentPaths(paths, displayLabel) {
  const remainingPaths = new Set();

  for (const pathEntry of Object.values(paths || {})) {
    if (!Array.isArray(pathEntry) || typeof pathEntry[0] !== 'string') {
      continue;
    }
    if (LEGACY_PERCENT_PATHS.includes(pathEntry[0])) {
      remainingPaths.add(pathEntry[0]);
    }
  }

  if (remainingPaths.size > 0) {
    throw new Error(
      '[DuckBundle %2 语义化] ' +
      displayLabel +
      ' 仍存在旧路径: ' +
      Array.from(remainingPaths).sort().join(', ')
    );
  }
}

semanticizeDuckBundlePercentAssets();
