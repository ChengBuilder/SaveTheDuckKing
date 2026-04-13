# SaveTheDuckKing

这是一个微信小游戏发布产物工程的重构仓库，不是 `Cocos Creator` 源工程。  
目标是把“解包可运行”推进到“结构清晰、可交接、可持续迭代”。

## 项目定位

- 平台：微信小游戏
- 工程形态：发布产物重构工程
- 启动链路：`game.js -> architecture/boot/game-bootstrap.js`
- 运行配置：`game.json`
- 工具配置：`project.config.json`（团队共享）与 `project.private.config.json`（本机私有）

## 三条总原则（先看这个）

1. **Canonical 优先**：资源与路径的真实来源是 `subpackages/*`、`assets/internal`、`assets/start-scene`。
2. **拒绝新增兼容层**：不再通过 `runtime/` 或 `architecture/boot/` 叠加玩法/UI 的 legacy 兜底。
3. **问题从源头修**：`Bundle doesn't contain ...` 一类报错，优先改 `game.js`、bundle config、`import` 元数据，不加 alias。

## 新同学 30 分钟上手路径

1. 先读 `README`（本文件），建立目录分层认知。
2. 打开 `game.js` 与 `architecture/boot/game-bootstrap.js`，看启动主链路。
3. 打开 `game.json`，确认分包声明与加载关系。
4. 打开 `subpackages/HomeBundle`、`subpackages/main`、`subpackages/uiBundle` 的 `config.*.json`，理解当前核心资源组织。
5. 执行 `npm run guardrails` 与 `npm run wechat:official:check`，确认本地环境可跑。

## 根目录关键文件

- `game.js`：小游戏入口，负责接入启动编排。
- `game.json`：运行配置与分包声明（运行契约）。
- `project.config.json`：微信开发者工具共享配置。
- `project.private.config.json`：本机私有配置，不应覆盖团队共识。
- `app-config.json`：项目补充配置。
- `package.json`：治理脚本、测试脚本、CI 脚本入口。

## 关键目录说明（按“该去哪改”组织）

### 1) `subpackages/`（业务资源 canonical 主目录，最重要）

每个 bundle 目录都有统一结构：`config.*.json` + `game.js` + `import/` + `native/`。

- `subpackages/main/`：主流程场景与主线共享资源。
- `subpackages/HomeBundle/`：主页/大厅相关资源。
- `subpackages/uiBundle/`：通用 UI、图鉴、弹窗、结算页等。
- `subpackages/DuckBundle/`：鸭子主玩法资源。
- `subpackages/resources/`：跨玩法共享资源与通用特效。
- `subpackages/aniBundle/`：动画资源。
- `subpackages/audioBundle/`：音频资源。

维护要点：
- `import/` 与 `native/` 是编译产物运行必需层，不能“看起来乱就整目录删除”。
- 路径语义化优先在各 bundle 的 `config.*.json` 和对应 `import/_packs` 元数据中落地。

### 2) `assets/`（root bundle 资源层）

- `assets/internal/`：root bundle canonical 资源（含 `config.internal.json`、`import/`、`index.js`）。
- `assets/start-scene/`：启动场景 canonical 资源（含 `config.start-scene.json`、`import/`、`native/`、`index.js`）。
- `assets/internalbundle/`、`assets/start-scenebundle/`：历史命名薄壳层，仅保留最小壳结构，不回填全量资源副本。

### 3) `architecture/`（治理与规范层，不放业务兼容）

- `architecture/boot/`：启动编排与运行治理。
- `architecture/tools/`：护栏、语义化、审计、官方检查脚本。
- `architecture/docs/`：规范、审计报告、迭代记录。
- `architecture/memory/`：长期约束和决策记忆。
- `architecture/generated/`：治理脚本生成产物。

新人重点先看：
- `architecture/docs/project-structure.md`
- `architecture/docs/wechat-official-project-guide.md`
- `architecture/docs/naming-conventions.md`
- `architecture/docs/asset-governance-log.md`

### 4) `runtime/`（运行时基础映射层）

