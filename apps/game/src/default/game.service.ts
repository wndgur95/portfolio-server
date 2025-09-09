import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { StaticRepository } from '@libs/dao/static/static.repository';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class GameService {
  private readonly redis: Redis;

  constructor(private readonly staticRepository: StaticRepository) {
    // 단일 서버가 됬을때 오픈
    /*
    this.redis = RedisFactory.createRedisClient(RedisDbNumber.THROTTLER);
    this.redis
      .subscribe('data')
      .then(() => Logger.log('Subscribed to data channel'))
      .catch((err) => Logger.error(err));
    
    
    this.subscriber();
    */
  }

  health(): Record<string, string> {
    return { environment: process.env.NODE_ENV };
  }

  /**
   * 데이터 구독
   */
  subscriber(): void {
    this.redis.on('message', (channel, message) => {
      if (channel === 'data') {
        this._handleDataMessage(message);
      }
    });
  }

  /**
   * data 채널 메세지 관리
   */
  private _handleDataMessage(message: string): void {
    try {
      const names = JSON.parse(message);
      if (names === 'all') {
        this.staticRepository.reloadAll();
      } else if (Array.isArray(names)) {
        this.staticRepository.reload(names);
      }
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.REDIS_MESSAGE_HANDLE_FAIL,
      );
    }
  }
}
