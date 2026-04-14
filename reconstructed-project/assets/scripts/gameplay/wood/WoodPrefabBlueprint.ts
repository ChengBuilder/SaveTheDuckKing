export interface WoodSize {
  width: number;
  height: number;
}

export interface WoodPoint {
  x: number;
  y: number;
}

export interface WoodNailBlueprint {
  index: number;
  name: string;
  localPosition: {
    x: number;
    y: number;
    z: number;
  };
}

export interface WoodScale {
  x: number;
  y: number;
  z: number;
}

export interface NailPrefabBlueprint {
  assetPath: string;
  importMode: 'direct' | 'pack';
  source: string;
  sourceIndex: number;
  rootNodeName: string;
  rootSize: WoodSize | null;
  spriteSize: WoodSize | null;
  nodeScale: WoodScale | null;
  spriteDependencies: string[];
  externalDependencies: string[];
  notes: string[];
}

export interface WoodPrefabBlueprint {
  woodType: number;
  assetPath: string;
  importMode: 'direct' | 'pack';
  source: string;
  sourceIndex: number;
  rootNodeName: string;
  rootSize: WoodSize | null;
  woodSpriteSize: WoodSize | null;
  woodSpriteDependencies: string[];
  woodSpriteScale: WoodScale | null;
  colliderPoints: WoodPoint[];
  nails: WoodNailBlueprint[];
  nailPrefabAssetPath: string;
  externalDependencies: string[];
  notes: string[];
}
