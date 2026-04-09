# 项目记忆（持续更新）

## 当前工程定位
- 这是微信小游戏发布产物工程，不是 Cocos Creator 源码工程。
- 当前可运行目录为仓库根目录 `./`。
- 启动桥接固定为 `game.js -> architecture/boot/game-bootstrap.js`。

## 当前优先级（2026-04-09）
1. 保持“微信官方规范可通过 + 游戏可启动”。
2. 把解包工程继续正规化：直接改源头旧路径、删除死代码、拆掉历史兜底。
3. 清理解包遗留噪音（无效文件、冗余目录、过重文档）。
4. 输出可维护结构：目录职责清晰、JSON 可读、脚本可验证。

## 已稳定的结构决策
- `subpackages/*` + `assets/internal` + `assets/start-scene` 是 canonical 运行时资源来源。
- `assets/*bundle` / `assets/*Bundlebundle` 仅作为 root bundle 历史命名薄壳，禁止回填整包 `import/native` 副本。
- `runtime/asset-file-remap.js` 只负责运行时真实文件名重映射，不再承担旧业务路径兼容。
- `architecture/boot/asset-path-normalizer.js` 只负责 root bundle 请求归一化与扁平资源路径修正，禁止再次接入 Home/ui/玩法层旧路径兼容。
- `restored/` 已从主流程移除，不再作为运行依赖。

## 代码改动边界
- 允许对 `game.js` 做定点重构：直接改旧资源路径、删死分支、逐步把高噪音逻辑改成可维护结构。
- 允许在 `architecture/`、`runtime/`、工具脚本层做结构化治理，但不得把玩法层旧路径问题继续转移到启动兼容层。
- 任何新的运行时报错，优先回到 `game.js` / bundle config / import 元数据源头修复。
- 禁止新增运行时兼容补丁、镜像兜底、legacy alias。
- 所有清理必须可回归：先改再跑护栏和官方检查。

## 运行与校验命令
```bash
node architecture/tools/format-project-json.js
node architecture/tools/generate-subpackage-structure-audit.js
node architecture/tools/generate-compatibility-mirror-audit.js
node architecture/tools/run-guardrails.js
node architecture/tools/run-wechat-official-checks.js --skip-cli
node architecture/tools/run-wechat-ci.js doctor
```

## 备注
- 子包 `import/*.json` 与 `native/*` 大量 UUID 文件属于 Cocos 编译产物，通常不可直接删除。
- 如果需要完整审计明细，可按需启用 full 模式；默认报告以“可读摘要 + 样例”为主，避免仓库膨胀。
