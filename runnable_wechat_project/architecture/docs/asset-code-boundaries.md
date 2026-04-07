# 素材与代码分层规范

## 目标
确保“可执行代码”和“二进制素材”长期分离，减少迭代时误改、误删和打包风险。

## 目录职责
- `architecture/`：仅放可维护代码、文档、工具，不放图片/音频/二进制素材。
- `assets/**/import`、`subpackages/**/import`：仅放元数据（主要为 `.json`）。
- `assets/**/native`、`subpackages/**/native`：仅放运行时素材（二进制资源）。
- `subpackages/**/game.js` 与根 `game.js`：仅放打包后的可执行脚本入口。

## 强制规则
1. `native` 目录禁止放脚本（`.js`/`.cjs`/`.mjs`/`.ts`）。
2. `import` 目录禁止放图片、音频、视频、字体等二进制素材。
3. `architecture` 目录禁止放素材文件。
4. 新增分包时必须保持 `import + native + game.js + config.*.json` 结构。

## 自动化检查
```bash
node runnable_wechat_project/architecture/tools/check-asset-code-separation.js
```

## 自动化报告
```bash
node runnable_wechat_project/architecture/tools/generate-asset-code-report.js
```

