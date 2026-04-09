# 微信小游戏官方规范落地指南

## 目的

本文件以微信官方文档为唯一准绳，约束这个仓库后续的结构调整、资源治理、启动链路、分包策略和自动化检查方式。

从现在开始，这个项目遵循两条优先级：

1. 先满足微信小游戏官方约束。
2. 再做我们自己的可读性治理、命名优化和仓库瘦身。

如果两者冲突，以官方约束为准。

## 官方依据

- 小游戏开发指南总入口：
  - https://developers.weixin.qq.com/minigame/dev/guide/
- 新手与项目结构：
  - https://developers.weixin.qq.com/minigame/dev/guide/develop/start.html
- 进阶开发：
  - https://developers.weixin.qq.com/minigame/dev/guide/develop/develop.html
- 运行环境：
  - https://developers.weixin.qq.com/minigame/dev/guide/runtime/env.html
- 运行机制：
  - https://developers.weixin.qq.com/minigame/dev/guide/runtime/operating-mechanism.html
- 更新机制：
  - https://developers.weixin.qq.com/minigame/dev/guide/runtime/update-mechanism.html
- 文件系统：
  - https://developers.weixin.qq.com/minigame/dev/guide/base-ability/file-system.html
- 渲染：
  - https://developers.weixin.qq.com/minigame/dev/guide/base-ability/render.html
- 代码包：
  - https://developers.weixin.qq.com/minigame/dev/guide/base-ability/code-package.html
- 分包加载：
  - https://developers.weixin.qq.com/minigame/dev/guide/base-ability/subPackage/useSubPackage.html
- 独立分包：
  - https://developers.weixin.qq.com/minigame/dev/guide/base-ability/independent-sub-packages.html
- Worker：
  - https://developers.weixin.qq.com/minigame/dev/guide/base-ability/workers.html
- 音频：
  - https://developers.weixin.qq.com/minigame/dev/guide/base-ability/audio.html
- 开发者工具 CLI：
  - https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
- `miniprogram-ci`：
  - https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html
- 小游戏云测试：
  - https://developers.weixin.qq.com/minigame/dev/minigame-testtool/
- 小游戏测试框架模式：
  - https://developers.weixin.qq.com/minigame/dev/minigame-testtool/frame.html
- 小游戏测试框架环境准备：
  - https://developers.weixin.qq.com/minigame/dev/minigame-testtool/setup.html
- 小游戏测试框架第一个 Case：
  - https://developers.weixin.qq.com/minigame/dev/minigame-testtool/tutorial.html

## 当前项目必须遵守的硬约束

### 1. 根入口结构不能乱动

官方要求小游戏核心入口围绕以下文件组织：

- `game.js`
- `game.json`
- `project.config.json`
- `project.private.config.json`

对当前仓库来说，这些文件已经位于项目根目录，后续不能为了“整理目录”把它们随意拆走。

### 2. `project.config.json` 与 `game.json` 的职责必须分开

- `project.config.json` 是开发者工具工程配置。
- `game.json` 是运行时配置。

后续不要把运行逻辑塞进 `project.config.json`，也不要把编辑器私有行为塞进 `game.json`。

### 3. 开发者工具行为不等于真实客户端行为

官方明确说明：

- iOS 逻辑层跑在 JavaScriptCore。
- Android 逻辑层跑在 V8。
- 开发者工具仅供调试。

所以：

- 任何只在开发者工具里成立的路径、API、时序假设，都不能当成真实规则。
- 每次大改后至少要以“开发者工具 CLI 冒烟 + 真机/体验版验证”作为收尾。

### 4. 小游戏本质上是全屏 Canvas 运行环境

官方进阶文档明确强调：

- 没有 DOM。
- 没有 CSS。
- 所有逻辑从 `game.js` 启动。

因此：

- 不引入 Web 页面思维去重构资源或交互层。
- 不添加依赖 DOM 的调试/运行逻辑。

### 5. 代码包和分包必须按官方上限设计

官方规则：

