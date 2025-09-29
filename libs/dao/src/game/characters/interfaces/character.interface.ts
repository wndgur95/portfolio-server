import { Domain } from '@libs/common/domain/domain';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';

export interface Character extends Domain {
  userId: number;
  dataCharacterId: number;
  level: number;
  count: number;

  userDetail?: Promise<UserDetail>;
}
