import { Domain } from '@libs/common/domain/domain';
import { GroupMemberRoles } from '@libs/common/constants/role.constants';

export interface GroupMember extends Domain {
  groupId: number;
  userId: number;
  name: string;
  role: GroupMemberRoles;
  signUpAt: Date;
}
