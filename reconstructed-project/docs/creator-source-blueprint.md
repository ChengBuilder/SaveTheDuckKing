# Creator Source Blueprint

## 目标

把 `reconstructed-project/` 从“可运行的 runtime 壳”逐步翻译成“真正可在 Cocos Creator 中长期再开发的源工程”。

## 目标目录

```text
reconstructed-project/
  assets/
    scenes/
    scripts/
      core/
      gameplay/
      ui/
      data/
      platform/
      utils/
    prefabs/
    textures/
    audio/
    spine/
    particles/
    fonts/
  architecture/
    boot/
    migration/
    reports/
    tools/
  build/
  docs/
  settings/
  profiles/
```

## 迁移原则

1. `assets/scripts/` 是新逻辑的首选落点，避免继续把业务语义埋在 `source-project/runtime-modules/` 大文件里。
2. `source-project/runtime-modules/` 只承担“理解旧逻辑、拆出可读模块、保持当前运行”的过渡职责。
3. 新增可编辑素材优先落到 `assets/audio`、`assets/prefabs`、`assets/textures`、`assets/spine` 等语义目录。
4. 旧 bundle 里的 `prefab` 序列化文件不能直接当成 Creator 源 prefab；要先提炼成语义蓝图，再在 Creator 中重建为真正可编辑的 prefab/scene。
5. `subpackages/` 和 `runtime/` 视为构建输入/输出兼容层，最终由 Creator 构建自动生成，不再长期手改。
6. 每次迁移优先选择“一个玩法切片 + 相关素材 + 最小可验证场景”，逐块闭环。

## 当前切片

第一批选择 revive 木板拼回流程，原因如下：

- 玩法边界相对清晰。
- 已经在 runtime 侧完成了第一轮 helper 拆分。
- 涉及到的音频和木板 prefab 路径明确，适合做第一批语义素材导出。

## 当前落地物

- `assets/scripts/gameplay/revive/ReviveWoodPlan.ts`
  纯玩法规划模块，负责 revive 木板类型与摆放计划。
- `assets/scripts/gameplay/revive/LegacyRuntimeReviveWoodPlanAdapter.ts`
  过渡适配层，用于从旧 `Nail` 节点提取 nail type 后接入新模块。
- `assets/scripts/gameplay/revive/RevivePlayableSlice.ts`
  revive 可玩切片组件，当前已在 Creator 原生场景里串起“木板出现 + 钉子飞入槽位”的一小段玩法。
- `assets/scripts/gameplay/revive/ReviveSemanticAudio.ts`
  revive 切片的语义音频加载与播放模块；当前先负责 `woodAssembleLead / woodAssembleFollow / woodCollision` 三段音频。
- `assets/scripts/gameplay/revive/ShowcaseChromeAuthoring.ts`
  迁移样板场景的展示层组件；当前用于给 `WoodGallery.scene` / `Game.scene` 提供标题、说明和引导文案。
- `architecture/tools/materialize-semantic-source-assets.js`
  从旧 bundle config 解析语义路径并导出第一批合法 Creator 源资产；当前只直接导出音频，不再把旧 prefab 序列化硬拷进 `assets/prefabs/`。
- `architecture/migration/creator-source-assets.manifest.json`
  第一批语义素材清单。
- `architecture/tools/extract-wood-prefab-blueprints.js`
  从旧木板 prefab 中提炼语义蓝图，并同步生成 `assets/data` 下的 JSON 与 `assets/scripts` 下的可直接引用目录模块。
- `architecture/tools/generate-wood-authoring-prefabs.js`
  按木板蓝图生成正式 Creator `wood prefab`；当前用于把 `wood2/11/37/42` 落成可被场景和组件引用的 prefab 资产。
- `assets/data/gameplay/wood/wood-prefab-blueprints.json`
  木板 prefab 的可读蓝图数据，包含尺寸、碰撞点、钉子锚点和旧 bundle 来源。
- `assets/scripts/gameplay/wood/WoodPrefabBlueprintCatalog.ts`
  木板蓝图目录模块，后续 prefab/scene 重建优先依赖这里，而不是旧 prefab 文件。
