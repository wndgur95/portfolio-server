import { GoodsType } from '@libs/dao/static/common.constants';

export interface Reward {
  goodsType: GoodsType;
  dataId: number;
  quantity: number;
}

export interface RewardOptions {
  addValue: number;
}

export interface Cost {
  goodsType: GoodsType;
  dataId: number;
  quantity: number;
}

export interface CostOptions {
  addValue: number;
}
