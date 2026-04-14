import {
  assetManager,
  Bundle,
  Color,
  Graphics,
  Node,
  Sprite,
  SpriteFrame,
  UIOpacity,
  UITransform
} from 'cc';
import { getWoodPrefabBlueprint } from './WoodPrefabBlueprintCatalog';

const WOOD_SPRITE_NODE_NAME = 'woodSprite';
const WOOD_SHADOW_NODE_NAME = 'woodShadow';
const WOOD_NAIL_NAME_PREFIX = 'nailSlot-';
const NAIL_GLOW_NODE_NAME = '__nailGlow';
const NAIL_SHADOW_NODE_NAME = '__nailShadow';
const LEGACY_WOOD_COLOR_NAMES = ['grayWood', 'lightWood', 'redWood', 'brownWood', 'goldWood', 'yellowWood'];
const LEGACY_NEW_NAIL_STYLE_BY_TYPE = ['1', '4', '3', '7', '2', '5', '6', '8', '9', '10', '11', '12', '13', '14'];
const LEGACY_DUCK_BUNDLE_NAME = 'DuckBundle';

const spriteFramePromiseCache = new Map<string, Promise<SpriteFrame | null>>();
let legacyDuckBundlePromise: Promise<Bundle | null> | null = null;

export interface ApplyWoodNodeVisualsOptions {
  woodType: number;
  woodColor?: number;
  preferredWoodColorName?: string | null;
  nailTypes?: readonly number[];
  hideNails?: boolean;
}

export interface ApplyReviveNailVisualOptions {
  includeGlow?: boolean;
  includeShadow?: boolean;
  hide?: boolean;
  glowScale?: number;
  shadowScale?: number;
}

export function getLegacyWoodSpritePathByColorIndex(woodType: number, woodColor: number): string | null {
  const colorName = LEGACY_WOOD_COLOR_NAMES[woodColor - 1];
  if (!colorName) {
    return null;
  }
  return `tex/wood/${colorName}/${colorName}${woodType}/spriteFrame`;
}

export function getPreferredLegacyWoodSpritePath(
  woodType: number,
  preferredWoodColorName = 'grayWood'
): string | null {
  const blueprint = getWoodPrefabBlueprint(woodType);
  if (!blueprint) {
    return null;
  }

  const preferred = blueprint.woodSpriteDependencies.find((assetPath) => {
    return assetPath.indexOf('/' + preferredWoodColorName + '/') >= 0;
  });
  return preferred || blueprint.woodSpriteDependencies[0] || null;
}

export function getLegacyReviveNailSpritePath(nailType: number): string {
  const styleName = LEGACY_NEW_NAIL_STYLE_BY_TYPE[Math.max(0, nailType - 1)] || String(nailType);
  return `tex/newNail/nailStyle${styleName}/spriteFrame`;
}

export function getLegacyReviveNailGlowPath(nailType: number): string {
  const styleName = LEGACY_NEW_NAIL_STYLE_BY_TYPE[Math.max(0, nailType - 1)] || String(nailType);
  return `tex/newNail/nailGlowStyle${styleName}/spriteFrame`;
}

export function getLegacyReviveNailShadowPath(): string {
  return 'tex/newNail/nailShadow/spriteFrame';
}

export async function applyWoodNodeVisuals(root: Node, options: ApplyWoodNodeVisualsOptions): Promise<void> {
  const woodSpritePath =
    options.woodColor != null
      ? getLegacyWoodSpritePathByColorIndex(options.woodType, options.woodColor) ||
        getPreferredLegacyWoodSpritePath(options.woodType)
      : getPreferredLegacyWoodSpritePath(options.woodType, options.preferredWoodColorName || 'grayWood');

  const woodSpriteNode = root.getChildByName(WOOD_SPRITE_NODE_NAME);
  if (woodSpriteNode && woodSpritePath) {
    const woodFrame = await loadGameplaySpriteFrame(woodSpritePath);
    if (woodFrame) {
      applySpriteFrameToNode(woodSpriteNode, woodFrame);
      const shadowNode = ensureWoodShadowNode(root, woodSpriteNode);
      applySpriteFrameToNode(shadowNode, woodFrame);
      applyShadowStyle(shadowNode);
    }
  }

  if (!Array.isArray(options.nailTypes) || options.nailTypes.length === 0) {
    return;
  }

  const nailNodes = findWoodNailNodes(root);
  const nailCount = Math.min(nailNodes.length, options.nailTypes.length);
  const tasks: Array<Promise<void>> = [];
  for (let index = 0; index < nailCount; index += 1) {
    tasks.push(
      applyReviveNailVisual(nailNodes[index], options.nailTypes[index], {
        includeGlow: true,
        includeShadow: false,
        hide: options.hideNails === true,
        glowScale: 1.35
      })
    );
  }
  await Promise.all(tasks);
}

