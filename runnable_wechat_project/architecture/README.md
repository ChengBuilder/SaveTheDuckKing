# architecture

这里是项目的可维护层入口，建议把后续迭代都放在这里。

- 启动逻辑：`boot/`
- 规范与上手文档：`docs/`
- 自动化脚本：`tools/`
- 项目长期记忆：`memory/`
- 项目内技能说明：`skills/`

建议每次迭代后至少执行：

```bash
node runnable_wechat_project/architecture/tools/run-guardrails.js
node runnable_wechat_project/architecture/tools/generate-iteration-report.js
node runnable_wechat_project/architecture/tools/run-iteration-cycle.js
```
