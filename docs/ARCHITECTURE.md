# 架构分析

## 1. 项目定位

这是一个已经发布到微信小游戏容器中的 Cocos Creator 成品包，运行时引擎版本为 `3.8.7`。

核心入口文件位于：

- `project_bundle/unpacked_by_pkg/__APP__/game.js`
- `project_bundle/unpacked_by_pkg/__APP__/src/settings.28e9d.json`
- `project_bundle/unpacked_by_pkg/__APP__/app-config.json`

这份导出包更接近“构建产物逆向工程”，而不是“原始源码仓库”。

## 2. 启动链路

运行链路可以概括为：

1. `__APP__/game.js`
2. 加载 `web-adapter`、`first-screen`
3. 加载 `src/polyfills.bundle.*`、`src/system.bundle.*`
4. `System.warmup(...)`
5. 导入 `application.67fff.js`
6. `Application.start()` 读取 `src/settings.28e9d.json`
7. 启动场景 `LoadScene.scene`
8. `LoadScene.onLoad()` 初始化平台、账号、SDK、资源 bundle
9. 根据关卡和启动来源跳转到 `DuckScene` 或 `HomeScene`

`settings.28e9d.json` 中的关键信息：

- 引擎：`CocosEngine = 3.8.7`
- 平台：`wechatgame`
- 启动场景：`db://assets/scene/LoadScene.scene`
- 预加载 bundle：`start-scene`、`resources`、`main`

## 3. LoadScene 的实际职责

`LoadScene.ts` 不是单纯的 loading 页，它承担了整个产品初始化总控的职责：

- 判断当前平台：
  - 微信小游戏
  - 字节小游戏
  - 桌面浏览器测试模式
- 设置 `GameId`
  当前识别到的是 `JJWY`
- 初始化 `GameModel`
- 初始化途悦 SDK / 登录 / 拉取动态配置
- 初始化音频
- 重置跨天数据
- 拉取并同步关卡/用户数据
- 顺序加载关键 bundle

从代码可以看出，它至少顺序触发了这些资源加载：

- `resources`
- `uiBundle`
- `Game2Bundle`
- `HomeBundle`
- `aniBundle`
- `DuckBundle`

加载后根据条件跳转：

- 首关或从推荐流直玩启动：进入 `DuckScene`
- 否则：进入 `HomeScene`

## 4. bundle 划分

### `start-scene`

- 场景数：1
- 场景：
  - `LoadScene.scene`
- 用途：
  只负责启动页和初始化页

### `main`

- 场景数：5
- 场景：
  - `DuckScene.scene`
  - `FruitScene.scene`
  - `Game2Scene.scene`
  - `HomeScene.scene`
  - `PigeonScene.scene`
- 用途：
  场景主入口和大量公共资源

### `DuckBundle`

- import 资源量：708
- native 资源量：335
- 用途：
  主玩法“木板/钉子/救鸭子”相关 prefab、贴图、警告 UI、结构资源

### `Game2Bundle`

- import 资源量：67
- native 资源量：15
- `deps: ["main"]`
- 用途：
  水果玩法 prefab、背景、果实图集、果洞资源、进度资源

### `HomeBundle`

- import 资源量：149
- native 资源量：74
- 用途：
  首页展示、按钮、装饰、换皮入口、主界面资源

### `aniBundle`

- import 资源量：86
- native 资源量：42
- 用途：
  骨骼动画、标题动画、引导动画、鸭/水果相关 Spine 资源

### `audioBundle`

- import 资源量：65
- native 资源量：65
- 用途：
  背景音乐、点击音、告警音、玩法音效

### `uiBundle`

- import 资源量：89
- native 资源量：24
- 用途：
  面板 prefab、设置弹窗、复活、道具、领取奖励等 UI 资源

### `resources`

- import 资源量：11
- native 资源量：3
- 用途：
  通用底层资源、效果、材质、json、公用 prefab

## 5. 核心模块分层

从 `__APP__/game.js` 抽出的命名模块共有 81 个，核心分层如下。

### 场景层

- `LoadScene.ts`
  产品启动总控
- `HomeScene.ts`
  主菜单 / 中枢场景

### 核心玩法层

- `DuckController.ts`
  主玩法控制器，控制木板、钉子、道具、复活、陀螺仪等
- `Game2Controller.ts`
  水果玩法控制器
- `FruitManager.ts`
  水果布局、生成、移动、洞口逻辑
- `Fruit.ts`
  单水果行为控制

### 数据/状态层

- `GameModel2.ts`
  全局状态容器
- `GameData.ts`
  Duck 玩法模式规则
- `GameData2.ts`
  Game2 玩法模式规则

### 资源/平台层

- `ResManager.ts`
  bundle 加载、资源缓存、资源获取
- `AudioManager.ts`
  音频控制
- `ServiceManager.ts`
  用户数据上报/存储同步
- `TooYueManager.ts`
  途悦 SDK 封装
- `AdManager_WX.ts`
  微信广告、分享、陀螺仪
- `AdManager_ZJ.ts`
  字节广告与录屏
- `AdManager_KS.ts`
  快手广告和快捷方式

### UI 层

代表模块包括：

- `AddPowerPanelView.ts`
- `PropPanelView.ts`
- `RevivePanelView.ts`
- `OverPanelView.ts`
- `SuccessPanelView.ts`
- `BookPanelView.ts`
- `SubscribePanelView.ts`

## 6. GameModel2 的产品级意义

`GameModel2.ts` 是最重要的全局模型之一，里面直接暴露了产品结构：

- `GameName = "JiuJiuWoYa_Pro"`
- `HomeSceneName = "HomeScene"`
- `DuckSceneName = "DuckScene"`
- `PigeonSceneName = "PigeonScene"`
- `Game2SceneName = "Game2Scene"`
- `CowSceneName = "CowScene"`
- `MathSceneName = "MathScene"`
- `FruitSceneName = "FruitScene"`

这说明当前导出到手的项目，很可能只是这个“大鸭子合集产品”中的一部分玩法和资源。

从字段看，它还管理：

- 等级/多玩法等级
- 分享解锁进度
- 道具数量
- 音乐/音效/震动开关
- 加桌面 / 侧边栏 / 订阅状态
- 体力恢复
- 鸭皮肤 / 鸽子皮肤 / 收集进度

## 7. 资源管理方式

`ResManager.ts` 的作用比较标准：

- `loadBundle`
- `bundleLoadDir`
- `bundleLoad`
- `preloadBundleScene`
- `loadAudio`
- `release`
- 内存缓存 `_assetsCache`

这说明本项目采用了典型的“按 bundle 切分 + 动态加载 + 缓存复用”的小游戏结构。

对于逆向来说，这很重要，因为：

- prefab/贴图/音频并不是都在主包内
- 很多资源需要按 bundle 名去定位
- 修改资源时要注意 bundle 路径和缓存 key

## 8. 结论

整体看，这个项目的真实架构不是“单玩法 demo”，而是：

- 一个鸭子主题的小游戏产品壳
- 下挂多个玩法场景
- 通过 `GameModel2`、`LoadScene`、`ResManager`、`AdManager_*`、`TooYueManager` 形成统一产品层
- 再通过 `DuckController` 和 `Game2Controller` 承载两个主要玩法

如果后面要继续做二次拆解，优先级建议是：

1. 先吃透 `LoadScene` + `GameModel2`
2. 再拆 `DuckController`
3. 再拆 `Game2Controller` + `FruitManager`
4. 最后处理平台层和 UI 层
