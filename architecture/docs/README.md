# 架构分层说明

## 目标
本目录用于承载**可维护代码层**，避免后续继续直接改动打包压缩产物。

## 目录约定
- `boot/`: 启动编排层（只做流程与初始化，不放业务玩法逻辑）
- `docs/`: 维护规范、命名规范、迭代指南
- `tools/`: 可读化与分析工具脚本（面向压缩产物）

## 启动层关键职责
- `boot/config.js`：配置默认值、全局覆盖与兜底
- `boot/boot-safety.js`：状态存储、重复启动保护、失败记录
- `boot/platform-strategy.js`：平台差异与启动调度
- `boot/performance-strategy.js`：渲染/帧率性能策略
- `boot/boot-observer.js`：启动阶段观测与运行时快照

## 推荐先读
1. `architecture/docs/naming-conventions.md`
2. `architecture/docs/project-structure.md`
3. `architecture/docs/onboarding.md`
4. `architecture/docs/guardrail-report.md`
5. `architecture/docs/iterations/README.md`
6. `architecture/docs/iteration-workflow.md`
7. `architecture/docs/debug-output.md`
8. `architecture/docs/performance-playbook.md`
9. `architecture/docs/uuid-asset-report.md`
10. `architecture/docs/subpackage-structure-audit.md`
11. `architecture/docs/compatibility-mirror-audit.md`
12. `architecture/docs/wechat-official-project-guide.md`

## 设计原则
1. 单一职责：一个模块只负责一种能力。
2. 命名可读：变量和函数按“语义优先”命名，禁止单字母命名（循环计数器除外）。
3. 注释中文化：所有导出的函数、关键流程函数都必须写中文注释。
4. 低侵入：优先“新增可维护层 + 轻量接入”，减少对原始打包代码的破坏。
5. 可回滚：每次改动尽量独立提交，便于快速定位问题。
