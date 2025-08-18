export const PeriodRedisKey = {};
export type PeriodRedisKey =
  (typeof PeriodRedisKey)[keyof typeof PeriodRedisKey];

export const PeriodRedisExpiration = {};
export type PeriodRedisExpiration =
  (typeof PeriodRedisExpiration)[keyof typeof PeriodRedisExpiration];

export const RedisDbNumber = {
  REQUEST_COUNT: 0,
  IDEA: 1,
  DEVELOPER_NOTE: 2,
  KNOW_HOW: 3,
};
export type RedisDbNumber = (typeof RedisDbNumber)[keyof typeof RedisDbNumber];
