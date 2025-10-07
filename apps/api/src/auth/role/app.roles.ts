import { RolesBuilder } from 'nest-access-control';
import { USER_ROLES } from '@libs/common/constants/role.constants';

export const roles: RolesBuilder = new RolesBuilder();

export const RoleAuthority = {
  ADMIN: [
    USER_ROLES.GUEST,
    USER_ROLES.DEVELOPER,
    USER_ROLES.MANAGER,
    USER_ROLES.ADMIN,
  ],
  MANAGER: [USER_ROLES.GUEST, USER_ROLES.DEVELOPER, USER_ROLES.MANAGER],
  DEVELOPER: [USER_ROLES.GUEST, USER_ROLES.DEVELOPER],
  GUEST: [USER_ROLES.GUEST],

  SUPER: [
    USER_ROLES.GUEST,
    USER_ROLES.DEVELOPER,
    USER_ROLES.MANAGER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER,
  ],
};