- `runtime/asset-file-remap.js`
- `runtime/generated/subpackage-asset-remap-manifest.js`

职责边界：
- 允许做“真实文件名重映射、root 请求归一化”这类基础治理。
- 不承接玩法/UI 的历史路径兼容补丁。

### 5) 其他目录

- `src/`：运行时设置（如 `runtime-settings.json`）。
- `wechat-test/minigametest/`：MiniGameTest 自动化测试工程（`sample/` 为示例，`vendor/` 放测试 SDK 包）。
- `tools/deobf/`：离线解混淆/分析工具，不进入运行时。
- `cocos-js/`：引擎依赖目录，通常不做业务改动。

## 收尾标准（什么时候可以结束）

满足以下条件即可视为“主干重构完成”：

1. 新同学可在 30 分钟内定位入口、资源真源、分包职责、测试命令。
2. 主链路不再依赖 legacy 兼容层，问题优先从源头路径与命名修复。
3. `subpackages/*` 的关键资源路径与 `import` 元数据基本语义化。
4. 护栏与官方检查稳定通过，自动化测试链路可执行。
5. 剩余问题主要是局部编译产物细节，而非系统级混乱。

## 开发与测试命令

### 常用检查

```bash
npm install
npm run guardrails
npm run wechat:code-package:check
npm run wechat:official:check
```

可跳过 DevTools CLI 的官方检查：

```bash
node architecture/tools/run-wechat-official-checks.js --skip-cli --with-minigame-test-doctor --allow-missing-test-sdk
```

### MiniGameTest 自动化

```bash
npm run wechat:test:doctor
npm run wechat:test:run
```

前置条件：

- 已开启微信开发者工具服务端口。
- `wechat-test/minigametest/vendor/` 已放置 `mini_game_test-*.tgz`。
- 已设置 `WECHAT_MINIGAME_TEST_NODE_PATH`。
- `WECHAT_DEVTOOLS_SERVICE_PORT` 与 `WECHAT_MINIGAME_TEST_PORT` 不能相同（默认 `9420/9421`）。

### 微信 CI 链路

```bash
npm run wechat:ci:doctor
npm run wechat:ci:preview
npm run wechat:ci:upload
npm run wechat:ci:pack-npm
```

前置条件：

- 已配置 `WECHAT_CI_PRIVATE_KEY_PATH` 等 CI 凭据。

## 推荐迭代流程

1. 锁定一个明确的旧命名/旧路径簇。
2. 直接改 canonical 配置与资源引用，不加 alias。
3. 如有规律，补充 `architecture/tools/semanticize-*.js` 自动化脚本。
4. 执行 `npm run guardrails` 与官方检查。
5. 通过后再提交与推送。

## 不要做的事

- 不要往 `boot/runtime` 增加业务兼容层。
- 不要把 `subpackages/*/import` 当普通源码目录进行大规模手删。
- 不要把开发者工具偶发表现当真机结论。
- 不要把新复杂度再次转移成“再兼容一层”。

## 已知限制

- 本仓库包含大量编译产物（尤其 `import/` 与 `native/`），可读性先天受限。
- 局部 pack 文件仍有解包残留命名，需要分阶段语义化收敛。
- 当前不是 Creator 源工程，不能使用“回编辑器重导出”思路替代源头修复。

## 文档索引

- [architecture/README.md](./architecture/README.md)
- [architecture/docs/README.md](./architecture/docs/README.md)
- [architecture/docs/project-structure.md](./architecture/docs/project-structure.md)
- [architecture/docs/wechat-official-project-guide.md](./architecture/docs/wechat-official-project-guide.md)
- [architecture/docs/naming-conventions.md](./architecture/docs/naming-conventions.md)
- [architecture/docs/asset-code-boundaries.md](./architecture/docs/asset-code-boundaries.md)
- [architecture/docs/iteration-workflow.md](./architecture/docs/iteration-workflow.md)
- [architecture/memory/project-memory.md](./architecture/memory/project-memory.md)
- [wechat-test/minigametest/README.md](./wechat-test/minigametest/README.md)
