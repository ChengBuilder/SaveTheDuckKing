# readable_project

这份目录是从 `runnable_wechat_project/` 自动生成的可读化镜像。

目标：

- 保留小游戏可运行目录不变
- 把主包和子包入口重新格式化
- 把 `define(...)` 模块逐个拆出
- 把模块内部的 `System.register(...)` 再拆成单文件，方便继续分析

主要产物：

- `summary.json`：整体统计
- `metadata/`：运行配置和 bundle 配置
- `__APP__/formatted-game.js`：主包排版后版本
- `__APP__/define_modules/`：主包里的 `define(...)` 模块
- `__APP__/system_register_modules/`：主包里识别到的 `System.register(...)` 模块
- `subpackages/*/formatted-game.js`：各子包入口排版后版本

说明：

- 这里做的是发布产物级别的可读化，不是恢复原始 TypeScript 工程。
- 模块名能恢复的地方已经按运行时模块名落盘，例如 `AdManager_WX.ts`、`LoadScene.ts` 一类名字。
- 局部变量名如果在发布阶段已经被压缩成 `a/b/c`，这里只能做到按模块拆开和重新排版，无法无损恢复原始语义名。

当前共整理 9 个 bundle。
