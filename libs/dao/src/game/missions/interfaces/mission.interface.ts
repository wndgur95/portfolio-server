import { Domain } from '@libs/common/domain/domain';

export interface Mission extends Domain {
  userId: number;
  dataMissionId: number;
  count: number;
  rewardAt: Date;
}
