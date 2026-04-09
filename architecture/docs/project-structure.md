# 小游戏项目结构约定

## 目标

在保证微信小游戏继续可运行的前提下，把“解包产物工程”分成清晰的运行层、兼容层、可维护层和还原层，避免后续继续用补丁把问题压回 `game.js`。

## 当前分层

### 1. 运行时入口层

- `game.js`
- `game.json`
- `project.config.json`
- `app-config.json`
- `src/runtime-settings.json`
- `game.js` 内嵌虚拟模块：
  - `define("application-main.js", ...)`
  - `define("engine-adapter.js", ...)`
  - `define("first-screen.js", ...)`
  - `define("subpackages-bootstrap.js", ...)`
  - `define("web-adapter.js", ...)`

职责：
- 保持微信小游戏入口契约成立。
- 保持 `game.js` 作为单入口文件，同时保留内嵌虚拟模块定义。
- 只保留必要桥接，不承载复杂业务重构。

### 2. 启动与治理层

- `architecture/boot/`
- `architecture/tools/`
- `architecture/docs/`
- `architecture/memory/`

职责：
- 把启动兼容、运行安全、性能策略、结构校验、资产审计都沉淀到可维护层。
- 所有“为了稳定运行而做的规则”优先进这里，不回塞到压缩产物主干。

### 3. canonical 资源层

- `subpackages/<Bundle>/config.<semantic>.json`
- `assets/internal/config.internal.json`
- `assets/start-scene/config.start-scene.json`

职责：
- 这里是语义化命名和资产路径治理的主战场。
- 优先修改 canonical 路径、`SpriteFrame.name`、配置与引用关系。

### 4. 运行时兼容镜像层

- `assets/*bundle/`
- `assets/*Bundlebundle/`

职责：
- 兼容微信开发者工具和旧 bundle 请求路径。
- 这是“为了兼容旧加载链路保留的镜像层”，不是后续语义治理的主入口。

### 5. 编译产物层

- `subpackages/*/import/*.json`
- `subpackages/*/native/*`
- `assets/*/import/*.json`
- `assets/*/native/*`

职责：
- 这里保存 Cocos 编译后的 UUID 元数据与 native 资源文件。
- 默认视为运行时稳定产物，不直接做文件名级 rename。
- 若要改名，必须先有完整的配置映射、pack 关系、版本后缀和引用链证明。

### 6. 还原分析层

- `restored/start-scene/*.restored.js`
- `restored/start-scene/semantic/*.semantic.js`
- `restored/start-scene/refined/*.refined.js`
- `restored/start-scene/rename-workbench/*.workbench.json`

职责：
- 承接“变量无语义、结构不可读”的解包代码还原工作。
- `restored` 保留结构，`semantic` 补安全注释，`refined` 做人工语义重命名。

## 约束

1. 不为了修一个 bug 就拆东墙补西墙，也不接受只堵当前报错的临时补丁。
2. 运行时兼容逻辑必须能落到 `architecture/boot` 或护栏工具里，被持续校验。
3. UUID 编译文件默认先做“用途审计 + 语义索引”，再决定是否值得进入 rename 流程。
4. 人工还原代码优先沉淀到 `restored/start-scene/refined/`，不直接深改压缩业务产物。
5. 任何结构调整都必须跑护栏与迭代流水线，确保微信小游戏仍可启动。

## 推荐流程

1. 先看 `architecture/memory/project-memory.md`。
2. 再看 `architecture/docs/uuid-asset-report.md` 与 `architecture/docs/asset-readability-audit.md`。
3. 选择一组高置信度对象：
   - 语义明确的 canonical 资源路径；
   - 有足够线索的 `restored/refined` 模块；
   - 可以写进护栏的结构规则。
4. 修改完成后执行：

```bash
node architecture/tools/run-guardrails.js
node architecture/tools/run-iteration-cycle.js
```
