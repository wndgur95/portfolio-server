export const VISIBLE_STATE = {
  NONE: 0,
  UNIT_TEST: 1,
  TEST: 2,
  LIVE: 3,
  MAX: 4,
} as const;
export type VisibleState = (typeof VISIBLE_STATE)[keyof typeof VISIBLE_STATE];

export const OS_TYPE = {
  NONE: 0,
  ANDROID: 1,
  IOS: 2,
  WINDOW: 3,
} as const;
export type OsType = (typeof OS_TYPE)[keyof typeof OS_TYPE];

export const CHARACTER_TIER_TYPE = {
  NONE: 0,
  N: 1,
  R: 2,
  S_R: 3,
  S_S_R: 4,
} as const;
export type CharacterTierType =
  (typeof CHARACTER_TIER_TYPE)[keyof typeof CHARACTER_TIER_TYPE];

export const CHARACTER_WEAPON = {
  NONE: 0,
  SWORD: 1,
  BREATH: 2,
} as const;
export type CharacterWeapon =
  (typeof CHARACTER_WEAPON)[keyof typeof CHARACTER_WEAPON];

export const PURCHASE_ORDER_STATE = {
  NONE: 0,
  RESERVE: 1,
  COMPLETED: 2,
  CANCELED: 3,
} as const;
export type PurchaseOrderState =
  (typeof PURCHASE_ORDER_STATE)[keyof typeof PURCHASE_ORDER_STATE];

export const CASH_SHOP = {
  NONE: 0,
} as const;
export type CashShop = (typeof CASH_SHOP)[keyof typeof CASH_SHOP];

export const GOODS_TYPE = {
  NONE: 0,
  CURRENCY: 1,
  CHARACTER: 2,
} as const;
export type GoodsType = (typeof GOODS_TYPE)[keyof typeof GOODS_TYPE];

export const CURRENCY_TYPE = {
  NONE: 0,
  GOLD: 1,
  CASH: 2,
} as const;
export type CurrencyType = (typeof CURRENCY_TYPE)[keyof typeof CURRENCY_TYPE];

export const MISSION_TYPE = {
  NONE: 0,
  DAILY: 1,
  REPETITION: 2,
  ONCE: 3,
} as const;
export type MissionType = (typeof MISSION_TYPE)[keyof typeof MISSION_TYPE];

export const MISSION_STEP_TYPE = {
  NONE: 0,
  CUMULATE: 1,
  NON_CUMULATIVE: 2,
} as const;
export type MissionStepType =
  (typeof MISSION_STEP_TYPE)[keyof typeof MISSION_STEP_TYPE];

export const CONDITION_COUNT_TYPE = {
  NONE: 0,
  BATTLE: 1,
  KILL_ENEMY: 2,
  GACHA: 3,
  CHARACTER_LEVEL_UP: 4,
} as const;
export type ConditionCountType =
  (typeof CONDITION_COUNT_TYPE)[keyof typeof CONDITION_COUNT_TYPE];

export const RECEIVE_TYPE = {
  NONE: 0,
  ALL: 1,
  RANDOM: 2,
} as const;
export type ReceiveType = (typeof RECEIVE_TYPE)[keyof typeof RECEIVE_TYPE];
