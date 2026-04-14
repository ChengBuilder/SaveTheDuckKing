# SaveTheDuckKing Source Project

`reconstructed-project/` 现在就是后续唯一维护的源工程。

它可以直接被 Cocos Creator 3.8.7 打开、构建成微信小游戏，并且已经同步了当前主流程所需的核心代码、资源、运行时目录和构建工具链。仓库根目录里的旧解包工程只保留历史上下文，不再作为日常开发入口。

## 快速开始

在当前目录执行：

```bash
npm install
npm run runtime:repack-from-source
npm run guardrails
npm run cocos:build:wechat
```

构建产物输出到：

```bash
build/wechatgame
```

可直接导入微信开发者工具运行。

## 打开方式

- Cocos Creator 3.8.7：打开 `reconstructed-project/`
- 微信开发者工具：导入 `reconstructed-project/build/wechatgame`

## 当前进度速览

- `assets/scenes/WoodGallery.scene` 现在已经不是单纯的木板陈列页，而是同时包含木板画廊和一个 `revive` 可玩切片实验区。
- `assets/prefabs/gameplay/wood/` 已经生成了四个正式的 Creator `wood prefab` 资产：`wood2`、`wood11`、`wood37`、`wood42`。
- `assets/scripts/gameplay/revive/RevivePlayableSlice.ts` 已经把 revive 木板规划、木板 prefab 实例化、钉子飞入槽位这一小段链路接进 Creator 原生场景；本轮还补上了基础音效和更接近旧 runtime 的错峰节奏。
- `assets/scripts/gameplay/revive/ReviveSemanticAudio.ts` 已经把 `woodAssembleLead / woodAssembleFollow / woodCollision` 三段 revive 语义音频接入主切片。
- `assets/scripts/gameplay/revive/ShowcaseChromeAuthoring.ts` 已经接到 `WoodGallery.scene` 和 `Game.scene`，两个迁移场景现在打开时会带上明确的展示标题、说明和引导文案。
- `assets/scenes/Game.scene` 已经落成第一版正式玩法骨架，包含 `GameplayRoot / BoardRoot / ReviveSliceHost / FXRoot / UIRoot / DebugRoot` 标准根节点层级，后续主玩法会从这里继续生长。
- 当前默认构建启动场景仍然是 `assets/scene/LoadScene.scene`；`WoodGallery.scene` 和 `Game.scene` 目前都还是 Creator 原生迁移场景，不是正式游戏入口。
- 现在看到的木板/钉子效果仍有一部分是占位渲染，不等于原游戏最终观感；它解决的是“先把 Creator 原生结构跑通”，不是“今天已经 1:1 复刻完视觉效果”。
- Creator CLI 构建仍可能返回状态码 `36`，但最新已确认是网络/登录接口超时噪声；`build/wechatgame` 产物生成和同步不受影响。
- 本地 Cocos MCP 服务已经连通并完成实测：`scene_get_scene_list`、`scene_open_scene`、`assetAdvanced_validate_asset_references` 均可正常工作，后续可以继续用它做 Creator 侧校验。

## 当前项目结构（中文注释）

说明：

- 以下结构图以“当前需要理解和维护的目录 / 入口文件”为主。
- Creator 自动生成的 `.meta`、bundle 哈希分片、`build/`、`temp/`、`library/`、`node_modules/` 不逐一展开。
- 你后面主要会在 `assets/`、`architecture/`、`source-project/` 这三块工作。

