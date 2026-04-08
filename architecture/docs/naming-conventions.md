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
- `import` 目录只放配置/元数据，不放素材二进制
