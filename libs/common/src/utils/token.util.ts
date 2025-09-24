import { EncryptUtil } from '@libs/common/utils/encrypt.util';
import { NF_TOKEN_SECRET_KEY } from '@libs/common/constants/token.constants';

export interface PfSession {
  accountId: number;
  ttl: number;
}

export class TokenUtil {
  /**
   * nf token 생성
   */
  static generateNfToken(): string {
    return EncryptUtil.encode({}, NF_TOKEN_SECRET_KEY);
  }

  /**
   * nf token 복호화
   */
  static decodeNfToken(nfToken: string): boolean {
    EncryptUtil.decode(nfToken, NF_TOKEN_SECRET_KEY);
    return true;
  }
}
