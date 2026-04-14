import { buildReviveWoodPlan, BuildReviveWoodPlanOptions, ReviveWoodPlanEntry } from './ReviveWoodPlan';

export interface LegacyRuntimeNailComponentLike {
  type: number;
}

export interface LegacyRuntimeNailNodeLike {
  getComponent(componentName: 'Nail'): LegacyRuntimeNailComponentLike | null;
}

export function extractReviveNailTypesFromLegacyNodes(
  reviveNailNodes: readonly LegacyRuntimeNailNodeLike[]
): number[] {
  const reviveNailTypes: number[] = [];

  for (const nailNode of reviveNailNodes) {
    const nailComponent = nailNode.getComponent('Nail');
    if (!nailComponent) {
      continue;
    }
    reviveNailTypes.push(nailComponent.type);
  }

  return reviveNailTypes;
}

export function buildReviveWoodPlanFromLegacyNodes(
  reviveNailNodes: readonly LegacyRuntimeNailNodeLike[],
  options: Omit<BuildReviveWoodPlanOptions, 'reviveNailTypes'> = {}
): ReviveWoodPlanEntry[] {
  return buildReviveWoodPlan({
    ...options,
    reviveNailTypes: extractReviveNailTypesFromLegacyNodes(reviveNailNodes)
  });
}
