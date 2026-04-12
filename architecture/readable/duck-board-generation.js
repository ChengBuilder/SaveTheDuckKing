'use strict';

/**
 * Readable mirror of Duck board/nail generation logic.
 *
 * Source of truth at runtime is still:
 * - runtime/gamejs-modules/036__assets__start-scene__index.start-scene.js__c6e1947.js
 *   (DuckController.ts + Wood.ts + Nail.ts)
 *
 * This module is for maintenance/readability and future migration.
 */

const DEFAULT_WOOD_TYPE_CANDIDATES = [2, 8, 4, 5, 6, 9, 12, 13, 15, 16, 17, 18, 27];
const DEFAULT_TIDY_WOOD_TYPE_SEQUENCE = [2, 2, 4, 4, 9, 9, 27, 27];

/** 中文说明：原地打乱数组，用于复刻原逻辑中的随机顺序。 */
function shuffleInPlace(array, random = Math.random) {
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const temp = array[index];
    array[index] = array[swapIndex];
    array[swapIndex] = temp;
  }
  return array;
}

/** 中文说明：判断当前关卡是否属于“单木板类型”关卡。 */
function isSingleWoodTypeLevel(level) {
  return level === 8 || level === 18 || (level > 21 && (level - 21) % 10 === 7);
}

/** 中文说明：统计 1..currentLevel 范围内累计出现了多少个单木板类型关卡。 */
function countSingleWoodTypeLevels(currentLevel) {
  let count = 0;
  for (let level = 1; level <= currentLevel; level += 1) {
    if (isSingleWoodTypeLevel(level)) {
      count += 1;
    }
  }
  return count;
}

/** 中文说明：根据历史单木板关卡次数轮换选择木板类型。 */
function pickSingleWoodType(currentLevel, maxWoodType) {
  const available = DEFAULT_WOOD_TYPE_CANDIDATES.filter(function filterByMax(type) {
    return type <= maxWoodType;
  });
  if (available.length === 0) {
    return 2;
  }
  const seenSingleTypeLevels = countSingleWoodTypeLevels(currentLevel);
  const pickIndex = (seenSingleTypeLevels - 1) % available.length;
  return available[pickIndex];
}

/** 中文说明：判断当前关卡是否属于“整齐布局”关卡。 */
function isTidyLevel(level) {
  if (level === 9 || level === 13 || level === 18) {
    return true;
  }
  if (level > 21) {
    const offset = (level - 21) % 10;
    return offset === 2 || offset === 8;
  }
  return false;
}

/** 中文说明：统计 1..currentLevel 范围内累计出现了多少个整齐布局关卡。 */
function countTidyLevels(currentLevel) {
  let count = 0;
  for (let level = 1; level <= currentLevel; level += 1) {
    if (isTidyLevel(level)) {
      count += 1;
    }
  }
  return count;
}

/** 中文说明：按整齐关卡出现次数轮换选择整齐布局的木板类型。 */
function pickTidyWoodType(currentLevel) {
  const seenTidyLevels = countTidyLevels(currentLevel);
  return DEFAULT_TIDY_WOOD_TYPE_SEQUENCE[(seenTidyLevels - 1) % DEFAULT_TIDY_WOOD_TYPE_SEQUENCE.length];
}

/** 中文说明：生成整齐布局下单块木板的位置与角度（与旧逻辑一致）。 */
function buildTidyWoodTransform(levelIndexInCurrentLayout, currentLevel) {
  const tidyCount = countTidyLevels(currentLevel);
  const evenTidyCount = tidyCount % 2 === 0;

  if (evenTidyCount) {
    return {
      woodX: 0,
      woodY: 0,
      woodAngle: levelIndexInCurrentLayout % 2 === 0 ? 90 : 0
    };
  }

  return {
    woodX: 0,
    woodY: 0,
    woodAngle: levelIndexInCurrentLayout % 2 === 0 ? -45 : 45
  };
}

