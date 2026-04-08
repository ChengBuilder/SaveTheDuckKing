# 命名规范（强制）

## 1. 文件名
- 统一使用 `kebab-case`，示例：`game-bootstrap.js`
- 目录按职责命名，示例：`boot`、`tools`、`docs`

## 2. 变量与函数
- 统一使用 `camelCase`
- 布尔值必须以语义前缀开头：`is` / `has` / `can` / `should`
- 禁止无语义命名：`a`、`b`、`tmp`、`data1`
- 循环计数器允许使用 `index`、`i`（仅限短局部循环）

## 3. 常量
- 统一使用 `UPPER_SNAKE_CASE`
- 常量需在定义处说明用途，推荐使用中文注释

## 4. 模块导出
- 导出函数名必须表达行为：`bootGameRuntime`、`applyFrameRatePolicy`
- 禁止导出匿名对象中的匿名函数

## 5. 注释规范
- 所有导出函数必须有中文 JSDoc
- 复杂流程函数必须说明“为什么这么做”，不只写“做了什么”
- 关键参数和返回值必须有注释

## 6. 代码结构
- 启动相关代码仅放在 `architecture/boot`
- 分析脚本仅放在 `architecture/tools`
- 文档仅放在 `architecture/docs`

## 7. 素材与代码边界
- `architecture` 目录禁止提交图片、音频、视频、字体和二进制素材
- `native` 目录只放素材，不放脚本
- `import` 目录只放配置/元数据，不放图片、音频、视频、字体这类原生素材
- Cocos 编译出的 `import/*.bin`（CCON 元数据）视为 import 元数据，不按 native 素材处理

## 8. 素材命名治理
- 语义目录优先于 UUID 文件名；能通过 bundle 配置、场景路径、Prefab 路径识别语义的，先在目录层和资产目录文档中表达含义
- Prefab 统一放在 `prefab/<模块>/<实体名>`，避免仅用数字或无语义缩写
- 纹理统一放在 `tex/<模块>/<类别>/<资源名>`，按钮、图标、背景、进度条不得混在同一层
- 音频统一放在 `audio/<玩法或场景>/<事件名>`，例如 `audio/fruit-game/eliminate-3`
- 动画统一放在 `animation/<玩法或场景>/<动作名>`，不要继续沿用 `skeleton2`、`video5` 这类编号式名称
- 编译产物层的 `import/`、`native/` 仍可能保留 UUID 文件名；在没有源资源重建链路前，不直接硬改这类文件名，先通过 bundle 语义目录与自动资产目录完成可读化治理
- `audioBundle` 的 canonical 路径优先收敛到 `bgm/`、`duckGame/`、`fruitGame/`、`sceneTransition/`、`ui/`、`comboMusic/`、`woodDrop/` 这些一级目录
- 新增音频禁止继续直接落在 `audioBundle` 根层；确有历史遗留时，必须先在治理记录里说明语义，再安排下一轮收敛
