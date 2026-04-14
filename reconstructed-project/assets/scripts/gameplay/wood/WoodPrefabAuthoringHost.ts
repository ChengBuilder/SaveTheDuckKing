import { _decorator, Component, Node, warn } from 'cc';
import { buildWoodPrefabNodeStructureByType } from './WoodPrefabRuntimeBuilder';
import { getSupportedWoodPrefabTypes } from './WoodPrefabBlueprintCatalog';
import { applyWoodNodeVisuals } from './WoodSemanticVisuals';

const { ccclass, property, executeInEditMode, disallowMultiple } = _decorator;

@ccclass('WoodPrefabAuthoringHost')
@executeInEditMode
@disallowMultiple
export class WoodPrefabAuthoringHost extends Component {
  @property({ tooltip: '木板类型，对应 blueprint 表中的 woodType。' })
  woodType = 2;

  @property({
    tooltip: '为空时生成到当前节点；不为空时生成到指定父节点。'
  })
  targetParent: Node | null = null;

  @property({ tooltip: '组件启用时立即重建一次。' })
  rebuildOnEnable = true;

  @property({ tooltip: '编辑器里 woodType 改变时自动重建。' })
  rebuildOnWoodTypeChange = true;

  @property({ tooltip: '组件禁用时清理已生成节点。' })
  clearOnDisable = true;

  @property({ tooltip: '默认木板颜色名；用于在编辑器中优先绑定真实贴图。' })
  preferredWoodColorName = 'grayWood';

  private _spawnedRoot: Node | null = null;
  private _lastAppliedWoodType: number | null = null;

  reset(): void {
    const supported = getSupportedWoodPrefabTypes();
    if (supported.length) {
      this.woodType = supported[0];
    }
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
    if (!this.rebuildOnWoodTypeChange) {
      return;
    }
    if (this._lastAppliedWoodType !== this.woodType) {
      this.rebuild();
    }
  }

  rebuild(): void {
    this.clearSpawned();
    const structure = buildWoodPrefabNodeStructureByType({ woodType: this.woodType });
    if (!structure) {
      warn(`[WoodPrefabAuthoringHost] 找不到 woodType=${this.woodType} 的蓝图，跳过生成。`);
      this._lastAppliedWoodType = null;
      return;
    }

    const parent = this.targetParent || this.node;
    parent.addChild(structure.root);
    structure.root.setPosition(0, 0, 0);
    this._spawnedRoot = structure.root;
    this._lastAppliedWoodType = this.woodType;
    void applyWoodNodeVisuals(structure.root, {
      woodType: this.woodType,
      preferredWoodColorName: this.preferredWoodColorName
    });
  }

  clearSpawned(): void {
    if (this._spawnedRoot && this._spawnedRoot.isValid) {
      this._spawnedRoot.destroy();
    }
    this._spawnedRoot = null;
  }

  getSpawnedRoot(): Node | null {
    return this._spawnedRoot && this._spawnedRoot.isValid ? this._spawnedRoot : null;
  }
}
