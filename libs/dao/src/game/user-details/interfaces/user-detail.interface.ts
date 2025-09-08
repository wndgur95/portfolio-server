import { Domain } from '@libs/common/domain/domain';
import { Currency } from '@libs/dao/game/user-details/type/currency';
import { InitAt } from '@libs/dao/game/user-details/type/init-at';

export interface UserDetail extends Domain {
  userId: number;
  currency?: Currency;
  initAt?: InitAt;
}
