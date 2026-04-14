import { _decorator, Component, Node, SpriteFrame } from 'cc';
import { buildWoodPrefabNodeStructureByType } from './WoodPrefabRuntimeBuilder';
import { applyWoodNodeVisuals } from './WoodSemanticVisuals';

const { ccclass, executeInEditMode, disallowMultiple, property } = _decorator;
const GENERATED_PREVIEW_NODE_NAME = '__generatedWoodPreview';

@ccclass('WoodBlueprintPreview')
@executeInEditMode
@disallowMultiple
export class WoodBlueprintPreview extends Component {
  @property
  public woodType = 2;

  @property(SpriteFrame)
  public woodSpriteFrame: SpriteFrame | null = null;

  @property(SpriteFrame)
  public nailSpriteFrame: SpriteFrame | null = null;

  @property
  public preferredWoodColorName = 'grayWood';

  protected onEnable(): void {
    this.rebuildPreview();
  }

  public rebuildPreview(): void {
    this.removeGeneratedPreview();

    const structure = buildWoodPrefabNodeStructureByType({
      woodType: this.woodType,
      rootName: `wood${this.woodType}`,
      spriteFrame: this.woodSpriteFrame,
      nailSpriteFrame: this.nailSpriteFrame
    });

    if (!structure) {
      return;
    }

    structure.root.name = GENERATED_PREVIEW_NODE_NAME;
    this.node.addChild(structure.root);
    if (!this.woodSpriteFrame && !this.nailSpriteFrame) {
      void applyWoodNodeVisuals(structure.root, {
        woodType: this.woodType,
        preferredWoodColorName: this.preferredWoodColorName
      });
    }
  }

  private removeGeneratedPreview(): void {
    const previewNode = this.node.getChildByName(GENERATED_PREVIEW_NODE_NAME);
    if (previewNode) {
      previewNode.destroy();
    }
  }
}
