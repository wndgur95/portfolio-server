import {
  ENVIRONMENT,
  NODE_ENV,
} from '@libs/common/constants/environment.constants';

export class EnvProvider {
  /**
   * 아래 메서드들은 test 등을 위해 전역 변수를 대신하여 사용됩니다.
   */
  static isProd(): boolean {
    return (
      NODE_ENV === ENVIRONMENT.PRODUCTION || Boolean(process.env.IS_TEST_PROD)
    );
  }

  static isDev(): boolean {
    return !EnvProvider.isProd() && !EnvProvider.isTest();
  }

  static isTest(): boolean {
    return [ENVIRONMENT.TEST,  ENVIRONMENT.JEST].includes(NODE_ENV);
  }

  static isJest(): boolean {
    return NODE_ENV === ENVIRONMENT.JEST;
  }
}
