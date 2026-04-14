'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_CREATOR_BIN = '/Applications/Cocos/Creator/3.8.7/CocosCreator.app/Contents/MacOS/CocosCreator';
const WECHAT_BUILD_DIR = path.join(PROJECT_ROOT, 'build', 'wechatgame');
const START_SCENE_URL = 'db://assets/scene/LoadScene.scene';
const TEMPLATE_SCENE_PATH =
  '/Applications/Cocos/Creator/3.8.7/CocosCreator.app/Contents/Resources/templates/hello-3d-world/assets/scene/main.scene';
const SCENE_META_VERSION = '1.1.35';
const DIRECTORY_META_VERSION = '1.2.0';

const RUNTIME_COPY_PLAN = Object.freeze([
  { from: 'game.js', to: 'game.js' },
  { from: 'game.json', to: 'game.json' },
  { from: 'app-config.json', to: 'app-config.json' },
  { from: 'project.config.json', to: 'project.config.json' },
  { from: 'project.private.config.json', to: 'project.private.config.json', optional: true },
  { from: 'assets/internal', to: 'assets/internal' },
  { from: 'assets/internalbundle', to: 'assets/internalbundle' },
  { from: 'assets/scene', to: 'assets/scene' },
  { from: 'assets/start-scene', to: 'assets/start-scene' },
  { from: 'assets/start-scenebundle', to: 'assets/start-scenebundle' },
  { from: 'cocos-js', to: 'cocos-js' },
  { from: 'runtime', to: 'runtime' },
  { from: 'src', to: 'src' },
  { from: 'subpackages', to: 'subpackages' },
  { from: 'architecture/boot', to: 'architecture/boot' }
]);

