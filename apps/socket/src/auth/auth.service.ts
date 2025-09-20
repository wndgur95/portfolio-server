import { Injectable, Logger } from '@nestjs/common';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { Session } from '@libs/dao/redis/session/session.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * 세션 검증
   */
  async validateSession(userId: number, sessionId: string): Promise<Session> {
    if (!userId || !sessionId) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.SESSION_NOT_EXIST_ACCOUNT_KEY_IN_HEADER,
      );
    }

    const session = await this.sessionRepository.getSession(userId);

    if (!session) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_NOT_FOUND, [
        `userId: ${userId} `,
      ]);
    } else if (session.id !== sessionId) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_RE_LOGIN);
    } else if (session.block) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_BLOCK);
    }

    ContextProvider.setSession(session);

    return session;
  }
}