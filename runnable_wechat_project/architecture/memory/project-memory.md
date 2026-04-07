# 项目记忆（持续更新）

## 当前工程属性
- 这是微信小游戏发布产物工程，不是 Cocos Creator 原始源码工程。
- 可直接运行目录：`runnable_wechat_project/`
- 入口桥接策略：`game.js -> architecture/boot/game-bootstrap.js`

## 已落地决策
1. 不直接深改打包压缩业务代码（`game.js` 大段产物）。
2. 通过 `architecture/` 承载可维护逻辑与文档。
3. 每次迭代后必须运行“运行安全校验”。

## 最新沉淀（2026-04-07）
1. 启动层拆分为 6 个模块：`config`、`system-info`、`render-policies`、`runtime-bridge`、`app-lifecycle`、`game-bootstrap`。
2. 新增运行安全校验：`verify-runtime-safety.js`。
3. 新增一键护栏：`run-guardrails.js`。
4. 新增项目内技能文档：`skills/maintainer/SKILL.md`。
5. 启动参数支持运行时覆盖：`globalThis.__DUCK_BOOT_OVERRIDES`。

## 关键风险与约束
1. `game.js` 内大量压缩代码不可控，深改风险极高。
2. 允许改动 `game.js` 的范围：仅限启动桥接与必要接入点。
3. 任何性能策略默认保守，不可影响主流程可用性。

## 必跑检查
```bash
node -c runnable_wechat_project/game.js
node -c runnable_wechat_project/architecture/boot/game-bootstrap.js
node runnable_wechat_project/architecture/tools/check-architecture-style.js
node runnable_wechat_project/architecture/tools/verify-runtime-safety.js
node runnable_wechat_project/architecture/tools/run-guardrails.js
```

## 下阶段迭代路线
1. 在 `architecture/boot` 中继续拆分策略模块（配置、安全校验、平台策略）。
2. 增加自动化报告，记录每次迭代改动范围与校验结果。
3. 对高频改动逻辑优先做“可维护层替换”。
