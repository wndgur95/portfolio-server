export const ENVIRONMENT = {
  PRODUCTION: 'prod1',
  DEV1: 'dev1',
  DEV2: 'dev2',
  QA1: 'qa1',
  QA2: 'qa2',
  STAGING: 'staging',
  GARENA_DEV: 'garena_dev',
  TEST: 'test',
};

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
