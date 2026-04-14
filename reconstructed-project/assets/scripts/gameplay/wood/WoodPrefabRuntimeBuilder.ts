import { WoodPrefabNodeFactoryOptions, WoodPrefabNodeStructure, buildWoodPrefabNodeStructure } from './WoodPrefabNodeFactory';
import { getWoodPrefabBlueprint } from './WoodPrefabBlueprintCatalog';

export interface WoodPrefabRuntimeBuilderOptions extends Omit<WoodPrefabNodeFactoryOptions, 'blueprint'> {
  woodType: number;
}

export function buildWoodPrefabNodeStructureByType(
  options: WoodPrefabRuntimeBuilderOptions
): WoodPrefabNodeStructure | null {
  const blueprint = getWoodPrefabBlueprint(options.woodType);
  if (!blueprint) {
    return null;
  }

  return buildWoodPrefabNodeStructure({
    ...options,
    blueprint
  });
}