```text
reconstructed-project/
  README.md                                 # 当前项目总说明；你现在看的就是它
  .gitignore                                # Git 忽略规则
  package.json                              # npm 脚本入口；构建/校验/迁移命令都从这里发起
  package-lock.json                         # npm 依赖锁定文件
  game.js                                   # 微信小游戏根入口；负责启动小游戏运行时
  game.json                                 # 微信小游戏主配置；含分包声明、方向等
  app-config.json                           # 当前项目应用配置
  project.config.json                       # 微信开发者工具共享配置
  project.private.config.json               # 微信开发者工具本地私有配置

  docs/
    creator-source-blueprint.md             # 我们定义的“最终 Creator 源工程形态”和迁移规则

  architecture/                             # 工具链、启动治理、迁移说明、过程报告
    README.md                               # architecture 目录总说明
    boot/                                   # 启动治理层；负责把小游戏真正拉起来
      app-lifecycle.js                      # 应用生命周期编排
      asset-path-normalizer.js              # 资源路径规整与兼容
      boot-logger.js                        # 启动日志输出
      boot-observer.js                      # 启动过程观察器
      boot-safety.js                        # 启动安全保护
      config.js                             # 启动配置聚合
      game-bootstrap.js                     # 游戏启动编排主入口
      global-context.js                     # 全局上下文挂载
      performance-strategy.js               # 性能策略
      platform-strategy.js                  # 平台差异策略
      recovery-strategy.js                  # 故障恢复策略
      render-policies.js                    # 渲染策略
      runtime-bridge.js                     # 运行时桥接
      runtime-governance.js                 # 运行治理规则
      system-info.js                        # 系统环境信息读取
    migration/                              # 迁移清单与迁移输入
      creator-source-assets.manifest.json   # 语义素材导出清单；当前只导出合法直接素材
    readable/                               # 可读镜像层；帮助理解旧逻辑，不直接参与运行
      README.md                             # 可读镜像说明
      duck-board-generation.js              # 木板/钉子生成逻辑的可读版映射
    reports/                                # 阶段性报告、迁移记忆、导出结果
      DEV_MEMORY_2026-04-13.md              # 当前阶段开发记忆
      MIGRATION_PROGRESS_2026-04-13.md      # 当前迁移进度、验证入口、已知坑点总览
      creator-source-assets-report.json     # 语义素材导出报告
      wechat-code-package-report.json       # 微信包体检查结果（JSON）
      wechat-code-package-report.md         # 微信包体检查结果（Markdown）
      wood-authoring-prefabs-report.json    # wood 作者化 prefab 生成报告
      wood-prefab-blueprints-report.json    # 木板蓝图提取报告
    tools/                                  # 自动化脚本；构建、校验、导出、清理都在这里
      build-cocos-wechat-runtime.js         # 调用 Cocos 构建并同步到微信包目录
      check-config-version-asset-integrity.js # 校验 bundle 配置与真实资源是否一致
      check-legacy-runtime-compat.js        # 校验旧运行时兼容残留是否还安全
      check-wechat-code-package-limits.js   # 校验微信包体大小
      extract-wood-prefab-blueprints.js     # 从旧木板 prefab 提取语义蓝图
      format-project-json.js                # 规范化项目 JSON 文件格式
      generate-wood-authoring-prefabs.js    # 按木板蓝图生成正式 Creator wood prefab
      materialize-semantic-source-assets.js # 从旧 bundle 导出合法的语义素材
      normalize-runtime-module-filenames.js # 规范化 runtime 模块文件名
      project-paths.js                      # 项目路径工具
      prune-legacy-hash-layout.js           # 清理旧哈希布局资源
      prune-unreferenced-bundle-assets.js   # 清理未引用 bundle 资源
      repack-runtime-modules-from-source.js # 从 source-project 回封装到 runtime
      run-guardrails.js                     # 护栏总入口；串联多种校验
      run-minigame-test-doctor.js           # 小游戏自动化测试环境自检
      run-minigame-test.js                  # 小游戏自动化测试执行器
      run-wechat-ci.js                      # 微信 CI 包装命令
      run-wechat-official-checks.js         # 微信官方检查包装命令
      verify-runtime-safety.js              # 运行时安全校验
      verify-wechat-minigame-structure.js   # 微信小游戏结构校验
      wechat-minigame-test-common.js        # 小游戏自动化测试公共工具

  assets/                                   # Creator 源资产根目录；未来真正长期维护的核心区
    audio/                                  # 语义化音频源资产
      gameplay/
        revive/
          woodAssembleLead.mp3              # 复活木板拼装音效 1
          woodAssembleFollow.mp3            # 复活木板拼装音效 2
          woodCollision.mp3                 # 木板碰撞音效
    data/                                   # 结构化玩法数据 / 语义蓝图
      gameplay/
        wood/
          wood-prefab-blueprints.json       # 木板 prefab 蓝图；含尺寸、碰撞点、钉子锚点
    internal/                               # 旧 root bundle 兼容目录；当前运行仍需要
      config.internal.json                  # internal bundle 配置
      import/                               # internal bundle 的导入分片目录
      index.internal.js                     # internal bundle 运行入口
      index.js                              # internal bundle 对外入口壳
    internalbundle/                         # internal bundle 的兼容壳目录
      config.json                           # 兼容壳配置
      index.js                              # 兼容壳入口
    prefabs/                                # Creator prefab 源目录；这里只放真正重建过的 prefab
      gameplay/
        wood/                               # 已生成的木板作者化 prefab；当前含 wood2/11/37/42
    scene/                                  # 当前仍在使用的旧桥接场景目录
      LoadScene.scene                       # 当前 Creator 构建启动场景；历史缺失引用已清理
    scenes/                                 # 新的 Creator 场景目录；真正可编辑场景从这里生长
      Game.scene                            # 正式玩法骨架场景；已建立 Gameplay/UI/FX/Debug 根层级并挂上 revive 切片
      WoodGallery.scene                     # 木板画廊 + revive 可玩切片实验场景；可在 Creator 中直接预览迁移成果
    scripts/                                # 新的 Creator 源代码目录
      gameplay/
        revive/
          LegacyRuntimeReviveWoodPlanAdapter.ts # 旧 runtime 节点到新 revive 规划的适配层
          RevivePlayableSlice.ts            # revive 可玩切片组件；在 Creator 场景里播放木板拼装 + 钉子飞入
          ReviveWoodPlan.ts                 # revive 木板规划逻辑的语义化源码
        wood/
          WoodPrefabBlueprint.ts            # 木板蓝图 TS 类型定义
          WoodPrefabBlueprintCatalog.ts     # 木板蓝图目录模块；供后续 prefab/scene 重建调用
          WoodPrefabNodeFactory.ts          # 按蓝图创建木板节点树的底层工厂
          WoodPrefabRuntimeBuilder.ts       # 按 woodType 从蓝图库直接构建木板节点树
          WoodBlueprintPreview.ts           # 可挂到 Creator 节点上的木板预览组件
          WoodPrefabAuthoringHost.ts        # 单块木板生成宿主；可挂空节点并保存为真正 prefab
          WoodPrefabGalleryAuthoring.ts     # 木板画廊生成宿主；可批量预览多种 woodType
    spine/                                  # Spine 源资产目录
      gameplay/                             # gameplay 相关 Spine 预留目录
    start-scene/                            # 旧 start-scene root bundle；当前实际运行仍依赖
      config.start-scene.json               # start-scene bundle 配置
      import/                               # start-scene 导入分片目录
      native/                               # start-scene 原生资源目录
      index.js                              # start-scene bundle 入口壳
      index.start-scene.js                  # 当前主玩法 runtime 大文件；仍在逐步拆解中
    start-scenebundle/                      # start-scene bundle 的兼容壳目录
      config.json                           # 兼容壳配置
      index.js                              # 兼容壳入口
    textures/                               # 纹理源资产目录
      gameplay/
        wood/                               # 木板纹理预留目录；后续会按语义迁入贴图

  cocos-js/                                 # Cocos 引擎相关运行时资源
    assets/
      spine-CC34fKUR.wasm                   # Spine WASM 运行文件

  profiles/                                 # Creator 构建 / 编辑器 profile
    v2/
      editor/                               # 编辑器 profile
      packages/                             # 包配置 profile

  settings/                                 # Creator 项目设置
    v2/
      default-profiles/                     # 默认 profile
      packages/                             # 包级设置

  source-project/                           # runtime 过渡翻译层；当前还在维护的旧逻辑拆分区
    README.md                               # source-project 使用说明
    runtime-modules/
      @babel/                               # Babel helper 运行时模块
      application-main.js                   # 应用主入口模块
      assets/                               # runtime 视角下的资源入口模块
      cocos-js/                             # runtime 视角下的引擎桥接模块
      engine-adapter.js                     # 引擎适配模块
      first-screen.js                       # 首屏启动模块
      game.js                               # runtime 游戏入口模块
      src/                                  # runtime 视角下的脚本打包模块
      subpackages/                          # runtime 视角下的分包入口模块
      subpackages-bootstrap.js              # 分包启动桥
      web-adapter.js                        # Web/小游戏适配桥

  runtime/                                  # 当前真正给小游戏运行的模块化产物；由工具生成，不直接手改
    gamejs-modules/
      manifest.js                           # 运行时模块清单脚本
      manifest.json                         # 运行时模块清单 JSON
      mod__*.js                             # 规范化后的模块文件；基本镜像自 source-project/runtime-modules

  src/
    runtime-settings.json                   # 运行时设置文件；构建产物会读取它

  subpackages/                              # 微信小游戏分包；当前仍是兼容输入层
    DuckBundle/
      config.duck-bundle.json               # 玩法主资源包配置
      game.js                               # DuckBundle 分包入口
      import/                               # DuckBundle 导入分片
      native/                               # DuckBundle 原生资源
    HomeBundle/
      config.home-bundle.json               # HomeBundle 配置
      game.js                               # HomeBundle 分包入口
      import/                               # HomeBundle 导入分片
      native/                               # HomeBundle 原生资源
    aniBundle/
      config.animation-bundle.json          # 动画资源包配置
      game.js                               # 动画包分包入口
      import/                               # 动画包导入分片
      native/                               # 动画包原生资源
    audioBundle/
      config.audio-bundle.json              # 音频资源包配置
      game.js                               # 音频包分包入口
      import/                               # 音频包导入分片
      native/                               # 音频包原生资源
    main/
      config.main.json                      # 主包配置
      game.js                               # 主包入口
      import/                               # 主包导入分片
      native/                               # 主包原生资源
    resources/
      config.resources.json                 # 公共 resources 配置
      game.js                               # resources 分包入口
      import/                               # resources 导入分片
      native/                               # resources 原生资源
    uiBundle/
      config.ui-bundle.json                 # UI 资源包配置
      game.js                               # UI 分包入口
      import/                               # UI 导入分片
      native/                               # UI 原生资源

  wechat-test/                              # 微信小游戏自动化测试相关目录
    minigametest/
      README.md                             # 自动化测试说明
      package.json                          # 测试工具依赖定义
      sample/
        test.js                             # 示例测试
      vendor/
        .gitkeep                            # 预留官方 SDK tgz 放置目录
```

