# 新成员上手指南

## 先看什么
1. `architecture/docs/README.md`
2. `architecture/docs/naming-conventions.md`
3. `architecture/docs/asset-code-boundaries.md`
4. `architecture/boot/game-bootstrap.js`
5. `architecture/boot/boot-safety.js`
6. `architecture/boot/platform-strategy.js`
7. `architecture/boot/performance-strategy.js`
8. `architecture/boot/boot-observer.js`
9. `architecture/memory/project-memory.md`
10. `architecture/skills/maintainer/SKILL.md`
11. `architecture/docs/guardrail-report.md`
12. `architecture/docs/iterations/README.md`
13. `architecture/docs/iteration-workflow.md`
14. `architecture/docs/debug-output.md`

## 从哪里开始改
1. 启动与平台适配：改 `architecture/boot/*`
2. 可读化或分析：改 `architecture/tools/*`
3. 打包产物本体（`game.js`）只做“接入点替换”，避免深改

## 迭代流程建议
1. 先在 `architecture` 层完成改造和验证
2. 只在必要时改动 `game.js` 的入口桥接代码
3. 每次改造单独提交，提交信息包含“范围 + 目的”
4. 每次改造结束后执行：
   `node architecture/tools/run-guardrails.js`
5. 如涉及资源包调整，再执行：
   `node architecture/tools/check-asset-code-separation.js`
6. 每轮优化完成后执行：
   `node architecture/tools/generate-iteration-report.js`
7. 如果希望一次性完成全部流程，执行：
   `node architecture/tools/run-iteration-cycle.js`
8. 若需复盘校验细节，查看：
   `architecture/docs/guardrail-report.md`

## 性能排查优先级
1. 启动阶段：像素比、帧率、首屏链路
2. 资源阶段：首屏加载资源量和分包加载时机
3. 渲染阶段：高频更新节点数量与 UI 重绘
