'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DUCK_BUNDLE_DIR = path.join(PROJECT_ROOT, 'subpackages', 'DuckBundle');
const DUCK_BUNDLE_CONFIG_PATH = findBundleConfigPath(DUCK_BUNDLE_DIR);
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'assets', 'data', 'gameplay', 'wood', 'wood-prefab-blueprints.json');
const OUTPUT_TS_CATALOG_PATH = path.join(
  PROJECT_ROOT,
  'assets',
  'scripts',
  'gameplay',
  'wood',
  'WoodPrefabBlueprintCatalog.ts'
);
const REPORT_PATH = path.join(PROJECT_ROOT, 'architecture', 'reports', 'wood-prefab-blueprints-report.json');

const BASE64_MAP = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .map((char, index) => [char, index])
);
const HEX_CHARS = '0123456789abcdef';

const NAIL_ASSET_PATH = 'prefab/nail';
const WOOD_COLOR_CANDIDATES = Object.freeze([
  'grayWood',
  'lightWood',
  'redWood',
  'brownWood',
  'goldWood',
  'yellowWood'
]);
const NAIL_SPRITE_CANDIDATES = Object.freeze([
  'tex/nail/baia/spriteFrame',
  'tex/nail/bain/spriteFrame',
  'tex/nail/dingZi/spriteFrame',
  'tex/nailGlow/spriteFrame'
]);
const WOOD_TARGETS = Object.freeze([
  { woodType: 2, assetPath: 'prefab/wood/wood2' },
  { woodType: 11, assetPath: 'prefab/wood/wood11' },
  { woodType: 37, assetPath: 'prefab/wood/wood37' },
  { woodType: 42, assetPath: 'prefab/wood/wood42' }
]);

