# SaveTheDuckKing

这是一个微信小游戏发布产物重构仓库（非 Cocos Creator 源工程）。
当前目标：聚焦“拆钉子木板”主流程，持续做减法，保持结构清晰、可维护。

## 快速开始

```bash
npm install
npm run guardrails
npm run wechat:official:check -- --skip-cli --skip-package-check
```

## 当前工程原则

1. 只保留主流程必需代码，不做历史兼容层。
2. 问题从源头修（bundle config / import / native / runtime 主逻辑），不加映射补丁。
3. 资源以分片目录为准：`import/xx/*`、`native/xx/*`。

## 关键目录

- `game.js`：小游戏入口。
- `game.json`：运行配置与分包声明。
- `subpackages/`：业务资源主目录（`main`、`DuckBundle`、`uiBundle`、`HomeBundle`、`resources`、`aniBundle`、`audioBundle`）。
- `assets/internal`、`assets/start-scene`：root bundle 资源。
- `runtime/`：运行时代码。
- `architecture/boot/`：启动编排与治理。
- `architecture/tools/`：当前保留的核心校验与微信工具链脚本。

## 常用命令

```bash
npm run guardrails
npm run source:migrate-runtime:clean
npm run source:build
npm run reconstruct:maintainable -- --dry-run
npm run reconstruct:maintainable:clean
npm run runtime:repack-from-source -- --dry-run
npm run cocos:build:wechat
npm run assets:check-config-integrity
npm run assets:prune-legacy-hash-layout
npm run wechat:code-package:check
npm run wechat:official:check
npm run wechat:official:fix
npm run wechat:test:doctor
npm run wechat:test:run
```

## 可维护重建

- `npm run reconstruct:maintainable -- --dry-run`：预演重建，不改动文件。
- `npm run reconstruct:maintainable:clean`：清空并重建 `reconstructed-project/`。
- `npm run runtime:repack-from-source`：将 `source-project/runtime-modules` 回封装到 `runtime/gamejs-modules`，用于保持可运行。
- 产物包含：
  - `reconstructed-project/assets-restored/`（哈希资源按路径恢复）
  - `reconstructed-project/source/runtime-modules/`（runtime 模块按 moduleId 还原）
  - `reconstructed-project/reports/`（重建映射与摘要）

## Source-First 开发流

- `npm run source:migrate-runtime:clean`：将 `runtime/gamejs-modules` 迁移为可读源码到 `source-project/runtime-modules`。
- `npm run runtime:repack-from-source`：把 `source-project/runtime-modules` 回封装到运行目录。
- `npm run source:build`：执行去 hash 同步、从 `source-project` 回封装、guardrails 全链路校验（不会覆盖源码）。

## Cocos 构建到微信可玩包

- `npm run cocos:build:wechat`：
  - 先触发 Cocos Creator 3.8.7 的 `wechatgame` 构建（用于验证 Creator 构建链路可用）。
  - 然后将当前仓库可玩运行时包同步到 `build/wechatgame/`。
  - 结果可直接导入微信开发者工具继续游玩主流程。

## 维护说明

- 已移除大量历史映射/审计/语义化脚本，避免继续扩散复杂度。
- 若出现 `readFile ... not found`，优先检查对应 bundle 的 `config.*.json` 与分片文件是否一致。
- 提交前至少执行一次 `npm run guardrails`。
