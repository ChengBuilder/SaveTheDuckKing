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
- Cocos 微信适配层会先按 bundle 名判断是否命中 `subPackages` 并触发 `loadSubpackage`；因此旧 bundle 名必须先在 downloader 入口归一化成 canonical bundle 名，不能只做文件路径 remap。
- `architecture/boot/asset-path-normalizer.js` 负责 bundle 请求归一化与扁平资源路径修正；允许保留“旧 bundle 名 -> canonical bundle 名”的启动级契约补丁，但禁止再次接入 Home/ui/玩法层深度业务路径兼容。
- `runtime/asset-file-remap.js` 负责真实文件名重映射，以及 canonical/legacy `config.json` 到语义化配置文件名的桥接；文件 remap 不能替代 bundle 身份归一化。
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
- 2026-04-10 运行时回归结论：`assets/mainbundle`、`assets/Game2Bundlebundle` 这类旧名如果只在 fs/media 层 remap，会出现“分包尚未加载”与 Cocos 4930；必须先在 bundle downloader 层归一化到 `main`、`Game2Bundle` 等 canonical 名。
- 如果需要完整审计明细，可按需启用 full 模式；默认报告以“可读摘要 + 样例”为主，避免仓库膨胀。

## 跨机续航（2026-04-10）
- 本轮踩坑与修复清单已沉淀到：
  - `architecture/docs/continuation-pitfalls.md`
- 新 AI 接手时先读这份文档，再开始改动，可避免重复踩坑：
  - 分包加载：先 bundle 名归一化，再文件 remap。
  - 语义化/护栏正则：统一使用 `\"name\"\\s*:\\s*\"...\"` 空白容忍。
  - 提交前清理并行残留：确保工作区只含预期改动。
  - 报告时间戳防回退：审计生成器禁止回填 `generatedAt`/`生成时间`，由 `architecture/tools/check-no-volatile-report-timestamps.js` 护栏兜底。

## 完成定义（2026-04-11）
- 项目终态目标：从“解包可运行工程”收敛到“可持续维护的真实项目形态”，并以真机体验为准。
- 达成完成需同时满足以下 4 条：
  1. `game.js` 仅保留入口职责，玩法核心从单体编译产物逐步拆回可维护源码模块（`src/` 等）。
  2. 运行时兼容桥（路径/别名/镜像）缩减到最小集合，并具备可执行的退场计划；禁止继续堆叠新兼容层。
  3. 真机性能达标：重点场景（螺丝/木板生成高峰、连续游玩）帧率与发热在可接受范围，且无持续异常刷屏。
  4. 自动化可回归：除结构/包体护栏外，补齐关键玩法回归与性能基线检查，避免靠人工反复盯日志。
- 当前推进顺序（固定）：
  1. P0：卡顿和发热（生成阶段、高频更新、资源加载峰值）。
  2. P1：模块拆分与去混淆（职责边界清晰、删除无效代码）。
  3. P2：兼容桥退场（保留必要最小集并逐步下线）。
  4. P3：文档/测试收口（README、目录职责、回归脚本）。

## 最新里程碑（2026-04-12）
- `game.js` 已落地为瘦入口（36 行），大体量 `define` 模块迁移到 `runtime/gamejs-modules/`。
- 新增自动拆分器：`architecture/tools/split-gamejs-into-modules.js`，可在每次上游更新后一键重建拆分产物，避免手工维护 2.7MB 单体入口。
- 迭代流水线已纳入拆分步骤：`run-iteration-cycle.js` 会先完成入口拆分，再执行审计与护栏。
- 当前阶段判断：
  - P1（模块拆分与去混淆）进入“可持续推进”状态：入口已拆，后续重点转向高混淆模块的语义化回填。
  - P2（兼容桥退场）尚未开始实质收缩，需要在模块语义化后逐步识别可下线桥接。

## 睡前交接（2026-04-12）
- 线上仍有稳定复现报错：Cocos Error 3804（`getComponent` 参数无效），堆栈固定落在：
  - `037__cocos-js___virtual_cc-cf1p7Jgo.js` -> `e.getComponent`
  - `036__assets__start-scene__index.start-scene.js` -> `r.update`
- 本轮已完成的硬修：
  - `split-gamejs-into-modules.js` 增加自动改写：
    - `getComponent(本地脚本导入变量)` -> `getComponent("类名")`
    - `getComponent(xxx.Skeleton)` -> `getComponent("sp.Skeleton")`
  - 重新生成 `runtime/gamejs-modules/*`，并通过 `verify-runtime-safety` 与 `run-guardrails`。
- 但 3804 仍存在，说明仍有 `update` 热路径调用到无效 `getComponent` 参数，且不只限于已改写模式。
- 明日首要动作（P0）：
  1. 在 `036` 中对全部 `update=function` 内的 `getComponent/getComponents` 建立调用清单与参数映射。
  2. 对调用参数加运行期采样埋点（仅开发态），打印首次无效参数来源模块与参数值。
  3. 反向收敛到生成器规则（优先修源：`split-gamejs-into-modules.js`），避免手工改产物。
