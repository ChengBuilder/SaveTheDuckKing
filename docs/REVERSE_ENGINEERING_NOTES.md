# 深度玩法逆向思路

## 1. 主玩法：DuckController

`DuckController.ts` 是当前项目最核心的玩法脚本之一。

它在 `onLoad()` 中会做几件事：

- 初始化游戏状态
- 初始化节点引用
- 设定关卡
- 初始化 UI
- 初始化鸭子和笼子动画
- 读取关卡信息
- 根据关卡信息生成木板结构

代码特征非常明确：

- `woodArr`
- `NailNode`
- `createWood(...)`
- `woodAddLinerVelocity(...)`
- `NoTouchNailNum`
- `reviveNum`
- `prop1Num / prop2Num / prop3Num / prop4Num`
- `GyroscopeCd`

这说明它的主玩法是：

- 关卡配置先描述木板和钉子的组合结构
- 玩家点击/操作木板或钉子
- 通过物理系统让结构发生变化
- 最终让鸭子脱困或达成目标

### 关卡机制

`GameData.ts` 并不直接存完整关卡坐标，而是定义当前关卡应该开启哪些模式：

- 锁定模式
- 冰冻模式
- 单木板类型模式
- 单木板颜色模式
- snag 模式
- combination 模式
- tidy 模式
- rotate 模式

判断逻辑基于 `level` 的区间和取模。

这意味着：

- 完整关卡布局数据在别处
- `GameData.ts` 更像“关卡规则开关”
- 真正的布局/木板 prefab 生成逻辑在 `DuckController` 及相关 prefab 初始化代码里

### 资源落点

主玩法最值得继续深挖的资源目录：

- `project_bundle/unpacked_by_pkg/_subpackages_DuckBundle_/subpackages/DuckBundle/`

重点关注：

- `prefab/wood/...`
- `prefab/WarningUI`
- 与钉子/木板/警告提示相关的 sprite / prefab

从代码看，`DuckController` 会动态按名字拼 prefab 路径，例如：

- `prefab/wood/wood{type}`
- `prefab/WarningUI`

所以后续改玩法时，最实用的切入点就是这块资源。

## 2. 第二玩法：Game2Controller + FruitManager + Fruit

这一套是很完整的“水果鸭”玩法链路。

### Game2Controller 的职责

`Game2Controller.ts` 负责：

- 场景节点初始化
- UI 初始化
- 背景图切换
- 鸭子/鸽子展示切换
- 关卡提示
- 道具入口
- 复活和失败逻辑

明显的玩法特征：

- `fruitNode`
- `fruitNumLabel`
- `NoTouchFruitNum`
- `moveFruitByGyroscope(...)`
- `initWarning()`

并且 GM 文案直接写成：

- `首页-救救水果鸭`

### FruitManager 的职责

`FruitManager.ts` 才是真正的关卡生成器和局面控制器。

它负责：

- 初始化关卡配置
- 初始化网格
- 生成水果
- 处理 tidy / hole / snag / lock 等模式
- 管理 fruit hole
- 统计剩余水果

代码里出现的关键结构：

- `countNumArr`
- `fruitTypeArr`
- `gridFruitPos`
- `fruitHoleArr`
- `fruitInHoleArr`
- `fruitCreateNum`

这说明它是典型的“配置驱动 + 动态生成”的休闲玩法结构。

### Fruit 的职责

`Fruit.ts` 负责单个水果对象的行为：

- 初始化半径、缩放、类型
- 处理锁定状态
- 处理入洞状态
- 播放入场动画
- 响应点击
- 触发下落/消除/移动

从代码特征看，玩法是：

- 水果先静态生成
- 玩家点击后水果进入动态物理/移动状态
- 伴随连锁、入洞、清除、重排等规则完成通关

### GameData2 的意义

`GameData2.ts` 是水果玩法的模式开关：

- `lockMode`
- `tidyMode`
- `snagMode`
- `holeMode`

同样是按 `level2 % 10` 的规则切换。

这说明水果玩法也是：

- 统一的一套底层玩法
- 通过关卡编号映射不同规则组合

### 资源落点

重点目录：

- `project_bundle/unpacked_by_pkg/_subpackages_Game2Bundle_/subpackages/Game2Bundle/`

你会在里面直接看到：

- `prefab/fruit1 ... prefab/fruit34`
- `prefab/fruitHole`
- `tex/fruit/...`
- `tex/fruitShadow/...`
- `tex/背景/game2_bg1 ... game2_bg5`

这套资源是很适合二次逆向、换皮和玩法观察的。

## 3. 首页与产品壳

`HomeScene.ts` 不是简单的封面，而是一个玩法分发页。

从字段就能看出产品壳特征：

- `cockStartBtn`
- `pigeonStartBtn`
- `game2Btn`
- `game3Btn`
- `bookBtn`
- `bookPigeonBtn`
- `addTableBtn`
- `addProgramBtn`
- `subscribeBtn`

也就是说，这个项目更像一个“鸭子系列玩法聚合器”，而不是单玩法小游戏。

## 4. 广告、分享、陀螺仪和平台层

### 微信层

`AdManager_WX.ts` 里确认了这些能力：

- `wx.createRewardedVideoAd`
- `wx.showShareMenu`
- `wx.shareAppMessage`
- `wx.startGyroscope`
- `wx.stopGyroscope`
- `wx.restartMiniProgram`

并且陀螺仪直接和两个玩法控制器绑定：

- `DuckScene` -> `woodAddLinerVelocity(...)`
- `Game2Scene` -> `moveFruitByGyroscope(...)`

这说明“设备晃动/倾斜影响局面”是玩法设计的一部分，而不是外围彩蛋。

### 途悦层

`TooYueManager.ts` 说明项目接了一个统一的平台/运营 SDK，主要负责：

- 登录
- 激励视频
- 插屏
- 分享
- 录屏
- 侧边栏
- 加桌面
- 动态配置

### 服务层

`ServiceManager.ts` 主要同步：

- level
- level2
- level3
- subscribe
- pigeonNumArr
- shareLevel

这说明服务端更多像“轻存档/增长状态”服务，而不是重逻辑服务。

## 5. 后续逆向建议

如果你后面要继续深入，推荐这样做：

1. 先把 `DuckController.ts` 中所有和 `createWood`、`setLevel`、`getLevelInformation` 相关的方法单独抽出来。
2. 再把 `Game2Controller.ts`、`FruitManager.ts` 里 `initLevelConfig`、`initGrid`、`initFruit` 相关逻辑抽出来。
3. 针对 `main/config.14565.json`、`DuckBundle/config.d301a.json`、`Game2Bundle/config.7deca.json` 建一份“uuid -> prefab/path”映射表。
4. 如果要做玩法修改，优先改 prefab 和配置，不要一开始就改整个运行时。
5. 如果要做自动化反编译，下一步最值得写的是：
   - `System.register` 模块提取器
   - bundle config 资源路径索引器
   - scene/prefab json 结构可视化脚本

## 6. 最重要的判断

这份包已经足够支持：

- 继续做结构级逆向
- 定位主玩法和副玩法资源
- 做皮肤/文案/资源替换
- 做脚本层 patch
- 做关卡模式和成长逻辑分析

但它还不是“能直接在 Cocos Creator 里一键打开”的原始工程。
