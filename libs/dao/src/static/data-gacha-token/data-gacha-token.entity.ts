import { DataGachaTokenEnum } from '@libs/dao/static/data-gacha-token/data-gacha-token.enum';

export class DataGachaToken extends DataGachaTokenEnum {
  STATE: number;
  NAME: string;
  GACHA_TYPE: number;
  TIER_RATIO: number[];
}