function main() {
  const args = parseArgs(process.argv.slice(2));
  const creatorBin = String(args['creator-bin'] || process.env.COCOS_CREATOR_BIN || DEFAULT_CREATOR_BIN);
  const skipCreatorBuild = isTruthy(args['skip-creator-build']);
  const keepCreatorOutput = isTruthy(args['keep-creator-output']);
  const debugFlag = isTruthy(args.debug) ? 'true' : 'false';

  const sceneInfo = resolveStartSceneInfo();
  ensureCreatorBridgeAssets(sceneInfo);
  ensureSceneEditorProfiles(sceneInfo);

  let creatorResult = null;
  if (!skipCreatorBuild) {
    creatorResult = runCreatorWechatBuild(creatorBin, debugFlag, sceneInfo.sceneUuid);
    validateCreatorOutput(creatorResult);
  }

  const syncSummary = syncRuntimePackageToBuild({
    keepCreatorOutput: keepCreatorOutput
  });

  printSummary({
    creatorBin: creatorBin,
    skipCreatorBuild: skipCreatorBuild,
    creatorStatus: creatorResult ? creatorResult.status : null,
    creatorSignal: creatorResult ? creatorResult.signal : null,
    creatorOutputExists: fs.existsSync(path.join(WECHAT_BUILD_DIR, 'game.js')),
    syncSummary: syncSummary,
    startSceneUuid: sceneInfo.sceneUuid,
    startSceneUrl: START_SCENE_URL
  });
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function isTruthy(value) {
  return value === true || value === 'true' || value === '1';
}

function resolveStartSceneInfo() {
  const startSceneConfigPath = path.join(PROJECT_ROOT, 'assets', 'start-scene', 'config.start-scene.json');
  if (!isFile(startSceneConfigPath)) {
    return {
      sceneUuid: '0590a9ff-4a5a-455b-934f-b5917d49a064'
    };
  }

  let sceneUuid = '0590a9ff-4a5a-455b-934f-b5917d49a064';
  try {
    const config = JSON.parse(fs.readFileSync(startSceneConfigPath, 'utf8'));
    const scenes = config && config.scenes ? config.scenes : {};
    const sceneKey = Object.keys(scenes)[0];
    const sceneIndex = sceneKey ? scenes[sceneKey] : null;
    if (Number.isInteger(sceneIndex) && Array.isArray(config.uuids)) {
      const shortUuid = config.uuids[sceneIndex];
      if (typeof shortUuid === 'string' && shortUuid.length > 0) {
        sceneUuid = decodeUuidLike(shortUuid);
      }
    }
  } catch (_error) {
    sceneUuid = '0590a9ff-4a5a-455b-934f-b5917d49a064';
  }

  return {
    sceneUuid: sceneUuid
  };
}

function ensureCreatorBridgeAssets(sceneInfo) {
  const sceneDirectory = path.join(PROJECT_ROOT, 'assets', 'scene');
  const scenePath = path.join(sceneDirectory, 'LoadScene.scene');
  const sceneMetaPath = scenePath + '.meta';
  const sceneDirectoryMetaPath = sceneDirectory + '.meta';
  const startSceneEntryPath = path.join(PROJECT_ROOT, 'assets', 'start-scene', 'index.start-scene.js');
  const internalEntryPath = path.join(PROJECT_ROOT, 'assets', 'internal', 'index.internal.js');

  fs.mkdirSync(sceneDirectory, { recursive: true });

  if (!isFile(scenePath)) {
    if (!isFile(TEMPLATE_SCENE_PATH)) {
      throw new Error('缺少 Creator 模板场景: ' + TEMPLATE_SCENE_PATH);
    }
    fs.copyFileSync(TEMPLATE_SCENE_PATH, scenePath);
  }

  writeJson(sceneMetaPath, {
    ver: SCENE_META_VERSION,
    importer: 'scene',
    imported: true,
    uuid: sceneInfo.sceneUuid,
    files: ['.json'],
    subMetas: {},
    userData: {}
  });

  if (!isFile(sceneDirectoryMetaPath)) {
    writeJson(sceneDirectoryMetaPath, {
      ver: DIRECTORY_META_VERSION,
      importer: 'directory',
      imported: true,
      uuid: 'f1976d79-2373-4d64-99d0-361f9f4fa8c8',
      files: [],
      subMetas: {},
      userData: {}
    });
  }

  ensureStubScript(startSceneEntryPath);
  ensureStubScript(internalEntryPath);
}

function ensureStubScript(filePath) {
  if (isFile(filePath)) {
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, "'use strict';\n\nmodule.exports = {};\n", 'utf8');
}

function ensureSceneEditorProfiles(sceneInfo) {
  const settingsScenePath = path.join(PROJECT_ROOT, 'settings', 'v2', 'packages', 'scene.json');
  const profilesScenePath = path.join(PROJECT_ROOT, 'profiles', 'v2', 'packages', 'scene.json');

  fs.mkdirSync(path.dirname(settingsScenePath), { recursive: true });
  fs.mkdirSync(path.dirname(profilesScenePath), { recursive: true });

  writeJson(settingsScenePath, {
    __version__: '1.0.0',
    'current-scene': sceneInfo.sceneUuid
  });

  if (!isFile(profilesScenePath)) {
    writeJson(profilesScenePath, {
      'gizmos-infos': {
        is2D: true
      }
    });
  }
}

function runCreatorWechatBuild(creatorBin, debugFlag, startSceneUuid) {
  if (!isFile(creatorBin)) {
    throw new Error('未找到 Cocos Creator 可执行文件: ' + creatorBin);
  }

  const buildArg = 'platform=wechatgame;debug=' + debugFlag + ';startScene=' + startSceneUuid;
  const commandArgs = ['--project', PROJECT_ROOT, '--build', buildArg];

  console.log('[build-cocos-wechat-runtime] run creator build');
  console.log('- bin:', creatorBin);
  console.log('- args:', commandArgs.join(' '));

  return childProcess.spawnSync(creatorBin, commandArgs, {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    encoding: 'utf8'
  });
}

function validateCreatorOutput(creatorResult) {
  const hasBuildOutput = waitForBuildOutput({
    target: path.join(WECHAT_BUILD_DIR, 'game.js'),
    timeoutMs: 5000,
    intervalMs: 200
  });
  const statusCode = creatorResult && typeof creatorResult.status === 'number' ? creatorResult.status : null;
  const allowNonZeroWithOutput = hasBuildOutput && (statusCode === 35 || statusCode === 36 || statusCode === 37);

  if ((statusCode === 0 && hasBuildOutput) || allowNonZeroWithOutput) {
    if (statusCode !== 0) {
      console.warn(
        '[build-cocos-wechat-runtime] Creator 返回状态码',
        statusCode,
        '但检测到构建产物已生成，视为可接受（常见于网络/登录超时）。signal=',
        creatorResult ? creatorResult.signal : null
      );
    }
    return;
  }
  if (hasBuildOutput) {
    console.warn(
      '[build-cocos-wechat-runtime] Creator 返回非零状态，但构建产物存在，继续执行运行时同步。status=',
      statusCode,
      'signal=',
      creatorResult ? creatorResult.signal : null
    );
    return;
  }
  throw new Error(
    'Creator 构建失败，且未找到输出目录: build/wechatgame (status=' +
      String(statusCode) +
      ', signal=' +
      String(creatorResult ? creatorResult.signal : null) +
      ')'
  );
}

function waitForBuildOutput(options) {
  const target = options && options.target ? String(options.target) : null;
  const timeoutMs = options && options.timeoutMs ? Number(options.timeoutMs) : 0;
  const intervalMs = options && options.intervalMs ? Number(options.intervalMs) : 200;
  if (!target) {
    return false;
  }

  const deadline = Date.now() + Math.max(0, timeoutMs);
  while (Date.now() <= deadline) {
    if (isFile(target)) {
      return true;
    }
    if (Date.now() + intervalMs > deadline) {
      break;
    }
    // avoid busy loop; Atomics.wait gives us a cheap synchronous sleep
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, intervalMs);
  }
  return isFile(target);
}