/** 中文说明：根据难度比例与类型上限构建钉子类型池。 */
function buildNailTypeBuckets(options) {
  const holeCount = options.holeCount;
  const maxNailType = options.maxNailType;
  const ratioEasy = options.ratioEasy;
  const ratioMedium = options.ratioMedium;
  const ratioHard = options.ratioHard;
  const easyTypeCap = options.easyTypeCap;
  const mediumTypeCap = options.mediumTypeCap;
  const hardTypeCap = options.hardTypeCap;
  const random = options.random || Math.random;

  const hardBucket = [];
  const mediumBucket = [];
  const easyBucket = [];

  for (let holeIndex = 0; holeIndex < holeCount; holeIndex += 1) {
    if (holeIndex < holeCount * ratioEasy) {
      const effectiveCap = maxNailType > easyTypeCap ? easyTypeCap : maxNailType;
      let type = (holeIndex + 1) % effectiveCap;
      if (type === 0) {
        type = effectiveCap;
      }
      hardBucket.push(type, type);
      continue;
    }

    if (holeIndex < holeCount * (ratioEasy + ratioMedium)) {
      const effectiveCap = maxNailType > mediumTypeCap ? mediumTypeCap : maxNailType;
      let type = (holeIndex + 1) % effectiveCap;
      if (type === 0) {
        type = effectiveCap;
      }
      mediumBucket.push(type, type);
      continue;
    }

    if (holeIndex < holeCount * (ratioEasy + ratioMedium + ratioHard)) {
      const effectiveCap = maxNailType > hardTypeCap ? hardTypeCap : maxNailType;
      let type = (holeIndex + 1) % effectiveCap;
      if (type === 0) {
        type = effectiveCap;
      }
      easyBucket.push(type, type);
    }
  }

  shuffleInPlace(hardBucket, random);
  shuffleInPlace(mediumBucket, random);
  shuffleInPlace(easyBucket, random);

  return hardBucket.concat(mediumBucket, easyBucket);
}

/** 中文说明：按关卡与模式标记选择钉子分布参数。 */
function pickNailDistribution(level, flags) {
  const result = {
    ratioEasy: 0.2,
    ratioMedium: 0.3,
    ratioHard: 0.5,
    easyTypeCap: 13,
    mediumTypeCap: 9,
    hardTypeCap: 6
  };

  if (flags.snagMode) {
    result.ratioEasy = 0.2;
    result.ratioMedium = 0.1;
    result.ratioHard = 0.7;
    result.easyTypeCap = 14;
    result.mediumTypeCap = 9;
    result.hardTypeCap = 6;
    return result;
  }

  if (level === 2) {
    result.ratioEasy = 0.3;
    result.ratioMedium = 0.4;
    result.ratioHard = 0.3;
    result.easyTypeCap = 10;
    result.mediumTypeCap = 7;
    result.hardTypeCap = 5;
    return result;
  }

  if (level === 3) {
    result.ratioEasy = 0.3;
    result.ratioMedium = 0.3;
    result.ratioHard = 0.4;
    result.easyTypeCap = 11;
    result.mediumTypeCap = 8;
    result.hardTypeCap = 6;
    return result;
  }

  if (level === 4) {
    result.ratioEasy = 0.3;
    result.ratioMedium = 0.3;
    result.ratioHard = 0.4;
    result.easyTypeCap = 13;
    result.mediumTypeCap = 9;
    result.hardTypeCap = 7;
    return result;
  }

  if (flags.combinationMode) {
    result.ratioEasy = 0.2;
    result.ratioMedium = 0.2;
    result.ratioHard = 0.6;
    result.easyTypeCap = 12;
    result.mediumTypeCap = 9;
    result.hardTypeCap = 6;
    return result;
  }

  if (level > 2) {
    result.ratioEasy = 0.2;
    result.ratioMedium = 0.2;
    result.ratioHard = 0.6;
    result.easyTypeCap = 14;
    result.mediumTypeCap = 10;
    result.hardTypeCap = 7;
    return result;
  }

  return result;
}

