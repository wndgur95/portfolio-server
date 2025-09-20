export const PeriodRedisKey = {};
export type PeriodRedisKey =
  (typeof PeriodRedisKey)[keyof typeof PeriodRedisKey];

export const PeriodRedisExpiration = {};
export type PeriodRedisExpiration =
  (typeof PeriodRedisExpiration)[keyof typeof PeriodRedisExpiration];

export const RedisDbNumber = {
  THROTTLER: 0,
  SESSION: 1,
  SOLO_RANKING: 2,

  CHATTING: 5,

  SOLO_BATTLE_SOCKET: 10,
};
export type RedisDbNumber = (typeof RedisDbNumber)[keyof typeof RedisDbNumber];

export const SESSION_EXPIRED_TIME = Number(process.env.SESSION_TTL);

export const SOLO_RANKING_KEY = 'solo_ranking';
export const RANKING_TIMESTAMP_DECIMALS = 13;

export const BATTLE_INFO_KEY = 'battle_info';
export const BASE_SOLO_BATTLE_PLAY_KEY = 'solo_battle';
