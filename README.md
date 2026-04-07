# Duck WeChat Game Export

这是对微信小游戏 `wx244b1cb66c8ac4b4` 的完整导出包，包含原始 `wxapkg`、解密后的 `wxapkg`、按包拆开的运行时文件、小游戏本地缓存/配置，以及补齐的解包工具和逆向分析文档。

如果你要尝试实际导入微信开发者工具运行，请优先使用：

- `runnable_wechat_project/`
- `readable_project/` 是自动生成的可读化镜像，用来看代码，不是运行目录

运行方法见：

- `docs/RUNNING.md`

当前强证据显示，这个项目是一个以“鸭子”为核心题材的 Cocos Creator 微信小游戏，主线名称大概率是：

- `救救水果鸭`
- `救救我鸭`
- `水果鸭`

证据来自：

- `AdManager_WX.ts` 中的分享标题 `救救我鸭`
- `aniBundle` 资源中的 `救救水果鸭`
- `aniBundle` / `Game2Bundle` 资源中的 `水果鸭`、`火龙果鸭`、`西瓜鸭`、`水果大胃王`

## 目录说明

- `project_bundle/raw/`
  原始加密 `wxapkg` 包，共 9 个。
- `project_bundle/decrypted/`
  经过 PC 微信包头解密后的 `wxapkg`。
- `project_bundle/unpacked_by_pkg/`
  按包拆开的最终文件，适合继续逆向。
- `project_bundle/local_metadata/`
  本机微信容器里该小游戏对应的本地配置、缓存、mmkv、启动参数等。
- `project_bundle/source_context/summary.json`
  本次解包汇总信息。
- `tools/wechat_wxapkg_unpack.js`
  本次实际使用的解包脚本，可复用。
- `docs/`
  架构分析、玩法逆向、依赖/插件结论、用户目录取证说明。

## 关键结论

- 这是一个 `Cocos Creator 3.8.7` 打包后的成品小游戏，不是原始 Creator 编辑器工程。
- 启动场景是 `db://assets/scene/LoadScene.scene`。
- 主 bundle / 子包结构完整保留，主要子包有：
  - `resources`
  - `main`
  - `aniBundle`
  - `audioBundle`
  - `DuckBundle`
  - `Game2Bundle`
  - `HomeBundle`
  - `uiBundle`
- `main` bundle 里有 5 个场景：
  - `DuckScene`
  - `FruitScene`
  - `Game2Scene`
  - `HomeScene`
  - `PigeonScene`
- `plugins.jsList` 为空，未发现必须额外补装的微信插件包。
- 运行时依赖主要已经内嵌在成品包里，包括：
  - Cocos 运行时
  - Babel helper/polyfill
  - 微信小游戏适配层
  - 途悦 SDK 封装逻辑

## 当前导出体积

- `raw`: 25M
- `decrypted`: 25M
- `unpacked_by_pkg`: 31M
- `local_metadata`: 136K
- `source_context`: 3.2M

## 还原边界

能还原出来的是“发布后的可运行成品结构”，包括大部分脚本、配置、资源和平台接入逻辑。

不能直接凭这一份导出包还原出来的内容主要是：

- 原始 Cocos Creator 工程目录结构
- 原始 `.ts` / `.meta` / 编辑器工程设置
- 构建前的 npm 依赖树
- 构建前插件工程或私有后台服务代码

如果你后面要继续做深度逆向，建议优先从 `project_bundle/unpacked_by_pkg/__APP__/game.js`、`project_bundle/unpacked_by_pkg/_subpackages_main_/subpackages/main/config.14565.json`、`project_bundle/unpacked_by_pkg/_subpackages_DuckBundle_`、`project_bundle/unpacked_by_pkg/_subpackages_Game2Bundle_` 入手。