export async function applyReviveNailVisual(
  node: Node,
  nailType: number,
  options: ApplyReviveNailVisualOptions = {}
): Promise<void> {
  const [styleFrame, glowFrame, shadowFrame] = await Promise.all([
    loadGameplaySpriteFrame(getLegacyReviveNailSpritePath(nailType)),
    options.includeGlow === false ? Promise.resolve(null) : loadGameplaySpriteFrame(getLegacyReviveNailGlowPath(nailType)),
    options.includeShadow ? loadGameplaySpriteFrame(getLegacyReviveNailShadowPath()) : Promise.resolve(null)
  ]);

  if (styleFrame) {
    applySpriteFrameToNode(node, styleFrame);
  }

  if (glowFrame && options.includeGlow !== false) {
    const glowNode = ensureOverlaySpriteNode(node, NAIL_GLOW_NODE_NAME, options.glowScale || 1.4, -1);
    applySpriteFrameToNode(glowNode, glowFrame);
    const opacity = ensureOpacity(glowNode);
    opacity.opacity = 196;
  }

  if (shadowFrame && options.includeShadow) {
    const shadowNode = ensureOverlaySpriteNode(node, NAIL_SHADOW_NODE_NAME, options.shadowScale || 1.18, -2);
    applySpriteFrameToNode(shadowNode, shadowFrame);
    shadowNode.setPosition(0, -3, 0);
    const opacity = ensureOpacity(shadowNode);
    opacity.opacity = 122;
  }

  const nodeOpacity = ensureOpacity(node);
  nodeOpacity.opacity = options.hide ? 0 : 255;
}

export function findWoodNailNodes(root: Node): Node[] {
  const result: Node[] = [];
  const queue: Node[] = [root];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }
    if (current.name.startsWith(WOOD_NAIL_NAME_PREFIX)) {
      result.push(current);
    }
    queue.push(...current.children);
  }

  return result.sort((leftNode, rightNode) => {
    return parseNailIndex(leftNode.name) - parseNailIndex(rightNode.name);
  });
}

export function setWoodNailsVisible(root: Node, visible: boolean): void {
  for (const nailNode of findWoodNailNodes(root)) {
    const opacity = ensureOpacity(nailNode);
    opacity.opacity = visible ? 255 : 0;
  }
}

export function mapLegacySpritePathToSemanticMainBundlePath(legacyAssetPath: string): string | null {
  if (legacyAssetPath.startsWith('tex/wood/') && legacyAssetPath.endsWith('/spriteFrame')) {
    return 'textures/gameplay/wood/' + legacyAssetPath.slice('tex/wood/'.length);
  }

  if (legacyAssetPath.startsWith('tex/nail/') && legacyAssetPath.endsWith('/spriteFrame')) {
    return 'textures/gameplay/nail/legacy/' + legacyAssetPath.slice('tex/nail/'.length);
  }

  if (legacyAssetPath === 'tex/nailGlow/spriteFrame') {
    return 'textures/gameplay/nail/legacy/nailGlow/spriteFrame';
  }

  return null;
}

export function loadGameplaySpriteFrame(legacyAssetPath: string): Promise<SpriteFrame | null> {
  const cached = spriteFramePromiseCache.get(legacyAssetPath);
  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const semanticMainPath = mapLegacySpritePathToSemanticMainBundlePath(legacyAssetPath);
    if (semanticMainPath) {
      const mainSpriteFrame = await loadSpriteFrameFromMainBundle(semanticMainPath);
      if (mainSpriteFrame) {
        return mainSpriteFrame;
      }
    }
    return loadSpriteFrameFromLegacyDuckBundle(legacyAssetPath);
  })();

  spriteFramePromiseCache.set(legacyAssetPath, promise);
  return promise;
}

