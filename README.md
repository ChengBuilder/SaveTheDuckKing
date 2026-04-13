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
npm run assets:check-config-integrity
npm run assets:prune-legacy-hash-layout
npm run wechat:code-package:check
npm run wechat:official:check
npm run wechat:official:fix
npm run wechat:test:doctor
npm run wechat:test:run
```

## 维护说明

- 已移除大量历史映射/审计/语义化脚本，避免继续扩散复杂度。
- 若出现 `readFile ... not found`，优先检查对应 bundle 的 `config.*.json` 与分片文件是否一致。
- 提交前至少执行一次 `npm run guardrails`。
