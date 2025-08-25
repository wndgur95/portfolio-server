import { Domain } from '@libs/common/domain/domain';
import { UserRoles } from '@libs/common/constants/role.constants';

export interface User extends Domain {
  email?: string;
  password?: string;
  platformId?: string;
  roles: UserRoles;
  userDbId: number;
  provider?: string;
  refreshToken?: string;

  hashPassword(): Promise<void>;
  checkPassword(password: string): Promise<boolean>;
}