- 整个小游戏总包体不超过 `30M`
- 主包不超过 `4M`
- 单个普通分包不限制大小
- 单个独立分包不超过 `4M`

所以这个仓库后续所有“瘦身”“迁移”“合并”动作都要围绕两件事：

- 尽量把首启必须资源留在主包。
- 把可延后加载内容继续留在 `subpackages/` 体系内。

### 6. 代码包文件是只读的

官方文件系统文档明确说明：

- 代码包文件运行后不能动态修改或删除。
- 路径必须从项目根目录起写。
- 不支持 `./` 和 `../` 这种相对写法。

所以：

- 我们可以重映射访问路径，但不能假设“运行中改写代码包文件”可行。
- 任何资源路径规范化都必须输出为根目录相对路径风格。

### 7. 更新机制必须显式处理

官方建议对版本依赖高的游戏始终开启更新检测 API。

因此当前项目后续应长期遵守：

- 启动链路保留 `wx.getUpdateManager()` 处理能力。
- 不依赖“静默更新一定及时触发”的侥幸逻辑。
- 前后台切换和内存告警统一纳入 boot 层治理，而不是散落在业务模块里各管各的。

### 8. Worker 必须按官方方式声明

官方要求通过 `game.json` 的 `workers` 字段声明。

如果后面我们把重计算逻辑迁进 Worker：

- 必须走 `game.json` 配置。
- 若要避免占主包，可按官方支持改为 Worker 分包。

## 当前仓库的官方化映射

### 根目录

- `game.js`：小游戏唯一主入口，必须保留。
- `game.json`：分包、运行时能力配置入口。
- `project.config.json`：开发者工具工程配置。
- `project.private.config.json`：本机私有工程配置。

### `subpackages/`

这是当前项目的业务资源主目录，符合官方分包机制。

当前各分包以 `game.json` 为准：

- `resources`
- `main`
- `aniBundle`
- `audioBundle`
- `DuckBundle`
- `Game2Bundle`
- `HomeBundle`
- `uiBundle`

后续默认在这里做资源语义化、目录治理和主/分包划分，不再把 `assets/*bundle` 当主资源源头。

### `assets/`

当前 `assets/` 已经分成两类：

- `assets/internal/`、`assets/start-scene/`
  - 属于根 bundle 的实际运行时目录。
- `assets/*bundle/`、`assets/*Bundlebundle/`
  - 属于兼容微信开发者工具和旧 bundle 路径的薄壳目录。
  - 这些目录现在原则上只保留 `config.json` 与 `index.js`。

后续规则：

- 不再往兼容壳层里回填大体积 `import/` 和 `native/` 副本。
- 真实资源始终以 canonical 目录为准。

### `runtime/`

这里是官方运行契约之上的“兼容补丁层”，只能做以下事情：

- 路径归一化
- 资源重映射
- 运行安全补丁

不能在这里塞复杂业务逻辑。

### 解包还原目录策略

`restored/` 已从主仓库移除，不再进入默认构建与校验流程。

后续若需要临时反编译分析，应在离线工作区完成，并保证：

- 不影响 `game.js`、`subpackages/`、`assets/internal`、`assets/start-scene` 的正式运行链路。
- 不把分析中间产物重新提交回主运行目录。

## 后续开发执行规则

### 必须做

- 改动后先跑仓库护栏，再跑微信开发者工具 CLI 冒烟。
- 新增运行时资源时，优先考虑是否应该进入已有 `subpackages/`。
- 新增缓存/下载逻辑时，遵守官方文件系统 API 和存储上限。
- 处理启动链路时，考虑冷启动、热启动、后台恢复和内存告警。
- 处理音频时，复用音频实例，及时销毁不用的实例。
- Boot 层统一监听更新检查、`onShow`/`onHide`、`onMemoryWarning`，并把状态写入运行时观测。

### 不允许做

- 把开发者工具兼容目录重新做成完整资源副本。
- 在代码里写死依赖开发者工具专属路径或端口行为。
- 用 `./`、`../` 形式访问代码包文件。
- 把根入口文件随意挪出当前结构。
- 只在开发者工具验证，不做客户端/体验版验证。

