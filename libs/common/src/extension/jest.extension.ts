import { INTERNAL_ERROR_CODE_DESC } from '@libs/common/constants/internal-error-code-desc.constants';

declare global {
  namespace jest {
    interface Matchers<R> {
      toThrowErrorCode(expectedErrorCode: number): Promise<R>;
    }
  }
}

expect.extend({
  async toThrowErrorCode(received: Promise<any>, expectedErrorCode: number) {
    try {
      await received;
      return {
        message: (): string =>
          `Expected function to throw error code ${INTERNAL_ERROR_CODE_DESC[expectedErrorCode]}, but it didn't throw`,
        pass: false,
      };
    } catch (error) {
      const pass = error.errorCode === expectedErrorCode;
      return {
        message: (): string =>
          `Expected error code ${expectedErrorCode} - ${INTERNAL_ERROR_CODE_DESC[expectedErrorCode]}, got ${error.errorCode} - ${INTERNAL_ERROR_CODE_DESC[error.errorCode]}`,
        pass,
      };
    }
  },
});


