import { DataGachaEnum } from '@libs/dao/static/data-gacha/data-gacha.enum';

export class DataGacha extends DataGachaEnum {
  STATE: number;
  COUNT: number[];
  TIER_RATIO: number[];
  COST: number;
}
