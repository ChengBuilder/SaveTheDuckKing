import { _decorator, Component, Node, warn } from 'cc';
import { buildWoodPrefabNodeStructureByType } from './WoodPrefabRuntimeBuilder';
import { getSupportedWoodPrefabTypes } from './WoodPrefabBlueprintCatalog';
import { applyWoodNodeVisuals } from './WoodSemanticVisuals';

const { ccclass, property, executeInEditMode, disallowMultiple } = _decorator;

@ccclass('WoodPrefabGalleryAuthoring')
@executeInEditMode
@disallowMultiple
export class WoodPrefabGalleryAuthoring extends Component {
  @property({ tooltip: '需要展示的 woodType 列表；留空时使用全部支持的 woodType。' })
  woodTypes: number[] = [];

  @property({ tooltip: '每行列数。' })
  columns = 3;

  @property({ tooltip: '水平间距。' })
  spacingX = 240;

  @property({ tooltip: '垂直间距。' })
  spacingY = 160;

  @property({ tooltip: '根节点偏移 X。' })
  offsetX = 0;

  @property({ tooltip: '根节点偏移 Y（负值向下）。' })
  offsetY = 0;

  @property({ tooltip: '为空时生成到当前节点；不为空时生成到指定父节点。' })
  targetParent: Node | null = null;

  @property({ tooltip: '组件启用时自动重建。' })
  rebuildOnEnable = true;

  @property({ tooltip: '组件禁用时清理已生成节点。' })
  clearOnDisable = true;

  @property({ tooltip: '默认木板颜色名；用于在画廊中优先绑定真实贴图。' })
  preferredWoodColorName = 'grayWood';

  private _spawned: Node[] = [];
  private _lastAppliedKey = '';

  reset(): void {
    this.woodTypes = getSupportedWoodPrefabTypes();
  }

  onEnable(): void {
    if (this.rebuildOnEnable) {
      this.rebuild();
    }
  }

  onDisable(): void {
    if (this.clearOnDisable) {
      this.clearSpawned();
    }
  }

  update(): void {
    const key = this.woodTypes.join(',') + `|${this.columns}|${this.spacingX}|${this.spacingY}|${this.offsetX}|${this.offsetY}`;
    if (key !== this._lastAppliedKey) {
      this.rebuild();
    }
  }

  rebuild(): void {
    this.clearSpawned();
    const parent = this.targetParent || this.node;
    const types = this.woodTypes.length ? this.woodTypes.slice() : getSupportedWoodPrefabTypes();
    const cols = Math.max(1, this.columns | 0);
    let index = 0;

    for (const woodType of types) {
      const structure = buildWoodPrefabNodeStructureByType({ woodType });
      if (!structure) {
        warn(`[WoodPrefabGalleryAuthoring] 找不到 woodType=${woodType} 的蓝图，跳过该项。`);
        continue;
      }

      const col = index % cols;
      const row = Math.floor(index / cols);
      structure.root.setPosition(
        this.offsetX + col * this.spacingX,
        this.offsetY - row * this.spacingY,
        0
      );
      parent.addChild(structure.root);
      void applyWoodNodeVisuals(structure.root, {
        woodType,
        preferredWoodColorName: this.preferredWoodColorName
      });
      this._spawned.push(structure.root);
      index += 1;
    }

    this._lastAppliedKey = this.woodTypes.join(',') + `|${cols}|${this.spacingX}|${this.spacingY}|${this.offsetX}|${this.offsetY}`;
  }

  clearSpawned(): void {
    for (const node of this._spawned) {
      if (node && node.isValid) {
        node.destroy();
      }
    }
    this._spawned.length = 0;
  }
}
