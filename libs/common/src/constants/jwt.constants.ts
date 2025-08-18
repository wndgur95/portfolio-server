import { UserRoles } from '@libs/common/constants/role.constants';

export const JWT_OPTIONS = {
  expiresIn: 60 * 60 * 24 * 30,
};

export interface JwtPayload {
  id: number;
  name: string;
  recommendCode: string;
  email?: string;
  platformId?: string;
  roles: UserRoles;
  activatedAt: Date;
  image: string;
  userDbId?: number;
  database?: string;
}
