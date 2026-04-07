"use strict";

const fs = require("fs");
const path = require("path");
const { generateReadableProject } = require("./readable_project_tools");

const rootDir = path.resolve(__dirname, "..");
const unpackedDir = path.join(rootDir, "project_bundle", "unpacked_by_pkg");
const outputDir = path.join(rootDir, "runnable_wechat_project");
const readableOutputDir = path.join(rootDir, "readable_project");
const targetAppId = process.env.WECHAT_APPID || "wxf5df710b4d8b61af";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDirContents(srcDir, destDir) {
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirContents(srcPath, destPath);
    } else if (entry.isFile()) {
      ensureDir(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function normalizeRootPath(rootPath) {
  return String(rootPath || "").replace(/^\/+/, "");
}

function extractSubpackageDefineBody(bundleName, text) {
  const escapedBundleName = bundleName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `define\\("subpackages/${escapedBundleName}/game\\.js", function\\(require, module, exports\\)\\{\\s*([\\s\\S]*?)\\s*\\}\\);\\s*require\\("subpackages/${escapedBundleName}/game\\.js"\\);`
  );
  const match = text.match(pattern);
  if (!match) {
    throw new Error(`Failed to extract subpackage bootstrap body: ${bundleName}`);
  }
  return match[1].trim();
}

function buildSubpackageBootstrapModule(baseDir) {
  const subpackagesDir = path.join(baseDir, "subpackages");
  if (!fs.existsSync(subpackagesDir)) {
    return "";
  }

  const bundleNames = fs.readdirSync(subpackagesDir)
    .filter((name) => fs.existsSync(path.join(subpackagesDir, name, "game.js")))
    .sort((left, right) => {
      if (left === "resources") {
        return 1;
      }
      if (right === "resources") {
        return -1;
      }
      return left.localeCompare(right);
    });

  const moduleBodies = bundleNames.map((bundleName) => {
    const gameFile = path.join(subpackagesDir, bundleName, "game.js");
    const text = fs.readFileSync(gameFile, "utf8");
    const body = extractSubpackageDefineBody(bundleName, text);
    return `\n(function(){\n${body}\n})();`;
  });

  return (
    `define("subpackages-bootstrap.js", function(require, module, exports){\n` +
    `"use strict";${moduleBodies.join("\n")}\n` +
    `});\n`
  );
}

function replacePattern(text, pattern, replacement, label) {
  const updated = text.replace(pattern, replacement);
  if (updated === text) {
    throw new Error(`Failed to patch ${label}`);
  }
  return updated;
}

function patchMainBundle(baseDir) {
  const gameFile = path.join(baseDir, "game.js");
  if (!fs.existsSync(gameFile)) {
    return;
  }

  let text = fs.readFileSync(gameFile, "utf8");
  const subpackageBootstrapModule = buildSubpackageBootstrapModule(baseDir);

  // In WeChat DevTools, TooYue login may hang or reject. Fall back quickly.
  text = replacePattern(
    text,
    /o\.loginTooYue=function\(\)\{[\s\S]*?\}\}\(\)(?=,o\.showVideoAd=function)/,
    `o.loginTooYue=function(){var e=n(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a.instance.releaseType==s.test_TEST){e.next=11;break}return e.prev=1,e.next=4,Promise.race([d.login(),new Promise((function(e){setTimeout((function(){console.warn("途悦登录超时，跳过登录");e(null)}),1500)}))]);case 4:return t=e.sent,e.abrupt("return",(console.log("途悦登录结果",t),t));case 8:return e.prev=8,e.t0=e.catch(1),console.error("途悦登录失败.err="+e.t0),e.abrupt("return",null);case 11:case"end":return e.stop()}}),e,null,[[1,8]])})));return function(){return e.apply(this,arguments)}}()`,
    "TooYue login"
  );

  // User archive fetch must never stall the loading scene; use local fallback.
  text = replacePattern(
    text,
    /o\.getUserStorage=function\(\)\{[\s\S]*?\}\}\(\)(?=,o\.setUserStorageDefault=function)/,
    `o.getUserStorage=function(){var e=n(i().mark((function e(t){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(void 0===t&&(t="default"),Promise.race([new Promise(n(i().mark((function e(n,o){var r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,d.getUserArchive({name:t});case 3:return r=e.sent,0===r.updatedAt&&0===Object.keys(r.data).length?(console.log("不存在的存档"),e.abrupt("return",n({exists:!1,data:{}}))):e.abrupt("return",n({exists:!0,data:r.data}));case 7:return e.prev=7,e.t0=e.catch(0),console.log("获取用户存档错误: "+((null==e.t0?void 0:e.t0.errMsg)||e.t0)),e.abrupt("return",n({exists:!1,data:{}}));case 11:case"end":return e.stop()}}),e,null,[[0,7]])})))),new Promise((function(e){setTimeout((function(){console.warn("获取用户存档超时，使用本地存档继续");e({exists:!1,data:{}})}),1500)}))]));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()`,
    "TooYue user storage"
  );

  // Dynamic config should degrade gracefully in local debugging.
  text = replacePattern(
    text,
    /o\.getDynamicConfig=function\(\)\{[\s\S]*?\}\}\(\)(?=,t\(e,null,\[\{key:"_ins")/,
    `o.getDynamicConfig=function(){var e=n(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a.instance.releaseType==s.test_TEST){e.next=11;break}return e.prev=1,e.next=4,Promise.race([d.dynamicConfig(),new Promise((function(e){setTimeout((function(){console.warn("获取动态配置超时，使用默认配置");e(null)}),1500)}))]);case 4:return t=e.sent,e.abrupt("return",(console.log("获取动态配置",t),t&&(this.shareTimesDay=Number(t.share_times_day)||0,this.shareGift=Number(t.share_gift)||0),t));case 8:return e.prev=8,e.t0=e.catch(1),console.warn("获取动态配置失败",e.t0),e.abrupt("return",null);case 11:case"end":return e.stop()}}),e,this,[[1,8]])})));return function(){return e.apply(this,arguments)}}()`,
    "TooYue dynamic config"
  );

  // Feedback icon lookup should never crash the boot path.
  text = replacePattern(
    text,
    /o\.checkFeedBack=function\(\)\{[\s\S]*?\}(?=,o\.feedBackMessage=function)/,
    `o.checkFeedBack=function(){try{var e=d.checkFeedback().showFeedback;this.isNeedReportStage=e,console.log("是否展示反馈图标",e)}catch(e){this.isNeedReportStage=!1,console.warn("检查反馈图标失败",e)}}`,
    "TooYue feedback"
  );

  // DevTools often cannot complete third-party SDK init. Skip it there and
  // keep the game boot path on local data/debug-safe behavior.
  text = replacePattern(
    text,
    /TooYueInit=function\(\)\{[\s\S]*?\}\}\(\)(?=,s\.judgeCurPlatform=function)/,
    `TooYueInit=function(){var e=a(i().mark((function e(){var t,n,o,r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("TooYueInit"),r=!1,e.prev=2,"undefined"!=typeof wx&&wx.getSystemInfoSync)try{r="devtools"===wx.getSystemInfoSync().platform}catch(e){console.warn("读取微信环境失败，继续使用默认启动流程",e)}if(!r){e.next=8;break}return console.warn("检测到微信开发者工具，跳过 TooYue 第三方初始化"),this.getServerData(),e.abrupt("return",null);case 8:if("JJWY"!=N.GameId){e.next=21;break}if(N.instance.releaseType!=T.applet_ziJie){e.next=15;break}return e.next=13,I._ins.initTooYue("ttjjwy","ttdb46adfb445c4cf702");case 13:e.next=19;break;case 15:if(e.t0=N.instance.releaseType==T.applet_wechat,!e.t0){e.next=19;break}return e.next=19,I._ins.initTooYue("wxjjwy","wx244b1cb66c8ac4b4");case 19:e.next=25;break;case 21:if(e.t1="ZGBJD"==N.GameId,!e.t1){e.next=25;break}return e.next=25,I._ins.initTooYue("ttzgbjdty","ttf527839a6a11248902");case 25:return console.log("TooYueLogin"),e.prev=26,e.next=29,I._ins.loginTooYue();case 29:return(t=e.sent)&&(I.userMsg=t,I.shortId=t.shortId,I.shareUserCount=t.shareUserCount),console.log("checkFollowAwemeState"),e.next=34,F._ins.checkFollowAwemeState();case 34:return this.getServerData(),e.next=37,I._ins.checkSidebarStatus();case 37:return n=e.sent,N.SideState=n,e.next=41,I._ins.checkAddDesktopState();case 41:return o=e.sent,N.AddDesktopState=o,e.next=45,I._ins.getDynamicConfig();case 45:return I._ins.checkFeedBack(),F._ins.getSystemInfoSync(),F._ins.checkGroupInfo(),I._ins.onShareAppMessage(),I._ins.onShareTimeline(),e.abrupt("return",null);case 49:return e.prev=49,e.t2=e.catch(26),console.warn("TooYueInit 失败，使用本地调试兜底继续",e.t2),this.getServerData(),e.abrupt("return",null);case 53:case"end":return e.stop()}}),e,this,[[26,49]])})));return function(){return e.apply(this,arguments)}}()`,
    "LoadScene TooYueInit"
  );

  text = replacePattern(
    text,
    /System\.register\("chunks:\/\/\/_virtual\/TooYueManager\.ts"[\s\S]*?(?=,System\.register\("chunks:\/\/\/_virtual\/tysdk\.js")/,
    `System.register("chunks:///_virtual/TooYueManager.ts",[],(function(e){return{execute:function(){var t=function(){function e(){this.templateId=[],this.templateId_2=[],this.isNeedReportStage=!1,this.shareTimesDay=0,this.shareGift=0}var t=e.prototype;return t.initTooYue=function(){},t.loginTooYue=function(){return Promise.resolve(null)},t.showVideoAd=function(e,t,n){return t&&t({isEnded:!0}),Promise.resolve({isEnded:!0})},t.showInterstitialAd=function(){},t.shareApp=function(e,t,n,i){return n&&n(),Promise.resolve(null)},t.onShareAppMessage=function(){},t.onShareTimeline=function(){},t.getRecordState=function(){return null},t.startRecordVideo=function(){},t.stopRecordVideo=function(){return Promise.resolve(null)},t.stopAndShareRecord=function(){return Promise.resolve(null)},t.TrackEvent=function(){},t.reportStage=function(){},t.checkFeedBack=function(){this.isNeedReportStage=!1},t.feedBackMessage=function(){return Promise.resolve(null)},t.getUserStorage=function(){return Promise.resolve({exists:!1,data:{}})},t.setUserStorageDefault=function(){return Promise.resolve(!0)},t.setUserStorage=function(){return Promise.resolve(null)},t.checkSidebarStatus=function(){return Promise.resolve({isShowEntry:!1,isShowGiftBagBtn:!1,isShowNavigateBtn:!1,isFromSideBar:!1})},t.navigateToSideBar=function(){return Promise.resolve(null)},t.onSideBarStateChange=function(){},t.receiveSideBarReward=function(){return Promise.resolve(null)},t.checkAddDesktopState=function(){return Promise.resolve({exist:!1,needUpdate:!1})},t.addDesktop=function(e,t){return e&&e(),Promise.resolve(null)},t.SubscribeMessage=function(){return Promise.resolve(null)},t.checkSubscribeMessage=function(){return Promise.resolve(!1)},t.judgeIsFromFeed=function(){return!1},t.judgeIsFromWhichFeedOrSubscribe=function(){return 0},t.judgeIsFromSubscribe=function(){return!1},t.getDynamicConfig=function(){return Promise.resolve(null)},e}();t._instance=new t,t.shortId="",t.userMsg=null,t.subscribeMessage=!1,t.feedSubscribeStatus=!1,t.startGameScene=null,t.shareUserCount=50,t.isFromFeed=!1,t.isFollowAweme=!1,t.isFromSubscribe=!1,t.sub_Content_id="",t.sub_Content_id_ZGBJD="",t.sub_Next_Content_id_1="",t.sub_Next_Content_id_2="",t.sub_Next_Content_id_3="",t.sub_Next_Content_id_4="",t.sub_Next_Content_id_5="",t.sub_Next_Content_id_6="",t.sub_Next_Content_id_ZGBJD="",Object.defineProperty(t,"_ins",{get:function(){return this._instance}}),e("TooYueManager",t)}}}))`,
    "TooYueManager stub"
  );

  // The bundled TooYue SDK payload is malformed after export. Replace it with
  // a debug-safe stub so the main bundle remains syntactically valid.
  text = replacePattern(
    text,
    /System\.register\("chunks:\/\/\/_virtual\/tysdk\.js"[\s\S]*?(?=,System\.register\("chunks:\/\/\/_virtual\/tysdk\.mjs_cjs=&original=.js")/,
    `System.register("chunks:///_virtual/tysdk.js",[],(function(e){return{execute:function(){e("default",{init:function(){},login:function(){return Promise.resolve(null)},showVideoAd:function(){return Promise.resolve({isEnded:!1})},showInterstitialAd:function(){},shareAppMessage:function(){return Promise.resolve(null)},onShareAppMessage:function(){},onShareTimeline:function(){},getRecorderAndState:function(){return null},startRecorder:function(){},stopRecorder:function(){return Promise.resolve(null)},stopRecorderAndShare:function(){return Promise.resolve(null)},customTrack:function(){},reportStage:function(){},checkFeedback:function(){return{showFeedback:!1}},feedbackMessage:function(){return Promise.resolve(null)},getUserArchive:function(){return Promise.resolve({updatedAt:0,data:{}})},setUserArchiveDefault:function(){return Promise.resolve(null)},setUserArchive:function(){return Promise.resolve(null)},checkSideBarState:function(){return Promise.resolve({isShowEntry:!1,isShowGiftBagBtn:!1,isShowNavigateBtn:!1})},navigateToSideBar:function(){return Promise.resolve(null)},onSideBarStateChange:function(){},receiveSideBarReward:function(){return Promise.resolve(null)},checkShortcut:function(){return Promise.resolve({exist:!1,needUpdate:!1})},addShortcut:function(){return Promise.resolve(null)},requestSubscribeMessage:function(){return Promise.resolve(null)},checkSubscribeMessage:function(){return Promise.resolve({existNames:[]})},dynamicConfig:function(){return Promise.resolve(null)}})}}}))`,
    "tysdk.js stub"
  );

  text = replacePattern(
    text,
    /System\.register\("chunks:\/\/\/_virtual\/tysdk\.mjs_cjs=&original=.js"[\s\S]*?(?=,System\.register\("chunks:\/\/\/_virtual\/Util\.ts")/,
    `System.register("chunks:///_virtual/tysdk.mjs_cjs=&original=.js",[],(function(){return{execute:function(){}}}))`,
    "tysdk.mjs stub"
  );

  text = replacePattern(
    text,
    /System\.register\("chunks:\/\/\/_virtual\/cjs-loader\.mjs"[\s\S]*?(?=,System\.register\("chunks:\/\/\/_virtual\/env")/,
    `System.register("chunks:///_virtual/cjs-loader.mjs",[],(function(e){return{execute:function(){e("default",{define:function(){},require:function(){return{}},throwInvalidWrapper:function(){},_registry:{},_moduleCache:{}})}}}))`,
    "cjs-loader stub"
  );

  // Some exported scripts preserve inline source comments inside one-line
  // minified bundles, which breaks parsing by commenting out the rest of the
  // line. Strip the known WeChat-share marker.
  text = replacePattern(
    text,
    /\/\/!微信分享版本/g,
    "",
    "inline share comment"
  );

  text = replacePattern(
    text,
    /require\("src\/polyfills\.bundle\.43263\.js"\),require\("src\/system\.bundle\.f45da\.js"\);/,
    `require("src/polyfills.bundle.43263.js"),require("src/system.bundle.f45da.js"),require("subpackages-bootstrap.js");`,
    "subpackages bootstrap require"
  );

  const finalRequireMarker = 'require("game.js");';
  const finalRequireIndex = text.lastIndexOf(finalRequireMarker);
  if (finalRequireIndex === -1) {
    throw new Error("Failed to locate final game.js require for bootstrap injection");
  }
  text =
    text.slice(0, finalRequireIndex) +
    subpackageBootstrapModule +
    text.slice(finalRequireIndex);

  fs.writeFileSync(gameFile, text);
}

function buildGameJson(appConfig) {
  const subPackages = Array.isArray(appConfig.subPackages) ? appConfig.subPackages : [];
  return {
    deviceOrientation: appConfig.deviceOrientation || "portrait",
    networkTimeout: appConfig.networkTimeout || {
      request: 5000,
      connectSocket: 5000,
      uploadFile: 5000,
      downloadFile: 500000
    },
    subPackages: subPackages.map((item) => ({
      ...item,
      root: normalizeRootPath(item.root)
    })),
    subpackages: subPackages.map((item) => ({
      ...item,
      root: normalizeRootPath(item.root)
    }))
  };
}

function buildProjectConfig() {
  return {
    description: "Assembled runnable WeChat mini game project from exported wxapkg artifacts.",
    packOptions: {
      ignore: []
    },
    setting: {
      urlCheck: false,
      es6: true,
      enhance: true,
      postcss: false,
      minified: true,
      ignoreUploadUnusedFiles: true,
      compileHotReLoad: false
    },
    compileType: "game",
    libVersion: "3.15.1",
    appid: targetAppId,
    projectname: `duck_game_${targetAppId}`,
    simulatorType: "game",
    condition: {},
    isGameTourist: true
  };
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function collectRuntimeSummary(dir) {
  let files = 0;
  let dirs = 0;
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        dirs += 1;
        walk(fullPath);
      } else if (entry.isFile()) {
        files += 1;
      }
    }
  };
  walk(dir);
  return { files, dirs };
}

async function main() {
  if (!fs.existsSync(unpackedDir)) {
    throw new Error(`Missing unpacked source directory: ${unpackedDir}`);
  }

  const appDir = path.join(unpackedDir, "__APP__");
  if (!fs.existsSync(appDir)) {
    throw new Error(`Missing __APP__ directory: ${appDir}`);
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);

  copyDirContents(appDir, outputDir);

  const packageDirs = fs.readdirSync(unpackedDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("_subpackages_"))
    .map((entry) => path.join(unpackedDir, entry.name));

  for (const packageDir of packageDirs) {
    copyDirContents(packageDir, outputDir);
  }

  const appConfigPath = path.join(outputDir, "app-config.json");
  const appConfig = JSON.parse(fs.readFileSync(appConfigPath, "utf8"));
  if (Array.isArray(appConfig.subPackages)) {
    appConfig.subPackages = appConfig.subPackages.map((item) => ({
      ...item,
      root: normalizeRootPath(item.root)
    }));
    writeJson(appConfigPath, appConfig);
  }

  patchMainBundle(outputDir);

  writeJson(path.join(outputDir, "game.json"), buildGameJson(appConfig));
  writeJson(path.join(outputDir, "project.config.json"), buildProjectConfig());
  const readableSummary = await generateReadableProject(outputDir, readableOutputDir);

  const summary = collectRuntimeSummary(outputDir);
  writeJson(path.join(outputDir, "ASSEMBLY_REPORT.json"), {
    assembledAt: new Date().toISOString(),
    source: unpackedDir,
    output: outputDir,
    readableOutput: readableOutputDir,
    appid: targetAppId,
    packageCount: packageDirs.length + 1,
    files: summary.files,
    directories: summary.dirs,
    readableBundles: readableSummary.bundleCount
  });

  console.log(`Assembled runnable project at: ${outputDir}`);
  console.log(JSON.stringify({ ...summary, readableBundles: readableSummary.bundleCount }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
