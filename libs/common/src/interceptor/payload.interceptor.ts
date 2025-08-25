import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';
import { RequestCountsRedisRepository } from '@libs/dao/redis/request-counts/request-counts-redis.repository';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class PayloadInterceptor implements NestInterceptor {
  constructor(
    private readonly requestCountsRedisRepository: RequestCountsRedisRepository,
  ) {}
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // execute
      mergeMap(async (res) => {
        if (typeof res !== 'object') {
          return res;
        }

        res.payLoad = {
          ...(res.payLoad ?? {}),
        };

        return res;
      }),
    );
  }
}
