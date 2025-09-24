import { Injectable } from '@nestjs/common';
import { TokenUtil } from '@libs/common/utils/token.util';

@Injectable()
export class LogService {
  health(): Record<string, string> {
    console.log(TokenUtil.generateNfToken());
    return { environment: process.env.NODE_ENV };
  }
}
