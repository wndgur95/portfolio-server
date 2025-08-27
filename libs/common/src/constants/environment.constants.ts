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

export const LOCATE = {
  CACHE: 'cache',
  CREATE_USER: 'create_user',
  USER: 'user',
  HOME: 'home',
  DATA_DEPLOY: 'data_deploy',
  RELATIONSHIP: 'relationship',
  DIFF: 'diff',
  DATA_HISTORY: 'data_history',
  DATA_RANGE: 'data_range',
  GOODS_LIMIT: 'goods_limit',
};
export type Locate = (typeof LOCATE)[keyof typeof LOCATE];
