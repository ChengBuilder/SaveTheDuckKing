# 新成员上手指南

## 先看什么
1. `runnable_wechat_project/architecture/docs/README.md`
2. `runnable_wechat_project/architecture/docs/naming-conventions.md`
3. `runnable_wechat_project/architecture/boot/game-bootstrap.js`
4. `runnable_wechat_project/architecture/memory/project-memory.md`
5. `runnable_wechat_project/architecture/skills/maintainer/SKILL.md`

## 从哪里开始改
1. 启动与平台适配：改 `architecture/boot/*`
2. 可读化或分析：改 `architecture/tools/*`
3. 打包产物本体（`game.js`）只做“接入点替换”，避免深改

## 迭代流程建议
1. 先在 `architecture` 层完成改造和验证
2. 只在必要时改动 `game.js` 的入口桥接代码
3. 每次改造单独提交，提交信息包含“范围 + 目的”
4. 每次改造结束后执行：
   `node runnable_wechat_project/architecture/tools/run-guardrails.js`

## 性能排查优先级
1. 启动阶段：像素比、帧率、首屏链路
2. 资源阶段：首屏加载资源量和分包加载时机
3. 渲染阶段：高频更新节点数量与 UI 重绘
