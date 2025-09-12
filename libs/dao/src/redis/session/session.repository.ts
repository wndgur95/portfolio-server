import { Injectable } from '@nestjs/common';
import { Session } from '@libs/dao/redis/session/session.entity';
import { plainToInstance } from 'class-transformer';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { RedisDbNumber, SESSION_EXPIRED_TIME } from '@libs/common/constants/redis.constants';
import { ENVIRONMENT, NODE_ENV } from '@libs/common/constants/environment.constants';

@Injectable()
export class SessionRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.SESSION;

  constructor() {
    super();
    this.createRedisClient();
  }

  async getSession(userId: number): Promise<Session> {
    const result = JSON.parse(await this.redis.get(userId.toString()));
    return plainToInstance(Session, result);
  }

  async setSession(userId: number, session: Session): Promise<void> {
    const key = userId.toString();
    const multi = this.multi
    const ttl = SESSION_EXPIRED_TIME;

    ttl > 0
        ? multi.set(key, JSON.stringify(session), 'EX', ttl) //  session, ttl 동시세팅
        : multi.set(key, JSON.stringify(session));

    ContextProvider.setSession(session);
    ContextProvider.setRedisMulti(this.dbNumber, multi);
  }

  /**
   * 세션 정보 업데이트 - 세션이 존재하는 경우에만 사용, ttl 을 변경하지 않음.
   */
  async updateSession(userId: number, session: Session): Promise<string> {
    const result = this.redis.set(
      userId.toString(),
      JSON.stringify(session),
      'KEEPTTL',
    );

    ContextProvider.setSession(session);

    return result;
  }
}
