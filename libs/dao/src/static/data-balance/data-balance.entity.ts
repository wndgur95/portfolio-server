import { DataBalanceEnum } from '@libs/dao/static/data-balance/data-balance.enum';

export class DataBalance extends DataBalanceEnum {
  STATE: number;
  DESC: string;
  INDEX_COUNT: number;
  INDEX: number[];
}