function syncRuntimePackageToBuild(options) {
  const keepCreatorOutput = !!(options && options.keepCreatorOutput);

  if (!keepCreatorOutput && fs.existsSync(WECHAT_BUILD_DIR)) {
    fs.rmSync(WECHAT_BUILD_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(WECHAT_BUILD_DIR, { recursive: true });

  const copied = [];
  for (const item of RUNTIME_COPY_PLAN) {
    const fromPath = path.join(PROJECT_ROOT, item.from);
    if (!fs.existsSync(fromPath)) {
      if (item.optional) {
        continue;
      }
      throw new Error('运行时同步缺少源路径: ' + item.from);
    }

    const targetPath = path.join(WECHAT_BUILD_DIR, item.to);
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }

    if (isDirectory(fromPath)) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.cpSync(fromPath, targetPath, { recursive: true, force: true });
    } else {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(fromPath, targetPath);
    }
    copied.push(item.to);
  }

  return {
    target: relativeProjectPath(WECHAT_BUILD_DIR),
    copiedCount: copied.length,
    copied: copied
  };
}

function decodeUuidLike(rawValue) {
  const BASE64_MAP = Object.fromEntries(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      .split('')
      .map(function toMap(char, index) {
        return [char, index];
      })
  );
  const HEX_CHARS = '0123456789abcdef';

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

  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function relativeProjectPath(targetPath) {
  return path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/');
}

function isDirectory(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory();
}

function isFile(targetPath) {
  return fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();
}

function printSummary(summary) {
  console.log('[build-cocos-wechat-runtime] summary');
  console.log(
    JSON.stringify(
      {
        creatorBin: summary.creatorBin,
        skipCreatorBuild: summary.skipCreatorBuild,
        creatorStatus: summary.creatorStatus,
        creatorSignal: summary.creatorSignal,
        creatorOutputExists: summary.creatorOutputExists,
        startSceneUrl: summary.startSceneUrl,
        startSceneUuid: summary.startSceneUuid,
        sync: summary.syncSummary
      },
      null,
      2
    )
  );
}

main();
