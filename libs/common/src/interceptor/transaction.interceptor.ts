import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, mergeMap, Observable } from 'rxjs';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { RedisHelper } from '@libs/common/databases/redis/redis.helper';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // exception
      catchError(async (e) => {
        await TypeOrmHelper.rollbackTransactions();
        await RedisHelper.rollbackMulti();

        throw e;
      }),

      // execute
      mergeMap(async (res) => {
        await TypeOrmHelper.commitTransactions();
        await RedisHelper.commitMulti();

        return res;
      }),
    );
  }
}
