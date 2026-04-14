import {
  _decorator,
  AudioSource,
  CCInteger,
  Component,
  instantiate,
  Node,
  Prefab,
  tween,
  UIOpacity,
  UITransform,
  Vec3
} from 'cc';
import { buildReviveWoodPlan, ReviveWoodPlanEntry } from './ReviveWoodPlan';
import { buildWoodPrefabNodeStructureByType } from '../wood/WoodPrefabRuntimeBuilder';
import { WoodPrefabAuthoringHost } from '../wood/WoodPrefabAuthoringHost';
import { applyReviveNailVisual, applyWoodNodeVisuals, findWoodNailNodes, setWoodNailsVisible } from '../wood/WoodSemanticVisuals';
import { playReviveAudio, preloadReviveAudio, ReviveAudioCue } from './ReviveSemanticAudio';

const { ccclass, property, disallowMultiple } = _decorator;

const REVIVE_WOOD_LAYER_NAME = 'ReviveWoodLayer';
const REVIVE_NAIL_LAYER_NAME = 'ReviveNailLayer';
const DEFAULT_REVIVE_NAIL_TYPES = Object.freeze([1, 2, 3, 1, 2, 3, 1]);

interface SpawnedWoodEntry {
  planEntry: ReviveWoodPlanEntry;
  node: Node;
  host: WoodPrefabAuthoringHost | null;
}

interface ReviveNailTarget {
  position: Vec3;
  woodAngle: number;
}

@ccclass('RevivePlayableSlice')
@disallowMultiple
export class RevivePlayableSlice extends Component {
  @property([CCInteger])
  reviveNailTypes: number[] = DEFAULT_REVIVE_NAIL_TYPES.slice();

  @property(Prefab)
  wood2Prefab: Prefab | null = null;

  @property(Prefab)
  wood11Prefab: Prefab | null = null;

  @property(Prefab)
  wood37Prefab: Prefab | null = null;

  @property(Prefab)
  wood42Prefab: Prefab | null = null;

  @property
  autoPlayOnEnable = true;

  @property
  replayOnTouch = true;

  @property
  woodScale = 1.35;

  @property
  woodSpawnDelay = 0.05;

  @property
  nailMoveDelay = 0.1;

  @property
  enableSemanticAudio = true;

  @property
  leadAudioVolume = 0.95;

  @property
  followAudioVolume = 0.72;

  @property
  collisionAudioVolume = 0.88;

  private _isPlaying = false;
  private _woodLayer: Node | null = null;
  private _nailLayer: Node | null = null;
  private _audioSource: AudioSource | null = null;

  onEnable(): void {
    this.ensureLayers();
    this.ensureAudioSource();
    if (this.enableSemanticAudio) {
      void preloadReviveAudio();
    }
    if (this.replayOnTouch) {
      this.node.on(Node.EventType.TOUCH_START, this.handleReplayTouch, this);
    }
    if (this.autoPlayOnEnable) {
      void this.play();
    }
  }

  onDisable(): void {
    this.node.off(Node.EventType.TOUCH_START, this.handleReplayTouch, this);
    this.clearLayers();
    this._audioSource?.stop();
    this._isPlaying = false;
  }

  async play(): Promise<void> {
    if (this._isPlaying) {
      return;
    }

    this._isPlaying = true;
    this.clearLayers();
    this.ensureAudioSource()?.stop();

    const woodLayer = this.ensureWoodLayer();
    const nailLayer = this.ensureNailLayer();
    const reviveNailTypes = this.reviveNailTypes.length ? this.reviveNailTypes.slice() : DEFAULT_REVIVE_NAIL_TYPES.slice();
    const plan = buildReviveWoodPlan({
      reviveNailTypes: reviveNailTypes,
      woodColor: 1,
      leftWoodXRange: [-190, -80],
      rightWoodXRange: [80, 190],
      yRange: [-220, -120],
      angleRange: [-18, 18]
    });

    const [woods, nails] = await Promise.all([
      this.spawnReviveWoods(woodLayer, plan),
      this.spawnReviveNails(nailLayer, reviveNailTypes)
    ]);
    const revealWoodNailsPromise = this.wait(0.8).then(() => {
      for (const woodEntry of woods) {
        const visualRoot = woodEntry.host?.getSpawnedRoot() || woodEntry.node;
        setWoodNailsVisible(visualRoot, true);
      }
    });

    await Promise.all(
      woods.map((woodEntry, index) => {
        return this.animateWoodIn(woodEntry.node, index);
      })
    );
    void this.playAudioCue('woodCollision', this.collisionAudioVolume);

    const nailTargets = this.collectReviveNailTargets(woods, nailLayer);
    const nailCount = Math.min(nails.length, nailTargets.length);
    await Promise.all(
      nails.slice(0, nailCount).map((nailNode, index) => {
        return this.animateNailIntoSlot(nailNode, nailTargets[index], index);
      })
    );
    await revealWoodNailsPromise;

    this._isPlaying = false;
  }

