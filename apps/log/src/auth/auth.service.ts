import { Injectable } from '@nestjs/common';
import { TokenUtil } from '@libs/common/utils/token.util';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';

@Injectable()
export class AuthService {
  /**
   * nfToken validate
   */
  validateNfToken(nfToken: string): boolean {
    try {
      return TokenUtil.decodeNfToken(nfToken);
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.API_SECURITY_NF_TOKEN_INVALIDATE,
      );
    }
  }
}
