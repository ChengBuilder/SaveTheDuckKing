import { Color, Graphics, Layers, Node, PolygonCollider2D, Sprite, SpriteFrame, UITransform, Vec2 } from 'cc';
import {
  WoodPrefabBlueprint,
  WoodSize,
  WoodNailBlueprint,
  WoodPoint
} from './WoodPrefabBlueprint';

const DEFAULT_ROOT_SIZE: WoodSize = { width: 200, height: 68 };
const DEFAULT_NAIL_SLOT_SIZE: WoodSize = { width: 18, height: 18 };
const WOOD_SPRITE_NODE_NAME = 'woodSprite';
const WOOD_COLLIDER_NODE_NAME = 'woodCollider';
const WOOD_NAIL_CONTAINER_NAME = 'woodNails';
const WOOD_NAIL_NAME_PREFIX = 'nailSlot';
const UI_LAYER = Layers.Enum.UI_2D;

export interface WoodPrefabNodeFactoryOptions {
  blueprint: WoodPrefabBlueprint;
  rootName?: string;
  spriteFrame?: SpriteFrame | null;
  nailSpriteFrame?: SpriteFrame | null;
  nailSlotSize?: WoodSize;
}

export interface WoodPrefabNodeStructure {
  root: Node;
  spriteNode: Node;
  colliderNode: Node;
  nailContainer: Node;
  nailNodes: Node[];
}

export function buildWoodPrefabNodeStructure(
  options: WoodPrefabNodeFactoryOptions
): WoodPrefabNodeStructure {
  const { blueprint } = options;
  const root = createWoodRootNode(blueprint, options.rootName);
  const spriteNode = createWoodSpriteNode(blueprint, options.spriteFrame);
  const colliderNode = createWoodColliderNode(blueprint);
  const nailContainer = createNailGroupNode();

  root.addChild(spriteNode);
  root.addChild(colliderNode);
  root.addChild(nailContainer);

  const nailNodes: Node[] = [];
  for (const nailBlueprint of blueprint.nails) {
    const nailNode = createNailSlotNode(
      nailBlueprint,
      options.nailSlotSize,
      options.nailSpriteFrame
    );
    nailContainer.addChild(nailNode);
    nailNodes.push(nailNode);
  }

  return {
    root,
    spriteNode,
    colliderNode,
    nailContainer,
    nailNodes
  };
}

function createWoodRootNode(blueprint: WoodPrefabBlueprint, overrideName?: string): Node {
  const nodeName = overrideName || blueprint.rootNodeName || `wood-${blueprint.woodType}`;
  const node = new Node(nodeName);
  node.layer = UI_LAYER;
  const transform = node.addComponent(UITransform);
  const size = blueprint.rootSize ?? blueprint.woodSpriteSize ?? DEFAULT_ROOT_SIZE;
  transform.setContentSize(size.width, size.height);
  return node;
}

function createWoodSpriteNode(blueprint: WoodPrefabBlueprint, spriteFrame?: SpriteFrame | null): Node {
  const node = new Node(WOOD_SPRITE_NODE_NAME);
  node.layer = UI_LAYER;
  const transform = node.addComponent(UITransform);
  const spriteSize = blueprint.woodSpriteSize ?? blueprint.rootSize ?? DEFAULT_ROOT_SIZE;
  transform.setContentSize(spriteSize.width, spriteSize.height);
  const sprite = node.addComponent(Sprite);
  sprite.sizeMode = Sprite.SizeMode.CUSTOM;
  sprite.spriteFrame = spriteFrame ?? null;
  if (!spriteFrame) {
    applyWoodPlaceholder(spriteSize, node, blueprint.woodType);
  }
  return node;
}

function createWoodColliderNode(blueprint: WoodPrefabBlueprint): Node {
  const node = new Node(WOOD_COLLIDER_NODE_NAME);
  node.layer = UI_LAYER;
  const transform = node.addComponent(UITransform);
  const colliderSize = blueprint.rootSize ?? blueprint.woodSpriteSize ?? DEFAULT_ROOT_SIZE;
  transform.setContentSize(colliderSize.width, colliderSize.height);
  const collider = node.addComponent(PolygonCollider2D);
  applyColliderBlueprint(collider, blueprint.colliderPoints);
  return node;
}

function createNailGroupNode(): Node {
  const node = new Node(WOOD_NAIL_CONTAINER_NAME);
  node.layer = UI_LAYER;
  node.addComponent(UITransform);
  return node;
}

function createNailSlotNode(
  nailBlueprint: WoodNailBlueprint,
  slotSize?: WoodSize,
  spriteFrame?: SpriteFrame | null
): Node {
  const node = new Node(`${WOOD_NAIL_NAME_PREFIX}-${nailBlueprint.index}`);
  node.layer = UI_LAYER;
  const transform = node.addComponent(UITransform);
  const size = slotSize ?? DEFAULT_NAIL_SLOT_SIZE;
  transform.setContentSize(size.width, size.height);
  const sprite = node.addComponent(Sprite);
  sprite.sizeMode = Sprite.SizeMode.CUSTOM;
  sprite.spriteFrame = spriteFrame ?? null;
  if (!spriteFrame) {
    applyNailPlaceholder(size, node);
  }
  node.setPosition(
    nailBlueprint.localPosition.x,
    nailBlueprint.localPosition.y,
    nailBlueprint.localPosition.z
  );
  return node;
}

function applyColliderBlueprint(collider: PolygonCollider2D, points: WoodPoint[]): void {
  if (!points.length) {
    return;
  }
  collider.points = points.map((point) => new Vec2(point.x, point.y));
}

function applyWoodPlaceholder(size: WoodSize, node: Node, woodType: number): void {
  const graphics = node.addComponent(Graphics);
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;
  const colors = getWoodPlaceholderColors(woodType);
  graphics.fillColor = colors.fill;
  graphics.strokeColor = colors.stroke;
  graphics.lineWidth = 4;
  graphics.roundRect(-halfWidth, -halfHeight, size.width, size.height, 10);
  graphics.fill();
  graphics.stroke();
}

function applyNailPlaceholder(size: WoodSize, node: Node): void {
  const graphics = node.addComponent(Graphics);
  const radius = Math.max(4, Math.min(size.width, size.height) * 0.35);
  graphics.fillColor = new Color(196, 205, 214, 255);
  graphics.strokeColor = new Color(92, 104, 118, 255);
  graphics.lineWidth = 2;
  graphics.circle(0, 0, radius);
  graphics.fill();
  graphics.stroke();
}

function getWoodPlaceholderColors(woodType: number): { fill: Color; stroke: Color } {
  const palette = [
    { fill: new Color(178, 129, 74, 255), stroke: new Color(110, 73, 33, 255) },
    { fill: new Color(194, 147, 93, 255), stroke: new Color(120, 82, 40, 255) },
    { fill: new Color(168, 110, 70, 255), stroke: new Color(104, 60, 28, 255) },
    { fill: new Color(188, 141, 79, 255), stroke: new Color(115, 78, 35, 255) }
  ];
  return palette[Math.abs(woodType) % palette.length];
}