  private handleReplayTouch(): void {
    if (!this._isPlaying) {
      void this.play();
    }
  }

  private async spawnReviveWoods(parent: Node, plan: readonly ReviveWoodPlanEntry[]): Promise<SpawnedWoodEntry[]> {
    const tasks = plan.map(async (planEntry) => {
      const spawnResult = this.createWoodNode(planEntry.woodType);
      if (!spawnResult) {
        return null;
      }

      spawnResult.node.setParent(parent);
      spawnResult.node.setPosition(planEntry.woodPos);
      spawnResult.node.angle = planEntry.woodAngle;
      spawnResult.node.setScale(this.woodScale, this.woodScale, 1);

      let opacity = spawnResult.node.getComponent(UIOpacity);
      if (!opacity) {
        opacity = spawnResult.node.addComponent(UIOpacity);
      }
      opacity.opacity = 0;

      const visualRoot = spawnResult.host?.getSpawnedRoot() || spawnResult.node;
      await applyWoodNodeVisuals(visualRoot, {
        woodType: planEntry.woodType,
        woodColor: planEntry.woodColor,
        nailTypes: planEntry.nailTypeArr,
        hideNails: true
      });

      return {
        planEntry: planEntry,
        node: spawnResult.node,
        host: spawnResult.host
      };
    });

    const result = await Promise.all(tasks);
    return result.filter((entry): entry is SpawnedWoodEntry => entry !== null);
  }

  private createWoodNode(woodType: number): { node: Node; host: WoodPrefabAuthoringHost | null } | null {
    const prefab = this.getWoodPrefab(woodType);
    if (prefab) {
      const node = instantiate(prefab);
      const host = node.getComponent(WoodPrefabAuthoringHost);
      if (host) {
        host.rebuild();
      }
      return {
        node: node,
        host: host
      };
    }

    const structure = buildWoodPrefabNodeStructureByType({ woodType: woodType });
    if (!structure) {
      return null;
    }

    return {
      node: structure.root,
      host: null
    };
  }

  private getWoodPrefab(woodType: number): Prefab | null {
    switch (woodType) {
      case 2:
        return this.wood2Prefab;
      case 11:
        return this.wood11Prefab;
      case 37:
        return this.wood37Prefab;
      case 42:
        return this.wood42Prefab;
      default:
        return null;
    }
  }

  private async animateWoodIn(node: Node, index: number): Promise<void> {
    const opacity = node.getComponent(UIOpacity);
    node.setScale(3, 3, 1);
    if (opacity) {
      opacity.opacity = 0;
    }

    await this.wait(this.woodSpawnDelay * index);
    if (index === 0) {
      void this.playAudioCue('woodAssembleLead', this.leadAudioVolume);
    }
    await new Promise<void>((resolve) => {
      if (opacity) {
        opacity.opacity = 255;
      }
      tween(node)
        .to(
          0.3,
          {
            scale: new Vec3(this.woodScale, this.woodScale, 1)
          },
          {
            easing: 'backOut'
          }
        )
        .call(resolve)
        .start();
    });
  }

  private async spawnReviveNails(parent: Node, reviveNailTypes: readonly number[]): Promise<Node[]> {
    const result: Node[] = [];
    const spacing = 54;
    const totalWidth = (reviveNailTypes.length - 1) * spacing;

    for (let index = 0; index < reviveNailTypes.length; index += 1) {
      const nailType = reviveNailTypes[index];
      const nailNode = new Node('reviveNail-' + index);
      nailNode.setParent(parent);
      nailNode.setPosition(-totalWidth / 2 + index * spacing, -420, 0);
      nailNode.layer = parent.layer;

      const transform = nailNode.addComponent(UITransform);
      transform.setContentSize(32, 32);
      nailNode.setScale(1.05, 1.05, 1);

      const opacity = nailNode.addComponent(UIOpacity);
      opacity.opacity = 235;
      await applyReviveNailVisual(nailNode, nailType, {
        includeGlow: true,
        includeShadow: true
      });
      result.push(nailNode);
    }

    return result;
  }

