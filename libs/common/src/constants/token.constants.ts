export const AUTH_TOKEN_TTL = 30 * 60 * 1000;
export const AUTH_TOKEN_SECRET_KEY =
  process.env.NODE_ENV + 'ljh portfolio secret key';

export interface AuthToken {
  ttl: number;
}

export const NF_TOKEN_SECRET_KEY =
  process.env.NODE_ENV + 'log nf token secret key';