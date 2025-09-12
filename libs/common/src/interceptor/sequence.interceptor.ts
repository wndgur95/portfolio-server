import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class SequenceInterceptor implements NestInterceptor {
  constructor(private readonly sessionRepository: SessionRepository) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const session = ContextProvider.getSession(false);

    if (!session) {
      return next.handle();
    }

    return next.handle().pipe(
      mergeMap(async (res) => {
        await this._updateSessionSequence();

        return res;
      }),
    );
  }

  /**
   * 세션 시퀀스 업데이트
   */
  private async _updateSessionSequence(): Promise<void> {
    const session = ContextProvider.getSession();

    session.sequence += 1;
    await this.sessionRepository.setSession(session.userId, session);
  }
}