/** 中文说明：构建关卡初始钉子类型计划。 */
function buildInitialNailTypePlan(options) {
  const level = options.level;
  const maxNailType = options.maxNailType;
  const holeCount = options.holeCount;
  const flags = options.flags || {};
  const random = options.random || Math.random;

  const distribution = pickNailDistribution(level, {
    snagMode: !!flags.snagMode,
    combinationMode: !!flags.combinationMode
  });

  return buildNailTypeBuckets({
    holeCount: holeCount,
    maxNailType: maxNailType,
    ratioEasy: distribution.ratioEasy,
    ratioMedium: distribution.ratioMedium,
    ratioHard: distribution.ratioHard,
    easyTypeCap: distribution.easyTypeCap,
    mediumTypeCap: distribution.mediumTypeCap,
    hardTypeCap: distribution.hardTypeCap,
    random: random
  });
}

/** 中文说明：根据层数估算组索引偏移量，复刻旧逻辑阈值。 */
function calcGroupIndexOffset(groupCount, level) {
  let offset = 0;
  if (groupCount > 18) {
    offset = 5;
  } else if (groupCount > 15) {
    offset = 4;
  } else if (groupCount > 13) {
    offset = 3;
  } else if (groupCount > 11) {
    offset = 1;
  }

  if (level === 2 || level === 4) {
    if (groupCount > 18) {
      offset = 5;
    } else if (groupCount > 15 || groupCount > 13) {
      offset = 4;
    } else if (groupCount > 6) {
      offset = 1;
    }
  }

  return offset;
}

/** 中文说明：根据 woodType 在配置表中反查洞位数量。 */
function getWoodHoleCount(woodType, woodHoleConfig) {
  for (let holeCount = 1; holeCount < 7; holeCount += 1) {
    if (woodHoleConfig[holeCount].includes(woodType)) {
      return holeCount;
    }
  }
  return 0;
}

/** 中文说明：复活阶段按钉子总数拆分为若干木板类型。 */
function buildReviveWoodTypesByNailCount(nailCount) {
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

/** 中文说明：按单块木板类型切分该块应承载的钉子类型数组。 */
function splitNailTypesForReviveWood(woodType, nailTypes, cursor) {
  if (woodType === 2) {
    return { nextCursor: cursor + 2, types: nailTypes.slice(cursor, cursor + 2) };
  }
  if (woodType === 11) {
    return { nextCursor: cursor + 3, types: nailTypes.slice(cursor, cursor + 3) };
  }
  if (woodType === 37) {
    return { nextCursor: cursor + 4, types: nailTypes.slice(cursor, cursor + 4) };
  }
  if (woodType === 42) {
    return { nextCursor: cursor + 5, types: nailTypes.slice(cursor, cursor + 5) };
  }
  return { nextCursor: cursor, types: [] };
}

/** 中文说明：生成复活重组时的木板信息清单。 */
function buildReviveWoodInformation(nailTypes, options) {
  const randomInRange = options && typeof options.randomInRange === 'function'
    ? options.randomInRange
    : function defaultRandomInRange(min, max) {
      return min + Math.random() * (max - min);
    };

  const woodTypes = buildReviveWoodTypesByNailCount(nailTypes.length);
  const reviveList = [];
  let cursor = 0;

  for (let index = 0; index < woodTypes.length; index += 1) {
    const woodType = woodTypes[index];
    const split = splitNailTypesForReviveWood(woodType, nailTypes, cursor);
    cursor = split.nextCursor;

    reviveList.push({
      woodType: woodType,
      woodColor: 1,
      woodPos: {
        x: index === 0 ? randomInRange(-300, -200) : randomInRange(200, 300),
        y: randomInRange(0, 100),
        z: 0
      },
      woodAngle: randomInRange(0, 360),
      woodGroupIndex: 'L29',
      nailTypeArr: split.types
    });
  }

  return reviveList;
}

module.exports = {
  buildInitialNailTypePlan,
  buildNailTypeBuckets,
  buildReviveWoodInformation,
  buildReviveWoodTypesByNailCount,
  buildTidyWoodTransform,
  calcGroupIndexOffset,
  countSingleWoodTypeLevels,
  countTidyLevels,
  getWoodHoleCount,
  isSingleWoodTypeLevel,
  isTidyLevel,
  pickSingleWoodType,
  pickTidyWoodType,
  pickNailDistribution,
  shuffleInPlace,
  splitNailTypesForReviveWood
};
