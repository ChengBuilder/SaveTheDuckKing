'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveProjectLayout,
  resolveProjectFilePath,
  formatProjectPathFromWorkspace,
  normalizePath
} = require('./project-paths');

const REQUIRED_ROOT_FILES = Object.freeze([
  'game.js',
  'game.json',
  'project.config.json',
  'app-config.json',
  'src/runtime-settings.json'
]);

const REQUIRED_EMBEDDED_ENTRY_MODULES = Object.freeze([
  'application-main.js',
  'engine-adapter.js',
  'first-screen.js',
  'subpackages-bootstrap.js',
  'web-adapter.js'
]);
const SPLIT_MANIFEST_SCRIPT_RELATIVE_PATH = 'runtime/gamejs-modules/manifest.js';
const SPLIT_MANIFEST_JSON_RELATIVE_PATH = 'runtime/gamejs-modules/manifest.json';

const REQUIRED_ROOT_DIRECTORIES = Object.freeze([
  'architecture',
  'assets',
  'cocos-js',
  'subpackages'
]);

const REQUIRED_ROOT_BUNDLES = Object.freeze([
  'assets/internal',
  'assets/start-scene',
  'assets/internalbundle',
  'assets/start-scenebundle'
]);
const REQUIRED_CANONICAL_ROOT_BUNDLES = Object.freeze([
  'assets/internal',
  'assets/start-scene'
]);
const REQUIRED_ROOT_BUNDLE_SHELLS = Object.freeze([
  'assets/internalbundle',
  'assets/start-scenebundle'
]);
const ALLOWED_ASSETS_ROOT_DIRECTORIES = Object.freeze(
  REQUIRED_CANONICAL_ROOT_BUNDLES.concat(REQUIRED_ROOT_BUNDLE_SHELLS, ['assets/scene'])
);
const THIN_SHELL_ALLOWED_FILES = Object.freeze([
  'config.json',
  'index.js',
  'config.json.meta',
  'index.js.meta'
]);

/**
 * 校验当前仓库是否仍符合微信小游戏可运行项目结构。
 * 目标：把“解包后可运行”这件事沉淀成护栏，而不是靠经验记忆。
 */
