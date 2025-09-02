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

export const CHARACTER_CLASS_TYPE = {
  NONE: 0,
  SLAUGHTER: 1,
  JACKER: 2,
  VANGUARD: 3,
  REWINDER: 4,
} as const;
export type CharacterClassType =
  (typeof CHARACTER_CLASS_TYPE)[keyof typeof CHARACTER_CLASS_TYPE];

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
  CHARACTER: 1,
} as const;
export type GoodsType = (typeof GOODS_TYPE)[keyof typeof GOODS_TYPE];
