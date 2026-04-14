'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectPaths = require('./project-paths');

const layout = projectPaths.resolveProjectLayout(__dirname);
const PROJECT_ROOT = layout.projectRoot;

const BLUEPRINT_PATH = path.join(PROJECT_ROOT, 'assets', 'data', 'gameplay', 'wood', 'wood-prefab-blueprints.json');
const AUTHORING_HOST_META_PATH = path.join(
  PROJECT_ROOT,
  'assets',
  'scripts',
  'gameplay',
  'wood',
  'WoodPrefabAuthoringHost.ts.meta'
);
const OUTPUT_DIRECTORY = path.join(PROJECT_ROOT, 'assets', 'prefabs', 'gameplay', 'wood');
const REPORT_PATH = path.join(PROJECT_ROOT, 'architecture', 'reports', 'wood-authoring-prefabs-report.json');
const PREFAB_META_VERSION = '1.1.50';

function main() {
  const blueprintData = readJson(BLUEPRINT_PATH);
  const authoringHostMeta = readJson(AUTHORING_HOST_META_PATH);
  const authoringHostTypeId = compressUuid(authoringHostMeta.uuid);
  const woods = Array.isArray(blueprintData.woods) ? blueprintData.woods : [];

  fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

  const generated = woods.map(function generatePrefabRecord(woodBlueprint) {
    const prefabName = 'wood' + String(woodBlueprint.woodType);
    const prefabPath = path.join(OUTPUT_DIRECTORY, prefabName + '.prefab');
    const prefabMetaPath = prefabPath + '.meta';
    const existingMeta = tryReadJson(prefabMetaPath);
    const prefabUuid = existingMeta && existingMeta.uuid ? existingMeta.uuid : makeStableUuid(prefabName + ':prefab');
    const prefabJson = buildWoodAuthoringPrefabJson({
      prefabName: prefabName,
      woodType: woodBlueprint.woodType,
      rootSize: woodBlueprint.rootSize || woodBlueprint.woodSpriteSize || { width: 200, height: 68 },
      authoringHostTypeId: authoringHostTypeId
    });

    writeJson(prefabPath, prefabJson);
    writeJson(prefabMetaPath, {
      ver: PREFAB_META_VERSION,
      importer: 'prefab',
      imported: true,
      uuid: prefabUuid,
      files: ['.json'],
      subMetas: {},
      userData: {
        syncNodeName: prefabName
      }
    });

    return {
      woodType: woodBlueprint.woodType,
      prefab: relativeProjectPath(prefabPath),
      meta: relativeProjectPath(prefabMetaPath),
      uuid: prefabUuid
    };
  });

  writeJson(REPORT_PATH, {
    generatedAt: new Date().toISOString(),
    sourceBlueprint: relativeProjectPath(BLUEPRINT_PATH),
    authoringHostTypeId: authoringHostTypeId,
    generated: generated
  });

  console.log('[generate-wood-authoring-prefabs] summary');
  console.log(
    JSON.stringify(
      {
        outputDirectory: relativeProjectPath(OUTPUT_DIRECTORY),
        report: relativeProjectPath(REPORT_PATH),
        generatedCount: generated.length
      },
      null,
      2
    )
  );
  for (const item of generated) {
    console.log('- wood' + item.woodType + ' -> ' + item.prefab);
  }
}

function buildWoodAuthoringPrefabJson(options) {
  const prefabName = options.prefabName;
  const woodType = options.woodType;
  const rootSize = options.rootSize;
  const authoringHostTypeId = options.authoringHostTypeId;

  const rootNodeId = compressUuid(makeStableUuid(prefabName + ':node:root'));
  const transformId = compressUuid(makeStableUuid(prefabName + ':component:transform'));
  const authoringHostId = compressUuid(makeStableUuid(prefabName + ':component:authoring-host'));
  const prefabInfoFileId = 'Node.' + woodType;

  return [
    {
      __type__: 'cc.Prefab',
      _name: prefabName,
      _objFlags: 0,
      _native: '',
      data: {
        __id__: 1
      },
      optimizationPolicy: 0,
      asyncLoadAssets: false
    },
    {
      __type__: 'cc.Node',
      _name: prefabName,
      _objFlags: 0,
      _parent: null,
      _children: [],
      _active: true,
      _components: [
        {
          __id__: 2
        },
        {
          __id__: 3
        }
      ],
      _prefab: {
        __id__: 4
      },
      _lpos: {
        __type__: 'cc.Vec3',
        x: 0,
        y: 0,
        z: 0
      },
      _lrot: {
        __type__: 'cc.Quat',
        x: 0,
        y: 0,
        z: 0,
        w: 1
      },
      _lscale: {
        __type__: 'cc.Vec3',
        x: 1,
        y: 1,
        z: 1
      },
      _layer: 33554432,
      _euler: {
        __type__: 'cc.Vec3',
        x: 0,
        y: 0,
        z: 0
      },
      _id: rootNodeId
    },
    {
      __type__: 'cc.UITransform',
      _name: prefabName + '<UITransform>',
      _objFlags: 0,
      node: {
        __id__: 1
      },
      _enabled: true,
      __prefab: null,
      _contentSize: {
        __type__: 'cc.Size',
        width: rootSize.width,
        height: rootSize.height
      },
      _anchorPoint: {
        __type__: 'cc.Vec2',
        x: 0.5,
        y: 0.5
      },
      _id: transformId
    },
    {
      __type__: authoringHostTypeId,
      _name: '',
      _objFlags: 0,
      node: {
        __id__: 1
      },
      _enabled: true,
      __prefab: null,
      woodType: woodType,
      targetParent: null,
      rebuildOnEnable: true,
      rebuildOnWoodTypeChange: false,
      clearOnDisable: true,
      _id: authoringHostId
    },
    {
      __type__: 'cc.PrefabInfo',
      root: {
        __id__: 1
      },
      asset: {
        __id__: 0
      },
      fileId: prefabInfoFileId
    }
  ];
}

function makeStableUuid(seed) {
  const hex = crypto.createHash('md5').update(String(seed)).digest('hex');
  return (
    hex.slice(0, 8) +
    '-' +
    hex.slice(8, 12) +
    '-' +
    hex.slice(12, 16) +
    '-' +
    hex.slice(16, 20) +
    '-' +
    hex.slice(20, 32)
  );
}

function compressUuid(uuid) {
  const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const hex = String(uuid).replace(/-/g, '');
  let result = hex.slice(0, 5);

  for (let index = 5; index < 32; index += 3) {
    const a = parseInt(hex[index], 16);
    const b = parseInt(hex[index + 1], 16);
    const c = parseInt(hex[index + 2], 16);
    result += BASE64[(a << 2) | (b >> 2)];
    result += BASE64[((b & 3) << 4) | c];
  }

  return result;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function tryReadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readJson(filePath);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function relativeProjectPath(filePath) {
  return path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
}

main();
