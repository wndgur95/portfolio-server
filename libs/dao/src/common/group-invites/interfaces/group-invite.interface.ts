import { Domain } from '@libs/common/domain/domain';

export interface GroupInvite extends Domain {
  groupId: number;
  userId: number;
}