## 自动化方案

## 1. 本地官方 CLI 冒烟

本机已确认存在微信开发者工具 CLI：

- `/Applications/wechatwebdevtools.app/Contents/MacOS/cli`

并且本机 CLI 已登录可用。

仓库已新增脚本：

```bash
npm run wechat:official:check
```

它会执行：

1. 校验 `game.js` / `game.json` / `project.config.json`
2. 校验 `game.json` 分包配置
3. 跑仓库护栏
4. 调用官方 CLI 的 `islogin`
5. 调用官方 CLI 的 `auto --project ...`

如果只想先做安全修复再检查：

```bash
npm run wechat:official:fix
```

注意：

- 这里的“fix”目前只包含安全、确定性的维护动作：
  - JSON 格式化
  - 审计文档重生成
- 它不会自动修复业务逻辑 bug，也不会擅自重写运行时资源。

## 2. `miniprogram-ci` 编译/预览/上传

官方文档明确说明 `miniprogram-ci` 支持小游戏，`Project.type` 可设为 `miniGame`。

仓库已新增脚本：

```bash
npm run wechat:ci:doctor
npm run wechat:ci:preview
npm run wechat:ci:upload
npm run wechat:ci:pack-npm
```

需要的环境变量：

- `WECHAT_CI_PRIVATE_KEY_PATH`
  - 微信公众平台下载的代码上传密钥路径
- 可选：
  - `WECHAT_CI_APPID`
  - `WECHAT_CI_PROJECT_PATH`
  - `WECHAT_CI_VERSION`
  - `WECHAT_CI_DESC`
  - `WECHAT_CI_ROBOT`
  - `WECHAT_CI_THREADS`
  - `WECHAT_CI_QR_OUTPUT`

推荐先跑：

```bash
npm run wechat:ci:doctor
```

再跑：

```bash
npm run wechat:ci:preview
```

说明：

- 这条链路适合接入 CI/CD。
- 它能自动编译、预览、上传。
- 它不能自动修复业务 bug，只能帮我们尽早发现工程不完整、配置不合法、打包失败等问题。

## 3. 小游戏官方自动化测试

小游戏不是走“小程序云测”的那套。

官方文档给了小游戏自己的两条测试路径：

- 小游戏云测试服务
- 小游戏测试框架 `MiniGameTest`

### 当前可确认的事实

- 小程序 `minitest` 官方明确写了“不支持小游戏”。
- 小游戏有独立的云测试入口，但我们目前没有在官方文档中找到像小程序 `minitest` 第三方接口那样公开的小游戏云测提交 API/CLI。
- 小游戏本地自动化是可行的，官方方式是：
  - 开发者工具开启安全端口
  - CLI 执行 `auto --project ... --auto-port {port}`
  - 安装官方 `MiniGameTest` JS/Python 包
  - 使用 `node test.js -t ide -p {port}` 或 Python 方式运行 Case

### 结论

- “本地 CLI 自动打开项目并运行自动化测试”是可落地的。
- “像普通 CI 一样无额外依赖直接提交小游戏云测任务”目前文档证据不足，不能在仓库里宣称已经支持。

## 推荐执行顺序

每次改完后按下面顺序执行：

1. `npm run wechat:official:check`
2. 如果有上传密钥，再跑 `npm run wechat:ci:doctor`
3. 条件满足时跑 `npm run wechat:ci:preview`
4. 后续补齐 `MiniGameTest` 用例后，再接本地自动化 Case
5. 发布前走小游戏体验版/云测试

## 自动修复边界

当前仓库允许自动修复的，只有这些低风险动作：

- JSON 多行格式化
- 审计报告与结构索引重生成
- 官方 CLI 冒烟复跑

当前仓库不允许脚本擅自自动修复的：

- 资源删改
- 分包重划分
- 运行时代码重写
- 业务逻辑调整
- 第三方 SDK 接入改动

这类问题必须由我们在人工确认后修。