## 建议开发流

1. 新的可读玩法逻辑优先写入 `assets/scripts/`。
2. 从旧 bundle 里抽取语义素材时，执行 `npm run source:materialize-assets`。
3. 从旧 prefab 提取语义结构时，执行 `npm run source:extract-wood-blueprints`。
4. 当木板蓝图发生变化，需要执行 `npm run source:generate-wood-prefabs` 重新生成正式 `wood prefab`。
5. 仍在过渡中的 runtime 逻辑继续维护 `source-project/runtime-modules/`。
6. 执行 `npm run runtime:repack-from-source` 同步到 `runtime/gamejs-modules/`。
7. 执行 `npm run guardrails` 做结构与资源校验。
8. 执行 `npm run cocos:build:wechat` 生成 `build/wechatgame`。
9. 导入微信开发者工具验证。

## 当前约定

- 不再维护 `source/` 镜像、`assets-restored/` 参考树或其他解包重建中间产物。
- 后续如需继续去混淆、语义化命名、清理死分支，优先沉淀到 `assets/scripts/`；`source-project/runtime-modules/` 只作为过渡翻译层继续收口。
- 第一批 Creator 源资产迁移从 revive 切片开始，当前已落地 `assets/scripts/gameplay/revive/`、`assets/audio/gameplay/revive/`、`assets/data/gameplay/wood/`、`assets/scripts/gameplay/wood/` 和 `assets/prefabs/gameplay/wood/`。
- `assets/scripts/gameplay/wood/` 现在已经具备五层能力：蓝图类型、蓝图目录、按 `woodType` 构建节点树、Creator 内的单体/画廊式作者化组件、按蓝图生成正式 `wood prefab`；没有真贴图时也会用占位图形直接显示版型。
- `assets/scripts/gameplay/revive/RevivePlayableSlice.ts` 已经把 revive 主链的一段可玩切片接进 `assets/scenes/WoodGallery.scene`，当前可直接在 Creator 里预览木板出现和钉子飞入槽位。
- `assets/scripts/gameplay/revive/ReviveSemanticAudio.ts` 负责 revive 切片的语义音频加载与播放；后续新的 Creator 原生玩法音效优先走这类语义模块，而不是回旧 bundle 逻辑里找入口。
- `assets/scripts/gameplay/revive/ShowcaseChromeAuthoring.ts` 负责给迁移样板场景补展示层，避免 `WoodGallery.scene` / `Game.scene` 继续停留在纯技术试验外观。
- 旧 bundle 中的 prefab 序列化文件不会再直接进入 `assets/prefabs/`；必须先翻译成语义蓝图，再在 Creator 中重建成可编辑 prefab。
- `LoadScene.scene` 的历史缺失引用已经清掉；当前 Creator 仍返回状态码 `36`，但最新日志里这部分只剩网络/登录接口超时噪声，`build/wechatgame` 产物生成与运行时同步不受影响。
- `assets/scenes/WoodGallery.scene` 已经进入 Creator 资源列表；它不参与当前游戏启动，但可以作为后续重建 prefab/scene 和 revive 动效的实验入口。
- 本地 MCP 地址当前配置为 `http://127.0.0.1:3000/mcp`；如果 Creator 正在运行，后续可以直接用它做场景打开、节点查询和资产引用校验。

## 当前已知坑

- `assets/prefabs/gameplay/wood/` 里的四个 `wood prefab` 目前属于“作者化 prefab”：外层是正式 Creator prefab，但内部木板节点树仍由 `WoodPrefabAuthoringHost` 在编辑态 / 运行态生成，还不是最终静态 prefab 形态。
- `WoodGallery.scene` 里的 revive 画面已经能跑，本轮也补进了基础音效和展示层；但视觉上仍有一部分依赖 `Graphics` 占位矩形/圆点，真实 sprite、阴影、高光、粒子和细节节奏还没完全对齐原游戏。
- Creator 自身的 `.meta` / `.scene` / `.prefab` 仍然会有 `uuid`，这是正常且不可避免的；我们当前要避免的是继续用旧 bundle 的 `uuid / pack id / 哈希路径` 作为长期维护入口。
- 旧主玩法的大量真实控制逻辑仍在 `assets/start-scene/index.start-scene.js` 与 `source-project/runtime-modules/` 这条过渡链上，新的 Creator 场景目前只接进了一个 revive 切片，还没有取代正式游戏入口。