  private collectReviveNailTargets(woods: readonly SpawnedWoodEntry[], nailLayer: Node): ReviveNailTarget[] {
    const result: ReviveNailTarget[] = [];
    const nailLayerTransform = nailLayer.getComponent(UITransform);
    if (!nailLayerTransform) {
      return result;
    }

    for (const woodEntry of woods) {
      const searchRoot = woodEntry.host?.getSpawnedRoot() || woodEntry.node;
      const nailSlots = findWoodNailNodes(searchRoot);
      for (const nailSlot of nailSlots) {
        const slotTransform = nailSlot.getComponent(UITransform);
        if (!slotTransform) {
          continue;
        }
        const worldPosition = slotTransform.convertToWorldSpaceAR(Vec3.ZERO);
        result.push({
          position: nailLayerTransform.convertToNodeSpaceAR(worldPosition),
          woodAngle: woodEntry.planEntry.woodAngle
        });
      }
    }

    return result;
  }

  private async animateNailIntoSlot(node: Node, target: ReviveNailTarget, index: number): Promise<void> {
    const baseScale = node.scale.clone();
    await this.wait(0.1 + this.nailMoveDelay * index);
    if (index === 0) {
      void this.playAudioCue('woodAssembleFollow', this.followAudioVolume);
    }
    await new Promise<void>((resolve) => {
      tween(node)
        .to(
          0.2,
          {
            position: target.position
          },
          {
            easing: 'sineIn'
          }
        )
        .to(
          0.2,
          {
            scale: new Vec3(baseScale.x + 0.2, baseScale.y + 0.2, 1)
          },
          {
            easing: 'sineIn'
          }
        )
        .to(
          0.2,
          {
            scale: new Vec3(Math.max(0.1, baseScale.x - 0.1), Math.max(0.1, baseScale.y - 0.1), 1)
          },
          {
            easing: 'backIn'
          }
        )
        .delay(0.05)
        .by(0.5, {
          angle: target.woodAngle + 720
        })
        .call(() => {
          if (node.isValid) {
            node.destroy();
          }
        })
        .call(resolve)
        .start();
    });
  }

  private ensureLayers(): void {
    this.ensureWoodLayer();
    this.ensureNailLayer();
  }

  private ensureWoodLayer(): Node {
    if (this._woodLayer && this._woodLayer.isValid) {
      return this._woodLayer;
    }

    const layerNode = new Node(REVIVE_WOOD_LAYER_NAME);
    layerNode.setParent(this.node);
    layerNode.layer = this.node.layer;
    const transform = layerNode.addComponent(UITransform);
    const hostTransform = this.node.getComponent(UITransform);
    if (hostTransform) {
      transform.setContentSize(hostTransform.contentSize.width, hostTransform.contentSize.height);
    }
    this._woodLayer = layerNode;
    return layerNode;
  }

  private ensureNailLayer(): Node {
    if (this._nailLayer && this._nailLayer.isValid) {
      return this._nailLayer;
    }

    const layerNode = new Node(REVIVE_NAIL_LAYER_NAME);
    layerNode.setParent(this.node);
    layerNode.layer = this.node.layer;
    const transform = layerNode.addComponent(UITransform);
    const hostTransform = this.node.getComponent(UITransform);
    if (hostTransform) {
      transform.setContentSize(hostTransform.contentSize.width, hostTransform.contentSize.height);
    }
    this._nailLayer = layerNode;
    return layerNode;
  }

  private ensureAudioSource(): AudioSource | null {
    if (this._audioSource && this._audioSource.isValid) {
      return this._audioSource;
    }

    this._audioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
    this._audioSource.playOnAwake = false;
    this._audioSource.volume = 1;
    return this._audioSource;
  }

  private async playAudioCue(cue: ReviveAudioCue, volume: number): Promise<void> {
    if (!this.enableSemanticAudio) {
      return;
    }

    await playReviveAudio(this.ensureAudioSource(), cue, volume);
  }

  private clearLayers(): void {
    for (const layerNode of [this._woodLayer, this._nailLayer]) {
      if (!layerNode || !layerNode.isValid) {
        continue;
      }
      for (const childNode of [...layerNode.children]) {
        childNode.destroy();
      }
    }
  }

  private wait(seconds: number): Promise<void> {
    if (seconds <= 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.scheduleOnce(resolve, seconds);
    });
  }
}
