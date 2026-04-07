# 运行方式

## 当前状态

原始导出目录 `project_bundle/` 是“分析友好结构”，不适合直接拿去运行。

真正适合导入微信开发者工具的是组装后的目录：

- `runnable_wechat_project/`
- `readable_project/` 是自动生成的可读化镜像，方便继续分析代码，不作为运行目录导入

## 生成可运行目录

在项目根目录执行：

```bash
npm run assemble:runnable
```

然后执行静态校验：

```bash
npm run check:runnable
```

如果校验通过，说明运行所需的主入口、子包入口和基础配置都已经重建完成。

## 如何启动

推荐方式是微信开发者工具：

1. 打开微信开发者工具
2. 选择“小游戏”
3. 导入目录：
   `.../duck_game_wx244b1cb66c8ac4b4_export/runnable_wechat_project`
4. `AppID` 使用：
   `wxf5df710b4d8b61af`
5. 编译/预览

## 为什么不能直接用 Node 跑

这个项目是微信小游戏运行时产物，依赖：

- `wx.*` API
- 微信小游戏 canvas/runtime
- 小游戏子包加载机制

所以它不能像普通 Node 项目或普通网页项目那样直接 `npm start`。

## 当前已补的运行辅助文件

组装脚本会自动生成：

- `game.json`
- `project.config.json`
- `ASSEMBLY_REPORT.json`

这些文件是为了让导出的结构更接近微信开发者工具可识别的项目。

## 当前新增的可读化产物

组装脚本现在还会自动生成：

- `readable_project/summary.json`
- `readable_project/__APP__/define_modules/`
- `readable_project/__APP__/system_register_modules/`
- `readable_project/subpackages/*/formatted-game.js`

用途是把原本压成一行的小游戏 bundle 重新排版，并按模块名拆出来，方便继续阅读。

## 已知边界

即使组装完成，它也仍然是“发布产物逆向恢复版”，不是原始 Cocos Creator 编辑器工程，所以：

- 可以尝试在微信开发者工具里运行
- 不适合直接回到 Cocos Creator 里当源码项目编辑
