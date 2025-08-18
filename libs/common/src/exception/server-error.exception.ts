import { InternalServerErrorException } from '@nestjs/common';
import { InternalErrorCode } from '@libs/common/constants/internal-error-code.constants';
import { INTERNAL_ERROR_CODE_DESC } from '@libs/common/constants/internal-error-code-desc.constants';

export class ServerErrorException extends InternalServerErrorException {
  constructor(errorCode: InternalErrorCode, params = []) {
    super(errorCode);
    this.message = ServerErrorException.errorCodeToString(errorCode, params);
  }

  static errorCodeToString(
    errorCode: InternalErrorCode,
    params: any[],
  ): string {
    let error = INTERNAL_ERROR_CODE_DESC?.[errorCode] ?? 'ERROR_CODE_UNKNOWN';

    if (!params.length) return error;

    for (const param of params) {
      error = error.replace('%P', param);
    }

    return error;
  }
}
