import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, mergeMap, Observable } from 'rxjs';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { RedisHelper } from '@libs/common/databases/redis/redis.helper';

@Injectable()
export class RedisInterceptor implements NestInterceptor {
  private env = process.env.NODE_ENV || 'test';

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      // exception
      catchError(async (e) => {
        const redisMultiPool = ContextProvider.getRedisMultiPool();
        if (redisMultiPool) {
          const multiPool = Object.values(redisMultiPool);
          await RedisHelper.rollbackMulti(multiPool);
        }
        ContextProvider.releaseRedisMultiPool();
        if ('prod' == this.env) {
          throw new InternalServerErrorException(
            e?.response?.message ?? e.errno,
            e?.response?.error ?? e.code,
          );
        } else {
          throw e;
        }
      }),

      // execute
      mergeMap(async (res) => {
        const redisMultiPool = ContextProvider.getRedisMultiPool();

        if (redisMultiPool) {
          const multiPool = Object.values(redisMultiPool);
          await RedisHelper.commitMulti(multiPool);
        }

        ContextProvider.releaseRedisMultiPool();

        return res;
      }),
    );
  }
}
