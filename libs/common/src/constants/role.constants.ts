export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  DEVELOPER: 'DEVELOPER',
  GUEST: 'GUEST',

  SUPER: 'SUPER',
} as const;
export type UserRoles = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const GROUP_MEMBER_ROLES = {
  NONE: 0,
  MASTER: 1,
  MEMBER: 2,
} as const;
export type GroupMemberRoles =
  (typeof GROUP_MEMBER_ROLES)[keyof typeof GROUP_MEMBER_ROLES];