function verifyWechatMinigameStructure() {
  const layout = resolveProjectLayout(__dirname);
  const errors = [];

  assertRootEntries(layout, errors);

  const gameConfig = readJson(layout, 'game.json', errors);
  const projectConfig = readJson(layout, 'project.config.json', errors);
  const appConfig = readJson(layout, 'app-config.json', errors);

  if (gameConfig) {
    verifyGameJson(gameConfig, layout, errors);
  }
  if (projectConfig) {
    verifyProjectConfig(projectConfig, errors);
  }
  if (gameConfig && appConfig) {
    verifyAppConfig(gameConfig, appConfig, errors);
  }

  if (errors.length > 0) {
    console.error('[verify-wechat-minigame-structure] 失败：');
    for (const error of errors) {
      console.error('- ' + error);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[verify-wechat-minigame-structure] 通过');
}

/**
 * 校验根目录必要文件与目录。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string[]} errors 错误收集器
 */
function assertRootEntries(layout, errors) {
  for (const relativePath of REQUIRED_ROOT_FILES) {
    assertFileExists(layout, relativePath, errors, '缺少微信小游戏根文件');
  }

  assertEmbeddedEntryModules(layout, errors);

  for (const relativePath of REQUIRED_ROOT_DIRECTORIES) {
    assertDirectoryExists(layout, relativePath, errors, '缺少微信小游戏根目录');
  }

  for (const relativePath of REQUIRED_ROOT_BUNDLES) {
    assertDirectoryExists(layout, relativePath, errors, '缺少 root bundle 目录');
    assertFileExists(layout, relativePath + '/index.js', errors, 'root bundle 缺少 index.js');
    if (relativePath === 'assets/internal' || relativePath === 'assets/start-scene') {
      assertSemanticConfigFileExists(layout, relativePath, errors);
    } else {
      assertFileExists(layout, relativePath + '/config.json', errors, '兼容 root bundle 缺少 config.json');
    }
  }

  verifyAssetsRootLayout(layout, errors);
}

/**
 * 校验 `game.js` 中是否保留了解包产物依赖的内嵌虚拟启动模块。
 * 这些模块在当前仓库不是独立根文件，而是通过 `define("*.js", ...)` 注入。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string[]} errors 错误收集器
 */
function assertEmbeddedEntryModules(layout, errors) {
  const gameScriptPath = resolveProjectFilePath(layout, 'game.js');
  if (!fs.existsSync(gameScriptPath) || !fs.statSync(gameScriptPath).isFile()) {
    return;
  }

  let gameScriptContent = '';
  try {
    gameScriptContent = fs.readFileSync(gameScriptPath, 'utf8');
  } catch (error) {
    errors.push('读取小游戏入口失败: ' + formatProjectPathFromWorkspace(layout, 'game.js') + ' -> ' + error.message);
    return;
  }

  if (isSplitEntryMode(gameScriptContent)) {
    assertSplitEntryModules(layout, errors);
    return;
  }

  for (const moduleName of REQUIRED_EMBEDDED_ENTRY_MODULES) {
    if (!hasEmbeddedDefineModule(gameScriptContent, moduleName)) {
      errors.push('game.js 缺少内嵌启动模块 define: ' + moduleName);
    }
  }
}

/**
 * 校验 game.json 的关键字段与分包结构。
 * @param {Record<string, any>} gameConfig game.json 内容
 * @param {{projectRoot: string}} layout 项目布局
 * @param {string[]} errors 错误收集器
 */
function verifyGameJson(gameConfig, layout, errors) {
  if (gameConfig.deviceOrientation !== 'portrait' && gameConfig.deviceOrientation !== 'landscape') {
    errors.push('game.json.deviceOrientation 必须是 `portrait` 或 `landscape`');
  }

  const subPackages = normalizeSubpackageList(gameConfig.subPackages);
  const subpackages = normalizeSubpackageList(gameConfig.subpackages);

  if (subPackages.length === 0 && subpackages.length === 0) {
    errors.push('game.json 缺少分包声明（subPackages / subpackages）');
    return;
  }

  if (subPackages.length > 0 && subpackages.length > 0) {
    const left = JSON.stringify(subPackages);
    const right = JSON.stringify(subpackages);
    if (left !== right) {
      errors.push('game.json 的 subPackages 与 subpackages 不一致');
    }
  }

  const effectiveSubpackages = subPackages.length > 0 ? subPackages : subpackages;
  const seenNames = new Set();
  const seenRoots = new Set();

  for (const subpackage of effectiveSubpackages) {
    if (!subpackage.name || !subpackage.root) {
      errors.push('game.json 分包声明缺少 name/root: ' + JSON.stringify(subpackage));
      continue;
    }

    if (seenNames.has(subpackage.name)) {
      errors.push('game.json 存在重复分包名: ' + subpackage.name);
    }
    seenNames.add(subpackage.name);

    if (seenRoots.has(subpackage.root)) {
      errors.push('game.json 存在重复分包根目录: ' + subpackage.root);
    }
    seenRoots.add(subpackage.root);

    verifySubpackageDirectory(layout, subpackage.root, subpackage.name, errors);
  }
}

/**
 * 校验 project.config.json 是否仍指向小游戏编译形态。
 * @param {Record<string, any>} projectConfig project.config.json 内容
 * @param {string[]} errors 错误收集器
 */
function verifyProjectConfig(projectConfig, errors) {
  if (projectConfig.compileType !== 'game') {
    errors.push('project.config.json.compileType 必须为 `game`');
  }
  if (projectConfig.simulatorType !== 'game') {
    errors.push('project.config.json.simulatorType 必须为 `game`');
  }
}

/**
 * 校验 app-config.json 是否与当前小游戏配置一致。
 * @param {Record<string, any>} gameConfig game.json 内容
 * @param {Record<string, any>} appConfig app-config.json 内容
 * @param {string[]} errors 错误收集器
 */
function verifyAppConfig(gameConfig, appConfig, errors) {
  if (typeof appConfig.__warning__ === 'string' && appConfig.__warning__.length > 0) {
    errors.push('app-config.json 仍含微信小游戏无效字段警告: ' + appConfig.__warning__);
  }

  if (Object.prototype.hasOwnProperty.call(appConfig, 'iOSHighPerformance')) {
    errors.push('app-config.json 不应保留无效字段 `iOSHighPerformance`');
  }
  if (Object.prototype.hasOwnProperty.call(appConfig, 'iOSHighPerformance+')) {
    errors.push('app-config.json 不应保留无效字段 `iOSHighPerformance+`');
  }

  if (gameConfig.deviceOrientation !== appConfig.deviceOrientation) {
    errors.push('app-config.json.deviceOrientation 与 game.json 不一致');
  }

  const gameSubpackages = normalizeSubpackageList(gameConfig.subPackages);
  const appSubpackages = normalizeSubpackageList(appConfig.subPackages);
  if (gameSubpackages.length > 0 && JSON.stringify(gameSubpackages) !== JSON.stringify(appSubpackages)) {
    errors.push('app-config.json.subPackages 与 game.json.subPackages 不一致');
  }
}

/**
 * 校验单个分包目录的必要结构。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} subpackageRoot 分包根目录
 * @param {string} subpackageName 分包名
 * @param {string[]} errors 错误收集器
 */
function verifySubpackageDirectory(layout, subpackageRoot, subpackageName, errors) {
  const normalizedRoot = trimTrailingSlash(normalizePath(subpackageRoot));
  assertDirectoryExists(layout, normalizedRoot, errors, '分包目录不存在');
  assertFileExists(layout, normalizedRoot + '/game.js', errors, '分包缺少 game.js');
  assertDirectoryExists(layout, normalizedRoot + '/import', errors, '分包缺少 import 目录');
  assertDirectoryExists(layout, normalizedRoot + '/native', errors, '分包缺少 native 目录');

  const absoluteDirectoryPath = resolveProjectFilePath(layout, normalizedRoot);
  const directoryEntries = fs.existsSync(absoluteDirectoryPath)
    ? fs.readdirSync(absoluteDirectoryPath, { withFileTypes: true })
    : [];
  const configFileNames = directoryEntries
    .filter(function filterConfig(entry) {
      return entry.isFile() && /^config\.[a-z0-9-]+\.json$/i.test(entry.name);
    })
    .map(function mapConfig(entry) {
      return entry.name;
    });

  if (configFileNames.length === 0) {
    errors.push('分包缺少语义化配置文件: ' + subpackageName + ' -> ' + formatProjectPathFromWorkspace(layout, normalizedRoot));
  }
}

/**
 * 校验 assets 根目录是否仍符合“canonical 根 bundle + 最小历史命名薄壳”的约束。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string[]} errors 错误收集器
 */
function verifyAssetsRootLayout(layout, errors) {
  const assetsRootPath = resolveProjectFilePath(layout, 'assets');
  if (!fs.existsSync(assetsRootPath)) {
    return;
  }

  const rootEntries = fs.readdirSync(assetsRootPath, { withFileTypes: true });
  const unexpectedDirectories = rootEntries
    .filter(function filterDirectory(entry) {
      return entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        ALLOWED_ASSETS_ROOT_DIRECTORIES.indexOf('assets/' + entry.name) === -1;
    })
    .map(function mapDirectory(entry) {
      return 'assets/' + entry.name;
    })
    .sort(function sortPath(left, right) {
      return left.localeCompare(right);
    });

  if (unexpectedDirectories.length > 0) {
    errors.push(
      'assets 根目录存在未批准的 bundle 或兼容目录: ' +
      unexpectedDirectories.map(function formatPath(relativePath) {
        return formatProjectPathFromWorkspace(layout, relativePath);
      }).join(', ')
    );
  }

  for (const relativePath of REQUIRED_ROOT_BUNDLE_SHELLS) {
    verifyThinShellRootBundle(layout, relativePath, errors);
  }
}

/**
 * 校验 root 历史命名 bundle 是否仍保持“只含 config/index 的薄壳”。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} relativePath 相对目录路径
 * @param {string[]} errors 错误收集器
 */
function verifyThinShellRootBundle(layout, relativePath, errors) {
  const absolutePath = resolveProjectFilePath(layout, relativePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isDirectory()) {
    return;
  }

  const unexpectedEntries = fs.readdirSync(absolutePath, { withFileTypes: true })
    .filter(function filterEntry(entry) {
      if (entry.name.startsWith('.')) {
        return false;
      }

      if (entry.isDirectory()) {
        return true;
      }

      if (entry.name.endsWith('.meta')) {
        return false;
      }

      return !entry.isFile() || THIN_SHELL_ALLOWED_FILES.indexOf(entry.name) === -1;
    })
    .map(function mapEntry(entry) {
      return normalizePath(path.join(relativePath, entry.name));
    })
    .sort(function sortPath(left, right) {
      return left.localeCompare(right);
    });

  if (unexpectedEntries.length > 0) {
    errors.push(
      '兼容 root bundle 必须保持薄壳目录（仅允许 config.json / index.js）: ' +
      unexpectedEntries.map(function formatPath(relativeEntryPath) {
        return formatProjectPathFromWorkspace(layout, relativeEntryPath);
      }).join(', ')
    );
  }
}

/**
 * 读取 JSON 文件；读取失败时记录错误。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} relativePath 相对路径
 * @param {string[]} errors 错误收集器
 * @returns {Record<string, any> | null}
 */
function readJson(layout, relativePath, errors) {
  const absolutePath = resolveProjectFilePath(layout, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    errors.push('读取 JSON 失败: ' + formatProjectPathFromWorkspace(layout, relativePath) + ' -> ' + error.message);
    return null;
  }
}

/**
 * 归一化分包声明列表，便于做一致性比较。
 * @param {any} subpackageList 原始分包数组
 * @returns {{name: string, root: string}[]}
 */
function normalizeSubpackageList(subpackageList) {
  if (!Array.isArray(subpackageList)) {
    return [];
  }

  return subpackageList.map(function mapSubpackage(item) {
    return {
      name: String(item && item.name ? item.name : ''),
      root: ensureTrailingSlash(normalizePath(item && item.root ? item.root : ''))
    };
  });
}

/**
 * 校验目录下存在语义化 config 文件。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} relativeDirectoryPath 目录路径
 * @param {string[]} errors 错误收集器
 */
function assertSemanticConfigFileExists(layout, relativeDirectoryPath, errors) {
  const absoluteDirectoryPath = resolveProjectFilePath(layout, relativeDirectoryPath);
  if (!fs.existsSync(absoluteDirectoryPath)) {
    return;
  }

  const hasConfigFile = fs.readdirSync(absoluteDirectoryPath).some(function someFile(fileName) {
    return /^config\.[a-z0-9-]+\.json$/i.test(fileName);
  });

  if (!hasConfigFile) {
    errors.push('目录缺少语义化配置文件: ' + formatProjectPathFromWorkspace(layout, relativeDirectoryPath));
  }
}

/**
 * 断言文件存在。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} relativePath 相对路径
 * @param {string[]} errors 错误收集器
 * @param {string} message 错误前缀
 */
function assertFileExists(layout, relativePath, errors, message) {
  const absolutePath = resolveProjectFilePath(layout, relativePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    errors.push(message + ': ' + formatProjectPathFromWorkspace(layout, relativePath));
  }
}

/**
 * 断言目录存在。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string} relativePath 相对路径
 * @param {string[]} errors 错误收集器
 * @param {string} message 错误前缀
 */
function assertDirectoryExists(layout, relativePath, errors, message) {
  const absolutePath = resolveProjectFilePath(layout, relativePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isDirectory()) {
    errors.push(message + ': ' + formatProjectPathFromWorkspace(layout, relativePath));
  }
}

/**
 * 判断入口脚本中是否存在指定虚拟模块定义。
 * @param {string} scriptContent 脚本内容
 * @param {string} moduleName 模块名
 * @returns {boolean}
 */
function hasEmbeddedDefineModule(scriptContent, moduleName) {
  return scriptContent.includes('define("' + moduleName + '"');
}

/**
 * 判断当前入口是否采用“瘦入口 + runtime/gamejs-modules”模式。
 * @param {string} scriptContent 脚本内容
 * @returns {boolean}
 */
function isSplitEntryMode(scriptContent) {
  return scriptContent.includes('runtime/gamejs-modules/manifest.js');
}

/**
 * 校验拆分入口模式下的模块清单。
 * @param {{projectRoot: string, projectPathFromWorkspace: string}} layout 项目布局
 * @param {string[]} errors 错误收集器
 */
function assertSplitEntryModules(layout, errors) {
  assertFileExists(layout, SPLIT_MANIFEST_SCRIPT_RELATIVE_PATH, errors, '拆分入口缺少模块清单脚本');
  assertFileExists(layout, SPLIT_MANIFEST_JSON_RELATIVE_PATH, errors, '拆分入口缺少模块清单索引');

  const manifestPath = resolveProjectFilePath(layout, SPLIT_MANIFEST_JSON_RELATIVE_PATH);
  if (!fs.existsSync(manifestPath) || !fs.statSync(manifestPath).isFile()) {
    return;
  }

  let manifest = null;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    errors.push(
      '读取拆分入口 manifest 失败: ' +
      formatProjectPathFromWorkspace(layout, SPLIT_MANIFEST_JSON_RELATIVE_PATH) +
      ' -> ' + error.message
    );
    return;
  }

  if (!Array.isArray(manifest) || manifest.length === 0) {
    errors.push('拆分入口模块清单为空: ' + formatProjectPathFromWorkspace(layout, SPLIT_MANIFEST_JSON_RELATIVE_PATH));
    return;
  }

  const moduleIdSet = new Set(
    manifest.map(function mapEntry(entry) {
      return normalizePath(entry && entry.moduleId ? entry.moduleId : '');
    }).filter(Boolean)
  );

  if (!moduleIdSet.has('game.js')) {
    errors.push('拆分入口模块清单缺少启动模块: game.js');
  }

  for (const moduleName of REQUIRED_EMBEDDED_ENTRY_MODULES) {
    if (!moduleIdSet.has(moduleName)) {
      errors.push('拆分入口模块清单缺少启动模块: ' + moduleName);
    }
  }
}

/**
 * 为分包目录路径补尾斜杠。
 * @param {string} targetPath 目录路径
 * @returns {string}
 */
function ensureTrailingSlash(targetPath) {
  return targetPath.endsWith('/') ? targetPath : targetPath + '/';
}

/**
 * 去掉目录路径末尾斜杠。
 * @param {string} targetPath 目录路径
 * @returns {string}
 */
function trimTrailingSlash(targetPath) {
  return targetPath.endsWith('/') ? targetPath.slice(0, -1) : targetPath;
}

verifyWechatMinigameStructure();
