import { UserRoles } from '@libs/common/constants/role.constants';

export const JWT_OPTIONS = {
  expiresIn: 60 * 60, // 3600s - 1h
};

export const JWT_REFRESH_OPTIONS = {
  expiresIn: 60 * 60 * 24 * 15, // 15 days
};

// 패스워드 정책 상수
export const PASSWORD_POLICY = {
  /** 패스워드 최소 길이 */
  MIN_LENGTH: 10,
  /** 패스워드 최대 길이 */
  MAX_LENGTH: 30,
  /** 소문자 포함 개수 */
  LOWER_CASE: 1,
  /** 대문자 포함 개수 */
  UPPER_CASE: 1,
  /** 숫자 포함 개수 */
  NUMERIC: 1,
  /** 특수문자 포함 개수 */
  SYMBOL: 1,
  /** 전체 요구사항 중 최소 만족 개수 (4개 중 4개 모두 만족해야 함) */
  REQUIREMENT_COUNT: 4,
} as const;

export interface JwtPayload {
  id: number;
  email?: string;
  platformId?: string;
  roles: UserRoles;
  userDbId?: number;
  database?: string;
}
