# SaveTheDuckKing 迁移进度与坑点（2026-04-13）

## 这份文档回答什么

这份文档专门记录两个问题：

1. `reconstructed-project/` 今天到底已经迁到什么程度。
2. 现在阻止我们快速做到“和原游戏一样效果”的主要坑点是什么。

## 当前已经落地的内容

- `reconstructed-project/` 已经是唯一维护入口，Cocos Creator 3.8.7 可以打开，`npm run cocos:build:wechat` 可以生成 `build/wechatgame`。
- 新的 Creator 源目录已经启用：`assets/scripts/`、`assets/audio/`、`assets/data/`、`assets/prefabs/`、`assets/scenes/`、`assets/textures/`、`assets/spine/`。
- revive 相关的第一批语义源码已经迁出到 `assets/scripts/gameplay/revive/`，不再完全埋在旧 runtime 大文件里。
- `assets/scripts/gameplay/revive/ReviveSemanticAudio.ts` 已落地，当前把 `woodAssembleLead / woodAssembleFollow / woodCollision` 三段 revive 音频接进 Creator 原生切片。
- `assets/scripts/gameplay/revive/ShowcaseChromeAuthoring.ts` 已落地，当前用于给 `WoodGallery.scene` / `Game.scene` 这类迁移样板场景补标题、说明和引导文案。
- 木板 prefab 已经先走完“旧 prefab -> 语义蓝图 -> Creator 作者化 prefab”这条第一阶段迁移链。
- `assets/prefabs/gameplay/wood/` 当前已有正式 Creator prefab 资产：`wood2.prefab`、`wood11.prefab`、`wood37.prefab`、`wood42.prefab`。
- `assets/scenes/WoodGallery.scene` 当前既能展示木板画廊，也挂上了 revive 可玩切片，并补上了展示层文案；已经能在 Creator 里直接预览“木板生成 + 钉子飞入槽位 + 基础音效”的一小段玩法。
- `assets/scenes/Game.scene` 已经落成第一版正式玩法骨架，当前先挂上 `ReviveSliceHost`，并把 `GameplayRoot / BoardRoot / FXRoot / UIRoot / DebugRoot` 的 Creator 原生层级固定下来。
- 本地 Cocos MCP 服务已完成连通性实测：`scene_get_scene_list`、`scene_open_scene`、`assetAdvanced_validate_asset_references` 已返回正常结果。

## 现在可以怎么验证

1. 用 Cocos Creator 3.8.7 打开 `reconstructed-project/`。
2. 打开 `assets/scenes/WoodGallery.scene`。
3. 进入预览后观察 `RevivePlaygroundHost` 区域。
4. 场景启用时会自动播放一次 revive 切片，点击屏幕会重播一次。
5. 打开 `assets/scenes/Game.scene`，可以看到 revive 切片已经不只存在于实验画廊，而是进入了正式玩法骨架场景，并带有展示说明层。
6. 执行 `npm run source:generate-wood-prefabs` 可以重新生成四个 `wood prefab`。
7. 执行 `npm run guardrails` 可以确认迁移后的结构和资源仍然一致。
8. 执行 `npm run cocos:build:wechat` 可以继续产出微信小游戏包体。
9. 若 Creator 正在运行，可通过本地 MCP 调用 `scene_open_scene` 直接打开 `db://assets/scenes/Game.scene` 或 `db://assets/scenes/WoodGallery.scene` 做 Creator 侧校验。

## 当前效果为什么还不像原游戏

当前跑通的是“Creator 原生结构”和“可维护的资产关系”，不是最终效果层。

和原游戏还存在的主要差距：

- 木板和钉子虽然已经开始吃真实语义贴图与基础音效，但仍有一部分节点会在缺素材时退回 `Graphics` 占位绘制。
- 阴影、高光、层次、粒子和更细的节奏曲线还没有完整恢复。
- 当前默认启动场景仍然是 `assets/scene/LoadScene.scene`，`WoodGallery.scene` 还是迁移实验场景，不是正式入口。
- `Game.scene` 目前只是正式玩法骨架，不等于主玩法已经全部迁完；它解决的是“新玩法以后接到哪里去”的问题。
- revive 只是主链里的一个切片，整个主玩法还没有完全翻译成 Creator 原生 scene/prefab/component 结构。

## 这轮碰到并确认的坑

### 1. 旧 bundle 直接导出的 prefab 不是合法 Creator 源 prefab

现象：

