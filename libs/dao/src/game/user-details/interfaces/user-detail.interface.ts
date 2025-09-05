import { Domain } from '@libs/common/domain/domain';
import { Currency } from '@libs/dao/game/user-details/type/currency';

export interface UserDetail extends Domain {
  userId: number;
  gold?: number;

  currency?: Currency;
}
