import { Domain } from '@libs/common/domain/domain';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';

export interface Mission extends Domain {
  userId: number;
  dataMissionId: number;
  count: number;
  rewardAt: Date;

  userDetail?: Promise<UserDetail>;
}