- 直接把旧 bundle 里的序列化 prefab 塞进 `assets/prefabs/`，Creator 会把它当成“能导入的文件”，但它不是我们能长期维护的真正源 prefab。

结论：

- 旧 prefab 只能当“提取语义蓝图”的输入，不能当最终资产。
- 正确路线是：旧 prefab -> 蓝图 -> 作者化 prefab -> 最终可编辑 prefab。

### 2. Cocos 自定义脚本类的短 UUID 压缩规则踩坑

现象：

- 早期生成 prefab/scene 时，自定义组件类会报 `Missing class`。

根因：

- Cocos 自定义脚本类在序列化里使用的是“压缩后的短 UUID”。
- 这次确认后，正确规则不是“保留前 2 个十六进制字符”，而是“保留前 5 个十六进制字符，再压缩后续部分”。

影响：

- 如果压缩规则错了，Creator 虽然能读到资产文件，但场景/Prefab 里的脚本组件会丢失。

现状：

- `generate-wood-authoring-prefabs.js` 已经按正确规则修正，当前 `WoodPrefabAuthoringHost` 和 `RevivePlayableSlice` 都能被 Creator 正常注册。
- 本轮新增的 `ShowcaseChromeAuthoring` 也已在最新构建日志里完成注册，并可被 `WoodGallery.scene` / `Game.scene` 正常识别。

### 3. Creator 返回状态码 `36` 仍然存在

现象：

- Cocos CLI 构建结束后，进程仍可能返回 `36`。

当前判断：

- 这不是当前新增 prefab/scene 链路坏了。
- 目前日志里主要剩 Creator 自己的网络/登录接口超时噪声。

现状：

- `build-cocos-wechat-runtime.js` 已经在检测到 `build/wechatgame` 产物存在时，把常见的 `35/36/37` 视为可接受。
- 当前不会阻断微信包体生成和同步。

### 6. Creator 侧验证不能只靠命令行构建

现象：

- 只看 CLI 构建是否出包，并不能及时发现“编辑器资产库已接受 / 场景能否直接打开”这一层问题。

现状：

- 本地 `http://127.0.0.1:3000/mcp` 已经完成实测，当前能用 `scene_get_scene_list`、`scene_open_scene`、`assetAdvanced_validate_asset_references` 直接向运行中的 Creator 做验证。
- 这能让后续迁移不再只靠 `.scene` / `.prefab` 文件和命令行日志判断成败。

### 4. 项目里仍然会有 `uuid`

现象：

- `.meta`、`.scene`、`.prefab` 里仍然能看到 `uuid`。

结论：

- 这符合 Creator 自身的资产系统，不可能完全消失。
- 真正不符合规范的不是“有 uuid”，而是“我们后续继续靠旧 bundle 的 uuid / pack id / 哈希文件名维护逻辑和资源”。

现状：

- 脚本层已经转到语义化模块。
- prefab/scene 层仍在从“旧序列化引用”向“Creator 原生可编辑关系”过渡。

### 5. 现在的 wood prefab 还是第一阶段作者化 prefab

现象：

- `wood2/11/37/42.prefab` 已经是正式 Creator prefab，但打开后会发现它们内部木板节点树还是靠 `WoodPrefabAuthoringHost` 生成。

结论：

- 这是正确的阶段性中间态，不是最终形态。
- 它的价值在于：现在已经可以在 Creator 中实例化、挂到场景、被别的组件引用，并进入真正的 prefab 工作流。

下一阶段要做的：

- 把这些作者化 prefab 继续收束成更静态、更像最终成品的 prefab。
- 接入真实贴图、钉子 sprite、阴影和动画层。

## 现在最值得继续推进的方向

1. 继续把 revive 切片里的木板和钉子从“有真实语义资产，但仍会回退占位图形”推进到“默认即真实 sprite”。
2. 再把 `WoodGallery.scene` 里的 revive 动效节奏、阴影、高光和粒子继续对齐原游戏。
3. 继续把 `Game.scene` 里的 `BoardRoot / UIRoot / FXRoot / DebugRoot` 接上真正的玩法控制器、UI 和特效层，而不是永远停留在 demo 区。

## 一句话结论

现在我们已经从“解包运行时能跑”迈到了“Creator 里已经有可维护的木板 prefab 和 revive 可玩切片”，但还没有到“和原游戏看起来一样”。后面的主要工作不是再搬代码，而是把真实资源、正式场景关系和动画效果一层层补齐。