function main() {
  const config = readJson(DUCK_BUNDLE_CONFIG_PATH);
  const nailBlueprint = extractNailBlueprint(config);
  const result = {
    generatedAt: new Date().toISOString(),
    bundle: 'DuckBundle',
    sourceConfig: relativeProjectPath(DUCK_BUNDLE_CONFIG_PATH),
    nailPrefab: nailBlueprint,
    woods: []
  };

  for (const target of WOOD_TARGETS) {
    result.woods.push(extractWoodBlueprint(config, target));
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');
  fs.mkdirSync(path.dirname(OUTPUT_TS_CATALOG_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_TS_CATALOG_PATH, buildTypeScriptCatalogSource(result.woods, nailBlueprint), 'utf8');
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');

  console.log('[extract-wood-prefab-blueprints] summary');
  console.log(
    JSON.stringify(
      {
        output: relativeProjectPath(OUTPUT_PATH),
        catalog: relativeProjectPath(OUTPUT_TS_CATALOG_PATH),
        report: relativeProjectPath(REPORT_PATH),
        woodCount: result.woods.length
      },
      null,
      2
    )
  );

  for (const wood of result.woods) {
    console.log(
      '- ' +
        wood.assetPath +
        ' | mode=' +
        wood.importMode +
        ' | nails=' +
        wood.nails.length +
        ' | source=' +
        wood.source
    );
  }

  console.log(
    '- ' +
      nailBlueprint.assetPath +
      ' | mode=' +
      nailBlueprint.importMode +
      ' | spriteDeps=' +
      nailBlueprint.spriteDependencies.length +
      ' | source=' +
      nailBlueprint.source
  );
}

function extractWoodBlueprint(config, target) {
  const assetRecord = resolveBundleAsset(config, target.assetPath);
  const rawPrefabData = readJson(assetRecord.importArtifact.filePath);
  const assetPayload = assetRecord.importArtifact.mode === 'pack'
    ? rawPrefabData[5][assetRecord.importArtifact.packPosition]
    : rawPrefabData[5];
  const woodName = path.basename(target.assetPath);

  const rootRecord = findNamedRecord(assetPayload, woodName, function isRootRecord(record) {
    return Array.isArray(record) && record.length >= 4 && Array.isArray(record[3]);
  });
  const woodSpriteRecord = findNamedRecord(assetPayload, 'woodSpr');

  const colliderPoints = findFirstColliderPoints(rootRecord || assetPayload);
  const nails = collectNailOverrides(assetPayload)
    .sort(function sortNails(left, right) {
      return left.localPosition.x - right.localPosition.x;
    })
    .map(function mapNail(nail, index) {
      return {
        index: index,
        name: nail.name,
        localPosition: normalizeVec3(nail.localPosition)
      };
    });

  return {
    woodType: target.woodType,
    assetPath: target.assetPath,
    importMode: assetRecord.importArtifact.mode,
    source: relativeProjectPath(assetRecord.importArtifact.filePath),
    sourceIndex: assetRecord.sourceIndex,
    rootNodeName: woodName,
    rootSize: normalizeSize(findFirstSize(rootRecord || assetPayload)),
    woodSpriteSize: normalizeSize(findFirstSize(woodSpriteRecord || assetPayload)),
    colliderPoints: normalizePoints(colliderPoints),
    nails: nails,
    woodSpriteDependencies: mergeUnique(
      collectReferencedAssetPaths(woodSpriteRecord || assetPayload, config),
      collectWoodSpriteDependencies(config, target.woodType)
    ),
    woodSpriteScale: normalizeScale(findFirstScale(woodSpriteRecord || assetPayload)),
    nailPrefabAssetPath: NAIL_ASSET_PATH,
    externalDependencies: resolveExternalDependencies(config, rawPrefabData[1] || []),
    notes: assetRecord.importArtifact.mode === 'pack'
      ? ['资源来自 bundle pack；当前蓝图用于后续重建真正可维护 prefab。']
      : []
  };
}

function extractNailBlueprint(config) {
  const assetRecord = resolveBundleAsset(config, NAIL_ASSET_PATH);
  const rawPrefabData = readJson(assetRecord.importArtifact.filePath);
  const assetPayload = assetRecord.importArtifact.mode === 'pack'
    ? rawPrefabData[5][assetRecord.importArtifact.packPosition]
    : rawPrefabData[5];
  const rootRecord = findNamedRecord(assetPayload, 'nail', function isNailRoot(record) {
    return Array.isArray(record) && record.length >= 4 && Array.isArray(record[3]);
  });
  const spriteRecord = findNamedRecord(assetPayload, 'spr');

  return {
    assetPath: NAIL_ASSET_PATH,
    importMode: assetRecord.importArtifact.mode,
    source: relativeProjectPath(assetRecord.importArtifact.filePath),
    sourceIndex: assetRecord.sourceIndex,
    rootNodeName: 'nail',
    rootSize: normalizeSize(findFirstSize(rootRecord || assetPayload)),
    spriteSize: normalizeSize(findFirstSize(spriteRecord || assetPayload)),
    nodeScale: normalizeScale(findFirstScale(rootRecord || assetPayload)),
    spriteDependencies: mergeUnique(
      collectReferencedAssetPaths(spriteRecord || assetPayload, config),
      collectNailSpriteDependencies(config)
    ),
    externalDependencies: resolveExternalDependencies(config, rawPrefabData[1] || []),
    notes: assetRecord.importArtifact.mode === 'pack'
      ? ['资源来自 bundle pack；当前蓝图用于后续重建真正可维护 prefab。']
      : []
  };
}

function resolveBundleAsset(config, assetPath) {
  const paths = config.paths || {};
  for (const [sourceIndexText, pathInfo] of Object.entries(paths)) {
    if (!Array.isArray(pathInfo) || pathInfo[0] !== assetPath) {
      continue;
    }
    const sourceIndex = Number(sourceIndexText);
    const rawUuid = config.uuids[sourceIndex];
    const decodedUuid = decodeUuidLike(rawUuid);
    return {
      sourceIndex: sourceIndex,
      importArtifact: resolveImportArtifact(config, sourceIndex, decodedUuid)
    };
  }

  throw new Error('未找到 prefab 资源路径: ' + assetPath);
}

function resolveImportArtifact(config, sourceIndex, decodedUuid) {
  const importDir = path.join(DUCK_BUNDLE_DIR, 'import');
  const directVersion = findVersionForIndex(config.versions && config.versions.import, sourceIndex);
  if (directVersion) {
    const directFilePath = findArtifactFile(importDir, decodedUuid, directVersion);
    if (!directFilePath) {
      throw new Error('未找到 prefab import 文件: ' + decodedUuid + '.' + directVersion);
    }
    return {
      mode: 'direct',
      filePath: directFilePath
    };
  }

  const packInfo = findPackContainingIndex(config.packs || {}, sourceIndex);
  if (!packInfo) {
    throw new Error('prefab 既不在 direct import 也不在 pack 中: ' + decodedUuid);
  }

  const packDir = path.join(importDir, packInfo.packId.slice(0, 2).toLowerCase());
  const packFilePath = findFileByPrefix(packDir, packInfo.packId + '.');
  if (!packFilePath) {
    throw new Error('未找到 prefab pack 文件: ' + packInfo.packId);
  }

  return {
    mode: 'pack',
    filePath: packFilePath,
    packPosition: packInfo.packPosition
  };
}

function resolveExternalDependencies(config, rawUuidList) {
  const dependencies = [];
  for (const rawUuid of rawUuidList) {
    const assetPath = findAssetPathByUuid(config, rawUuid);
    if (!assetPath) {
      continue;
    }
    if (dependencies.indexOf(assetPath) === -1) {
      dependencies.push(assetPath);
    }
  }
  return dependencies.sort();
}

function findAssetPathByUuid(config, targetRawUuid) {
  const targetDecodedUuid = decodeUuidLike(targetRawUuid);

  for (let index = 0; index < (config.uuids || []).length; index += 1) {
    const rawUuid = config.uuids[index];
    const decodedUuid = decodeUuidLike(rawUuid);
    if (rawUuid === targetRawUuid || decodedUuid === targetDecodedUuid) {
      const pathInfo = (config.paths || {})[String(index)];
      return Array.isArray(pathInfo) ? pathInfo[0] : null;
    }
  }

  return null;
}

function findNamedRecord(value, targetName, predicate) {
  if (!Array.isArray(value)) {
    return null;
  }

  if (typeof value[1] === 'string' && value[1] === targetName) {
    if (!predicate || predicate(value)) {
      return value;
    }
  }

  for (const item of value) {
    const nested = findNamedRecord(item, targetName, predicate);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function findFirstSize(value) {
  let found = null;
  walkArray(value, function visit(candidate) {
    if (found) {
      return;
    }
    if (
      Array.isArray(candidate) &&
      candidate.length === 3 &&
      candidate[0] === 5 &&
      typeof candidate[1] === 'number' &&
      typeof candidate[2] === 'number'
    ) {
      found = {
        width: candidate[1],
        height: candidate[2]
      };
    }
  });
  return found;
}

function findFirstColliderPoints(value) {
  let found = null;
  walkArray(value, function visit(candidate) {
    if (found) {
      return;
    }
    if (!Array.isArray(candidate) || candidate.length === 0) {
      return;
    }
    const isPointsArray = candidate.every(function checkPoint(point) {
      return (
        Array.isArray(point) &&
        point.length === 3 &&
        point[0] === 0 &&
        typeof point[1] === 'number' &&
        typeof point[2] === 'number'
      );
    });
    if (isPointsArray) {
      found = candidate.map(function mapPoint(point) {
        return { x: point[1], y: point[2] };
      });
    }
  });
  return found || [];
}

function collectNailOverrides(value) {
  const nails = [];

  walkArray(value, function visit(candidate) {
    if (!Array.isArray(candidate)) {
      return;
    }

    const nameEntry = findNestedEntry(candidate, function matchName(entry) {
      return (
        Array.isArray(entry) &&
        typeof entry[1] === 'string' &&
        entry[1] === 'nail' &&
        Array.isArray(entry[2]) &&
        entry[2][0] === '_name'
      );
    });

    if (!nameEntry) {
      return;
    }

    const positionEntry = findNestedEntry(candidate, function matchPosition(entry) {
      return (
        Array.isArray(entry) &&
        entry.length >= 4 &&
        Array.isArray(entry[1]) &&
        entry[1][0] === '_lpos' &&
        Array.isArray(entry[3]) &&
        entry[3].length === 4 &&
        entry[3][0] === 1 &&
        typeof entry[3][1] === 'number' &&
        typeof entry[3][2] === 'number' &&
        typeof entry[3][3] === 'number'
      );
    });

    if (!positionEntry) {
      return;
    }

    const nailDescriptor = {
      name: 'nail',
      localPosition: {
        x: positionEntry[3][1],
        y: positionEntry[3][2],
        z: positionEntry[3][3]
      }
    };

    if (!containsNail(nails, nailDescriptor)) {
      nails.push(nailDescriptor);
    }
  });

  return nails;
}

function containsNail(nails, targetNail) {
  return nails.some(function hasSameNail(nail) {
    return (
      nail.name === targetNail.name &&
      nail.localPosition.x === targetNail.localPosition.x &&
      nail.localPosition.y === targetNail.localPosition.y &&
      nail.localPosition.z === targetNail.localPosition.z
    );
  });
}

function findNestedEntry(value, predicate) {
  if (!Array.isArray(value)) {
    return null;
  }

  if (predicate(value)) {
    return value;
  }

  for (const item of value) {
    const nested = findNestedEntry(item, predicate);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function walkArray(value, visitor) {
  if (!Array.isArray(value)) {
    return;
  }

  visitor(value);
  for (const item of value) {
    walkArray(item, visitor);
  }
}

function findVersionForIndex(versionPairs, sourceIndex) {
  if (!Array.isArray(versionPairs)) {
    return null;
  }
  for (let index = 0; index < versionPairs.length; index += 2) {
    if (versionPairs[index] === sourceIndex) {
      return versionPairs[index + 1];
    }
  }
  return null;
}

function findPackContainingIndex(packs, sourceIndex) {
  for (const [packId, sourceIndexes] of Object.entries(packs || {})) {
    if (!Array.isArray(sourceIndexes)) {
      continue;
    }
    const packPosition = sourceIndexes.indexOf(sourceIndex);
    if (packPosition >= 0) {
      return {
        packId: packId,
        packPosition: packPosition
      };
    }
  }
  return null;
}

function findArtifactFile(baseDir, decodedUuid, version) {
  const shardDir = path.join(baseDir, decodedUuid.slice(0, 2).toLowerCase());
  return findFileByPrefix(shardDir, decodedUuid + '.' + version + '.');
}

function findFileByPrefix(directoryPath, filePrefix) {
  if (!isDirectory(directoryPath)) {
    return null;
  }
  const entries = fs.readdirSync(directoryPath).sort();
  for (const entryName of entries) {
    if (entryName.startsWith(filePrefix)) {
      return path.join(directoryPath, entryName);
    }
  }
  return null;
}

function decodeUuidLike(rawValue) {
  const raw = String(rawValue || '');
  const core = raw.split('@')[0];
  if (core.length !== 22) {
    return raw;
  }

  let hex = core[0] + core[1];
  for (let index = 2; index < 22; index += 2) {
    const a = BASE64_MAP[core[index]];
    const b = BASE64_MAP[core[index + 1]];
    if (a == null || b == null) {
      return raw;
    }
    hex += HEX_CHARS[a >> 2];
    hex += HEX_CHARS[((a & 3) << 2) | (b >> 4)];
    hex += HEX_CHARS[b & 15];
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join('-') + raw.slice(core.length);
}

function findBundleConfigPath(bundleDir) {
  const configName = fs.readdirSync(bundleDir).find((entryName) => /^config\..+\.json$/i.test(entryName));
  if (!configName) {
    throw new Error('bundle 缺少 config.*.json: ' + relativeProjectPath(bundleDir));
  }
  return path.join(bundleDir, configName);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function relativeProjectPath(targetPath) {
  return path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/');
}

function isDirectory(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

function buildTypeScriptCatalogSource(woods, nailBlueprint) {
  const serializedBlueprints = JSON.stringify(woods, null, 2);
  const serializedNailBlueprint = JSON.stringify(nailBlueprint, null, 2);
  return (
    "import { NailPrefabBlueprint, WoodPrefabBlueprint } from './WoodPrefabBlueprint';\n\n" +
    'export const WOOD_PREFAB_BLUEPRINT_LIST: ReadonlyArray<WoodPrefabBlueprint> = Object.freeze(\n' +
    indentBlock(serializedBlueprints, 2) +
    '\n);\n\n' +
    'const WOOD_PREFAB_BLUEPRINTS_BY_TYPE: Readonly<Record<number, WoodPrefabBlueprint>> = Object.freeze(\n' +
    '  WOOD_PREFAB_BLUEPRINT_LIST.reduce(function buildRecord(record, blueprint) {\n' +
    '    record[blueprint.woodType] = blueprint;\n' +
    '    return record;\n' +
    '  }, {} as Record<number, WoodPrefabBlueprint>)\n' +
    ');\n\n' +
    'export const NAIL_PREFAB_BLUEPRINT: NailPrefabBlueprint =\n' +
    indentBlock(serializedNailBlueprint, 2) +
    ';\n\n' +
    'export function getWoodPrefabBlueprint(woodType: number): WoodPrefabBlueprint | null {\n' +
    '  return WOOD_PREFAB_BLUEPRINTS_BY_TYPE[woodType] || null;\n' +
    '}\n\n' +
    'export function getSupportedWoodPrefabTypes(): number[] {\n' +
    '  return WOOD_PREFAB_BLUEPRINT_LIST.map(function mapWoodType(blueprint) {\n' +
    '    return blueprint.woodType;\n' +
    '  });\n' +
    '}\n\n' +
    'export function getNailPrefabBlueprint(): NailPrefabBlueprint {\n' +
    '  return NAIL_PREFAB_BLUEPRINT;\n' +
    '}\n'
  );
}

function indentBlock(text, spaces) {
  const indentation = ' '.repeat(spaces);
  return text
    .split('\n')
    .map(function mapLine(line) {
      return indentation + line;
    })
    .join('\n');
}

function normalizeSize(size) {
  if (!size) {
    return null;
  }
  return {
    width: normalizeNumber(size.width),
    height: normalizeNumber(size.height)
  };
}

function findFirstScale(value) {
  let found = null;
  walkArray(value, function visit(candidate) {
    if (found) {
      return;
    }
    if (
      Array.isArray(candidate) &&
      candidate.length >= 4 &&
      candidate[0] === 1 &&
      typeof candidate[1] === 'number' &&
      typeof candidate[2] === 'number' &&
      typeof candidate[3] === 'number'
    ) {
      found = { x: candidate[1], y: candidate[2], z: candidate[3] };
    }
  });
  return found;
}

function normalizeScale(scale) {
  if (!scale) {
    return null;
  }
  return {
    x: normalizeNumber(scale.x),
    y: normalizeNumber(scale.y),
    z: normalizeNumber(scale.z)
  };
}

function collectWoodSpriteDependencies(config, woodType) {
  const candidates = WOOD_COLOR_CANDIDATES.map(function buildPath(colorName) {
    return 'tex/wood/' + colorName + '/' + colorName + woodType + '/spriteFrame';
  });
  return filterExistingAssetPaths(config, candidates);
}

function collectNailSpriteDependencies(config) {
  return filterExistingAssetPaths(config, NAIL_SPRITE_CANDIDATES);
}

function filterExistingAssetPaths(config, assetPaths) {
  const existing = [];
  for (const assetPath of assetPaths) {
    if (hasBundleAssetPath(config, assetPath)) {
      existing.push(assetPath);
    }
  }
  return existing;
}

function hasBundleAssetPath(config, assetPath) {
  const paths = config.paths || {};
  for (const pathInfo of Object.values(paths)) {
    if (Array.isArray(pathInfo) && pathInfo[0] === assetPath) {
      return true;
    }
  }
  return false;
}

function mergeUnique() {
  const merged = [];
  for (const list of arguments) {
    if (!Array.isArray(list)) {
      continue;
    }
    for (const item of list) {
      if (merged.indexOf(item) === -1) {
        merged.push(item);
      }
    }
  }
  return merged;
}

function collectReferencedAssetPaths(value, config) {
  if (!Array.isArray(value)) {
    return [];
  }
  const referenced = new Set();
  walkArray(value, function visit(candidate) {
    if (
      Array.isArray(candidate) &&
      candidate.length >= 2 &&
      candidate[0] === 0 &&
      typeof candidate[1] === 'string'
    ) {
      const assetPath = findAssetPathByUuid(config, candidate[1]);
      if (assetPath) {
        referenced.add(assetPath);
      }
    }
  });
  return Array.from(referenced).sort();
}

function normalizePoints(points) {
  return points.map(function mapPoint(point) {
    return {
      x: normalizeNumber(point.x),
      y: normalizeNumber(point.y)
    };
  });
}

function normalizeVec3(vec3) {
  return {
    x: normalizeNumber(vec3.x),
    y: normalizeNumber(vec3.y),
    z: normalizeNumber(vec3.z)
  };
}

function normalizeNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return value;
  }
  return Math.round(value * 1000) / 1000;
}

main();
