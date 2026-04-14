# architecture

这里现在保留五层：

- `boot/`：启动链路与运行治理。
- `migration/`：迁移清单与迁移输入。
- `readable/`：旧逻辑的可读镜像层，帮助理解，不直接参与运行。
- `reports/`：阶段进度、迁移记忆、导出报告。
- `tools/`：主流程必需的校验、迁移、构建与微信检查脚本。

## 已收敛策略

- 不再维护无意义的历史中间产物，但会保留当前仍有迁移价值的 `migration/`、`readable/`、`reports/`。
- 资源完整性以 `config.*.json` 实际引用为准，直接校验真实文件是否存在。
- 目标是让工具链服务运行稳定，而不是制造更多中间层。
- `reports/MIGRATION_PROGRESS_2026-04-13.md` 与 `reports/DEV_MEMORY_2026-04-13.md` 是当前阶段最重要的状态记录。

## 建议执行顺序

```bash
node architecture/tools/materialize-semantic-source-assets.js
node architecture/tools/extract-wood-prefab-blueprints.js
node architecture/tools/generate-wood-authoring-prefabs.js
node architecture/tools/normalize-runtime-module-filenames.js
node architecture/tools/format-project-json.js
node architecture/tools/check-config-version-asset-integrity.js --strict-shard
node architecture/tools/verify-wechat-minigame-structure.js
node architecture/tools/verify-runtime-safety.js
node architecture/tools/check-legacy-runtime-compat.js
node architecture/tools/check-wechat-code-package-limits.js
```
