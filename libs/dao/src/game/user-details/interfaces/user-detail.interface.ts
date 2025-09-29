import { Domain } from '@libs/common/domain/domain';
import { Currency } from '@libs/dao/game/user-details/type/currency';
import { InitAt } from '@libs/dao/game/user-details/type/init-at';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

export interface UserDetail extends Domain {
  userId: number;
  currency?: Currency;
  initAt?: InitAt;

  characters?: Promise<Character[]>;
  missions?: Promise<Mission[]>;
}