function applySpriteFrameToNode(node: Node, spriteFrame: SpriteFrame): void {
  const graphics = node.getComponent(Graphics);
  if (graphics) {
    graphics.destroy();
  }

  const sprite = node.getComponent(Sprite) || node.addComponent(Sprite);
  sprite.sizeMode = Sprite.SizeMode.CUSTOM;
  sprite.spriteFrame = spriteFrame;
}

function applyShadowStyle(node: Node): void {
  const sprite = node.getComponent(Sprite);
  if (sprite) {
    sprite.color = new Color(72, 50, 29, 255);
  }
  const opacity = ensureOpacity(node);
  opacity.opacity = 108;
  node.setScale(1.02, 1.02, 1);
}

function ensureWoodShadowNode(root: Node, woodSpriteNode: Node): Node {
  let shadowNode = root.getChildByName(WOOD_SHADOW_NODE_NAME);
  if (shadowNode && shadowNode.isValid) {
    return shadowNode;
  }

  shadowNode = new Node(WOOD_SHADOW_NODE_NAME);
  shadowNode.layer = woodSpriteNode.layer;
  const woodTransform = woodSpriteNode.getComponent(UITransform);
  const shadowTransform = shadowNode.addComponent(UITransform);
  if (woodTransform) {
    shadowTransform.setContentSize(woodTransform.contentSize.width, woodTransform.contentSize.height);
  }
  root.insertChild(shadowNode, Math.max(0, woodSpriteNode.getSiblingIndex()));
  return shadowNode;
}

function ensureOverlaySpriteNode(parent: Node, nodeName: string, sizeScale: number, siblingIndex: number): Node {
  let overlayNode = parent.getChildByName(nodeName);
  if (!overlayNode || !overlayNode.isValid) {
    overlayNode = new Node(nodeName);
    overlayNode.layer = parent.layer;
    parent.addChild(overlayNode);
  }

  const parentTransform = parent.getComponent(UITransform);
  const overlayTransform = overlayNode.getComponent(UITransform) || overlayNode.addComponent(UITransform);
  if (parentTransform) {
    overlayTransform.setContentSize(
      parentTransform.contentSize.width * sizeScale,
      parentTransform.contentSize.height * sizeScale
    );
  }
  overlayNode.setSiblingIndex(Math.max(0, parent.children.length + siblingIndex));
  return overlayNode;
}

function ensureOpacity(node: Node): UIOpacity {
  return node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
}

function parseNailIndex(nodeName: string): number {
  const match = /nailSlot-(\d+)/.exec(nodeName);
  return match ? Number(match[1]) : 0;
}

function loadSpriteFrameFromMainBundle(assetPath: string): Promise<SpriteFrame | null> {
  const mainBundle = ((assetManager as unknown as { main?: Bundle }).main || null) as Bundle | null;
  if (!mainBundle) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    mainBundle.load(assetPath, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        resolve(null);
        return;
      }
      resolve(spriteFrame);
    });
  });
}

async function loadSpriteFrameFromLegacyDuckBundle(assetPath: string): Promise<SpriteFrame | null> {
  const bundle = await loadLegacyDuckBundle();
  if (!bundle) {
    return null;
  }

  return new Promise((resolve) => {
    bundle.load(assetPath, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        resolve(null);
        return;
      }
      resolve(spriteFrame);
    });
  });
}

function loadLegacyDuckBundle(): Promise<Bundle | null> {
  if (legacyDuckBundlePromise) {
    return legacyDuckBundlePromise;
  }

  legacyDuckBundlePromise = new Promise((resolve) => {
    const cached = assetManager.getBundle(LEGACY_DUCK_BUNDLE_NAME);
    if (cached) {
      resolve(cached);
      return;
    }

    assetManager.loadBundle(LEGACY_DUCK_BUNDLE_NAME, (error, bundle) => {
      if (error || !bundle) {
        resolve(null);
        return;
      }
      resolve(bundle);
    });
  });

  return legacyDuckBundlePromise;
}
