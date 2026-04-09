# 小游戏项目结构约定

## 目标

在保证微信小游戏运行稳定的前提下，维持“官方入口清晰、资源主目录唯一、兼容层最小化、治理层可自动校验”的结构。

## 分层定义

### 1. 运行时入口层

- `game.js`
- `game.json`
- `project.config.json`
- `project.private.config.json`
- `app-config.json`
- `src/runtime-settings.json`

职责：
- 保持微信小游戏入口契约。
- 所有启动必须行为从这里触发，不在入口散落业务重构代码。

### 2. 启动与治理层

- `architecture/boot/`
- `architecture/tools/`
- `architecture/docs/`
- `architecture/generated/`
- `architecture/memory/`

职责：
- 承载启动编排、运行时治理、结构校验与审计自动化。
- 所有兼容补丁必须可追踪、可验证、可回归。

### 3. Canonical 资源层

- `subpackages/<Bundle>/`
- `assets/internal/`
- `assets/start-scene/`

职责：
- 这是唯一“真实资源来源”。
- `import/` 与 `native/` 以 canonical 目录为准。
- 语义化命名与配置治理优先在这层进行。

### 4. 兼容薄壳层

- `assets/*bundle/`
- `assets/*Bundlebundle/`

职责：
- 仅保留历史 bundle 名称兼容入口。
- 目录内仅允许 `index.js` 与 `config.json` 级别薄壳文件。
- 严禁回填 `import/`、`native/` 全量副本。

### 5. 运行时重映射层

- `runtime/asset-file-remap.js`
- `runtime/generated/subpackage-asset-remap-manifest.js`

职责：
- 将旧路径、镜像路径与历史 UUID 路径归一到 canonical 资源。
- 不承载玩法业务逻辑。

## 目录职责速查

- `subpackages/`：业务 bundle 主目录，运行时真实加载目标。
- `assets/internal`、`assets/start-scene`：根 bundle canonical 资源。
- `assets/*bundle*`：兼容入口薄壳。
- `runtime/`：运行期路径修正与重映射。
- `architecture/`：规则、工具、审计、文档，不参与资源加载。
- `tools/deobf/`：离线分析工具层，不进入运行时链路。

## 已执行的结构收敛

- 移除解包还原目录 `restored/`（运行时无依赖）。
- 移除默认流程中的手工还原与碎片分析链路。
- 兼容镜像目录维持最小壳结构，不保留重复资源副本。

## 删除与保留标准

- 可删除：
  - 未被运行时加载链路引用的分析中间产物。
  - 临时输出目录、空目录、重复镜像资源副本。
- 必须保留：
  - `subpackages/*/import` 与 `subpackages/*/native`
  - `assets/internal/*`、`assets/start-scene/*`
  - `runtime/generated/subpackage-asset-remap-manifest.js`

## JSON 维护规则

- 人工维护 JSON 必须多行格式化，保证可读。
- 编译产物 JSON（`import/`、`native/` 关联元数据）允许保留紧凑格式，以控制包体和构建一致性。

## 执行约束

1. 先满足官方运行约束，再做命名和目录优化。
2. 不做“只修当前报错”的临时补丁。
3. 任何目录清理都必须通过护栏与官方检查。
4. 不得破坏 `game.json` 分包声明与真实目录映射关系。

## 推荐收尾命令

```bash
node architecture/tools/format-project-json.js
node architecture/tools/generate-subpackage-structure-audit.js
node architecture/tools/generate-compatibility-mirror-audit.js
node architecture/tools/run-guardrails.js
node architecture/tools/run-wechat-official-checks.js --skip-cli
node architecture/tools/run-wechat-ci.js doctor
```
