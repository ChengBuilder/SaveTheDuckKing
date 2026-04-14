import { Vec3 } from 'cc';

export type ReviveWoodType = 2 | 11 | 37 | 42;
export type InclusiveRange = readonly [number, number];
export type RandomIntResolver = (min: number, max: number) => number;

export interface ReviveWoodPlanEntry {
  woodType: ReviveWoodType;
  woodColor: number;
  woodGroupKey: string;
  woodPos: Vec3;
  woodAngle: number;
  nailTypeArr: number[];
}

export interface BuildReviveWoodPlanOptions {
  reviveNailTypes: readonly number[];
  woodColor?: number;
  woodGroupKey?: string;
  leftWoodXRange?: InclusiveRange;
  rightWoodXRange?: InclusiveRange;
  yRange?: InclusiveRange;
  angleRange?: InclusiveRange;
  randomInt?: RandomIntResolver;
}

const DEFAULT_LEFT_WOOD_X_RANGE: InclusiveRange = [-300, -200];
const DEFAULT_RIGHT_WOOD_X_RANGE: InclusiveRange = [200, 300];
const DEFAULT_Y_RANGE: InclusiveRange = [0, 100];
const DEFAULT_ANGLE_RANGE: InclusiveRange = [0, 360];
const DEFAULT_WOOD_GROUP_KEY = 'L29';

export function getReviveWoodTypesByNailCount(nailCount: number): ReviveWoodType[] {
  switch (nailCount) {
    case 2:
      return [2];
    case 3:
      return [11];
    case 4:
      return [2, 2];
    case 5:
      return [2, 11];
    case 6:
      return [11, 11];
    case 7:
      return [37, 11];
    case 8:
      return [37, 37];
    case 9:
      return [42, 37];
    case 10:
      return [42, 42];
    default:
      return [];
  }
}

export function getReviveWoodNailCount(woodType: ReviveWoodType): number {
  switch (woodType) {
    case 2:
      return 2;
    case 11:
      return 3;
    case 37:
      return 4;
    case 42:
      return 5;
    default:
      return 0;
  }
}

export function splitReviveNailTypesByWoodType(
  woodType: ReviveWoodType,
  reviveNailTypes: readonly number[],
  cursor: number
): { nextCursor: number; nailTypeArr: number[] } {
  const nailCount = getReviveWoodNailCount(woodType);
  return {
    nextCursor: cursor + nailCount,
    nailTypeArr: reviveNailTypes.slice(cursor, cursor + nailCount)
  };
}

export function buildReviveWoodPlan(options: BuildReviveWoodPlanOptions): ReviveWoodPlanEntry[] {
  const reviveNailTypes = options.reviveNailTypes.slice();
  const reviveWoodTypes = getReviveWoodTypesByNailCount(reviveNailTypes.length);
  const randomInt = options.randomInt || createDefaultRandomInt;
  const leftWoodXRange = options.leftWoodXRange || DEFAULT_LEFT_WOOD_X_RANGE;
  const rightWoodXRange = options.rightWoodXRange || DEFAULT_RIGHT_WOOD_X_RANGE;
  const yRange = options.yRange || DEFAULT_Y_RANGE;
  const angleRange = options.angleRange || DEFAULT_ANGLE_RANGE;

  const reviveWoodPlan: ReviveWoodPlanEntry[] = [];
  let cursor = 0;

  for (let woodIndex = 0; woodIndex < reviveWoodTypes.length; woodIndex += 1) {
    const woodType = reviveWoodTypes[woodIndex];
    const splitResult = splitReviveNailTypesByWoodType(woodType, reviveNailTypes, cursor);
    const xRange = woodIndex === 0 ? leftWoodXRange : rightWoodXRange;

    cursor = splitResult.nextCursor;
    reviveWoodPlan.push({
      woodType: woodType,
      woodColor: options.woodColor ?? 1,
      woodGroupKey: options.woodGroupKey || DEFAULT_WOOD_GROUP_KEY,
      woodPos: new Vec3(
        randomIntInRange(xRange, randomInt),
        randomIntInRange(yRange, randomInt),
        0
      ),
      woodAngle: randomIntInRange(angleRange, randomInt),
      nailTypeArr: splitResult.nailTypeArr
    });
  }

  return reviveWoodPlan;
}

function randomIntInRange(range: InclusiveRange, randomInt: RandomIntResolver): number {
  const min = Math.min(range[0], range[1]);
  const max = Math.max(range[0], range[1]);
  return randomInt(min, max);
}

function createDefaultRandomInt(min: number, max: number): number {
  const normalizedMin = Math.ceil(Math.min(min, max));
  const normalizedMax = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (normalizedMax - normalizedMin + 1)) + normalizedMin;
}
