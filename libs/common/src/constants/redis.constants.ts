export const PeriodRedisKey = {};
export type PeriodRedisKey =
  (typeof PeriodRedisKey)[keyof typeof PeriodRedisKey];

export const PeriodRedisExpiration = {};
export type PeriodRedisExpiration =
  (typeof PeriodRedisExpiration)[keyof typeof PeriodRedisExpiration];

export const RedisDbNumber = {
  THROTTLER: 0,
  SESSION: 1,
};
export type RedisDbNumber = (typeof RedisDbNumber)[keyof typeof RedisDbNumber];
