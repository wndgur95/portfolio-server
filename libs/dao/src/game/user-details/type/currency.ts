import { Column } from 'typeorm';
import { CURRENCY_TYPE } from '@libs/dao/static/common.constants';

export const CURRENCY_PROPS = {
  [CURRENCY_TYPE.GOLD]: 'gold',
  [CURRENCY_TYPE.CASH]: 'cash',
} as const;

export class Currency {
  @Column({
    comment: '골드',
    unsigned: true,
    default: 0,
  })
  gold: number;
}
