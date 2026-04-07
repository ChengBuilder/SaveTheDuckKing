# 迭代工作流（强制）

## 目标
每轮优化都必须留痕，保证“新同学只看文档就能理解项目和本轮改动”。

## 一键执行
```bash
node runnable_wechat_project/architecture/tools/run-iteration-cycle.js
```

## 流程内容
1. 生成模块索引：`docs/module-index.md`
2. 生成素材分层报告：`docs/asset-code-layout.md`
3. 执行护栏检查：语法、命名、分层、运行桥接安全
4. 生成本轮迭代报告：`docs/iterations/iteration-*.md`

## 每轮产物
- 当前架构与入口链路说明
- 启动模块清单
- 常用命令清单
- 本轮工作区变更文件列表
- 迭代历史索引：`docs/iterations/README.md`

## 注意事项
- 若护栏失败，必须先修复再继续迭代。
- 迭代报告应在本轮提交前重新生成一次，确保文件清单与提交一致。

