import { Domain } from '@libs/common/domain/domain';
import { UserRoles } from '@libs/common/constants/role.constants';

export interface User extends Domain {
  name: string;
  recommendCode: string;
  email?: string;
  password?: string;
  platformId?: string;
  roles: UserRoles;
  activatedAt: Date;
  image: string;
  userDbId: number;
  provider?: string;

  hashPassword(): Promise<void>;
  checkPassword(password: string): Promise<boolean>;
}