- `assets/scripts/gameplay/wood/WoodPrefabNodeFactory.ts`
  按单个蓝图创建 Creator 原生木板节点树的底层工厂；无真贴图时会生成可视占位图形。
- `assets/scripts/gameplay/wood/WoodPrefabRuntimeBuilder.ts`
  按 `woodType` 从蓝图库直接构建木板节点树的运行时入口。
- `assets/scripts/gameplay/wood/WoodBlueprintPreview.ts`
  可挂在 Creator 节点上的木板预览组件，用于把蓝图直接可视化到场景里。
- `assets/scripts/gameplay/wood/WoodPrefabAuthoringHost.ts`
  单块木板的作者化宿主组件，可挂到空节点并继续保存成真正 prefab。
- `assets/scripts/gameplay/wood/WoodPrefabGalleryAuthoring.ts`
  画廊式作者化宿主组件，可批量生成多种 `woodType` 供场景校验。
- `assets/prefabs/gameplay/wood/wood2.prefab`
- `assets/prefabs/gameplay/wood/wood11.prefab`
- `assets/prefabs/gameplay/wood/wood37.prefab`
- `assets/prefabs/gameplay/wood/wood42.prefab`
  第一批正式 Creator 木板 prefab；当前仍属于“作者化 prefab”，内部节点树由 `WoodPrefabAuthoringHost` 生成。
- `assets/scenes/WoodGallery.scene`
  第一张 Creator 原生实验场景；当前同时承载木板画廊和 revive 可玩切片实验区，并已挂上展示层与基础音效。
- `assets/scenes/Game.scene`
  第一张正式玩法骨架场景；当前先把 `GameplayRoot / BoardRoot / ReviveSliceHost / FXRoot / UIRoot / DebugRoot` 的可维护层级固定下来，并让 revive 切片与展示层一起进入正式场景链。

## 当前可验证效果

- Creator 已能识别 `WoodPrefabAuthoringHost`、`WoodPrefabGalleryAuthoring`、`RevivePlayableSlice` 等新组件。
- Creator 已能识别 `ShowcaseChromeAuthoring` 等本轮新增组件，`WoodGallery.scene` / `Game.scene` 可直接打开。
- `assets/scenes/WoodGallery.scene` 可直接在 Creator 中打开并预览木板画廊。
- `RevivePlayableSlice` 已可在 `WoodGallery.scene` 里自动播放一次 revive 切片，并支持触摸重播；当前已接入基础音效。
- `Game.scene` 已可在 Creator 中作为正式玩法骨架打开，当前先承载 revive 切片的正式接入点。
- `source:generate-wood-prefabs`、`guardrails`、`cocos:build:wechat` 已形成稳定闭环。
- 本地 Cocos MCP 已可用，可直接对运行中的 Creator 调 `scene_open_scene`、`scene_get_scene_list`、`assetAdvanced_validate_asset_references` 做 Creator 侧校验。

## 当前已知坑

1. 当前 `wood prefab` 还是“作者化 prefab”，不是最终静态 prefab。
2. 木板和钉子当前虽然已开始吃真实语义资产和基础音效，但仍有部分使用 `Graphics` 占位渲染，视觉效果和原游戏尚未对齐。
3. Creator 的 `.meta` / `.scene` / `.prefab` 保留 `uuid` 属正常现象，但迁移过程中必须避免继续依赖旧 bundle 的 `uuid / pack / hash` 作为维护入口。
4. Cocos CLI 仍可能返回状态码 `36`；当前确认主要是网络/登录接口超时，产物生成不受影响。
5. 正式游戏入口仍是 `assets/scene/LoadScene.scene`，`WoodGallery.scene` 和 `Game.scene` 目前都还不是最终游戏入口。

## 下一步

1. 把 revive 切片里的木板、钉子、阴影从“仍可能占位 fallback”推进成“默认即真实 sprite 资产”。
2. 继续把 `wood prefab` 从“作者化 prefab”收束到更静态、更接近最终成品的可编辑 prefab。
3. 继续把 `RevivePlayableSlice` 从 `Game.scene` 的骨架接入点推进到正式玩法控制器。
4. 用 `assets/scripts/` 中的语义模块继续反向替换 runtime 中对应逻辑来源。
5. 再向 `start-scene` 入口和更完整的主玩法控制器推进。
