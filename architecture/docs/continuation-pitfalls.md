# 续航避坑手册（2026-04-10）

## 目的
- 这份文档记录本轮真实踩坑与已验证修复，避免换电脑后 AI 继续重复同类错误。
- 范围仅覆盖已在 `master` 落地并通过护栏/微信官方检查的结论。

## 本轮核心坑位

### 1) 仅做文件 remap 不足以解决分包加载
- 现象：
  - 大量 `Read file failed ... subpackages/.../import/... no such file or directory`
  - 伴随 Cocos 4930 / 分包未加载类错误。
- 根因：
  - 旧 bundle 名（如 `assets/mainbundle`、`assets/Game2Bundlebundle`）如果只在 `runtime/asset-file-remap.js` 做文件路径映射，仍可能错过 `loadSubpackage` 触发。
- 正确做法：
  - 必须先在 bundle downloader 入口做“旧名 -> canonical 名”归一化，再做文件 remap。
- 记忆锚点：
  - `architecture/boot/asset-path-normalizer.js`
  - `runtime/asset-file-remap.js`

### 2) 语义化脚本对 JSON 空白不容忍，复跑会失效
- 现象：
  - 首次跑能改；格式化后再次跑改写数异常为 0 或校验漏检。
- 根因：
  - 脚本/护栏大量使用严格匹配 `\"name\":\"...\"`，但格式化后变成 `\"name\": \"...\"`。
- 已修复方向：
  - 统一改为空白容忍模式：`\"name\"\\s*:\\s*\"...\"`。
  - `semanticize-shared.js`、DuckBundle 相关语义化脚本、`check-legacy-runtime-compat.js` 已收敛。
- 已落地提交：
  - `d92e2fe` `Stabilize uiBundle semanticize reruns`
  - `73e58ea` `Harden duck semanticize name matching`

### 3) 错选 import 目录导致“脚本看起来成功，实际没改”
- 现象：
  - 脚本输出通过但 replacement 长期为 0。
- 根因：
  - 只扫 `subpackages/uiBundle/import` 顶层，未命中真实 pack 文件路径（位于 `_packs/...`）。
- 正确做法：
  - 对明确目标使用 file-level 映射（`updateImportJsonNameMap`），不要依赖宽泛目录扫描。

### 4) 报告生成有噪音，导致无意义 diff
- 现象：
  - 每次生成报告都变化（时间戳），难审查真实改动。
- 根因：
  - 报告写入 volatile 字段（如 `generatedAt`）。
- 已修复方向：
  - UUID 报告去时间戳噪音，并修复 `name` 提取空白兼容。
- 已落地提交：
  - `0122b3b` `Stabilize uuid report name extraction`

### 5) HomeBundle 解锁提示仍有旧中文路径与名称
- 现象：
  - `tex/获得100只鸭子解锁`、`tex/获得100只鹅解锁`、`tex/光` 与 `gooseTip` 图集中文名称残留。
- 已修复方向：
  - 统一收敛到语义路径与名称，并保持脚本可复跑。
- 已落地提交：
  - `e34e48b` `Semanticize homebundle unlock tip assets`

### 6) 并行子任务可能晚到写回，污染工作区
- 现象：
  - 主流程已提交后，工作区突然出现同文件新改动。
- 根因：
  - 子 agent 超时后继续执行并写回。
- 规避策略：
  - 提交前必须 `git status --short --branch`。
  - 不再需要的子 agent 及时关闭。
  - 发现晚到写回时，先比对 diff，再决定保留或恢复，避免混入不确定改动。

### 7) 报告时间戳防回退护栏
- 强制规则：
  - 所有审计生成器禁止重新引入 `generatedAt` / `生成时间`（以及同类 volatile 生成时刻字段）。
- 护栏兜底：
  - `architecture/tools/check-no-volatile-report-timestamps.js` 会阻断这类回退；命中后必须先去除时间戳字段再提交。

## 固化执行清单（每个优化切片都要做）
1. 先确认变更边界：`git status --short --branch`。
2. 脚本语法检查：`node --check <script>`。
3. 脚本复跑验证：第二次执行应稳定（通常改写数为 `0`）。
4. 护栏检查：`npm run -s guardrails`。
5. 微信官方检查：`npm run -s wechat:official:check -- --port=29708 --auto-port=29709`。
6. 仅提交预期文件；如涉及 pack 被格式化导致包体统计变化，同步提交 `architecture/docs/wechat-code-package-report.json`。

## 命名与改动边界约束
- 禁止新增运行时深度兼容补丁；优先改源头（`game.js` / bundle config / import 元数据）。
- 新增/修改 `name` 匹配规则时，默认使用空白容忍正则，不允许再引入严格 `\"name\":\"...\"` 假设。
- 继续保持“所有提交走 `master` 并直接推送”。
