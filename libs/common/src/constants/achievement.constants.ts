import { MISSION_TYPE } from '@libs/dao/static/common.constants';

export const MISSION_TYPE_PROPS = {
  [MISSION_TYPE.DAILY]: 'daily',
  [MISSION_TYPE.REPETITION]: 'repetition',
  [MISSION_TYPE.ONCE]: 'once',
} as const;

export const DUNGEON_CONDITION = {
  ALL: 0,
  CLEAR: 1,
  FAIL: 2,
} as const;

// achieve 조건
export const AUTO_BATTLE_CONDITION = {
  ALL: 0,
  REWARD: 1, // 넷마이닝 일반 보상
  FAST_REWARD: 2, // 넷마이닝 빠른 보상
} as const;
