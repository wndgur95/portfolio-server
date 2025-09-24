export const ENVIRONMENT = {
  PRODUCTION: 'prod',
  DEV: 'dev',
  QA: 'qa',
  STAGING: 'staging',
  TEST: 'test',
};
export type Environment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

export const NODE_ENV = process.env.NODE_ENV || ENVIRONMENT.TEST;

export const SWAGGER_REQUIRED = ![
  ENVIRONMENT.PRODUCTION,
  ENVIRONMENT.STAGING,
].includes(NODE_ENV);

export const GAME_CODE = {
  SURVIVE: 'SURVIVE',
};
export type GameCode = (typeof GAME_CODE)[keyof typeof GAME_CODE];


