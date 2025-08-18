import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, mergeMap, Observable } from 'rxjs';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';

@Injectable()
export class UserLevelLockInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (e) => {
        await this.release();

        throw e;
      }),

      mergeMap(async (res) => {
        await this.release();

        return res;
      }),
    );
  }

  async release(): Promise<void> {
    const database = ContextProvider.getUserDatabase();

    if (!database) {
      return await this.releaseQueryRunner();
    }

    const queryRunners = TypeOrmHelper.getQueryRunners();

    if (queryRunners) {
      try {
        if (ContextProvider.isUserLevelLockActive()) {
          await queryRunners[database]?.query(`SELECT RELEASE_ALL_LOCKS();`);
        }
      } finally {
        await this.releaseQueryRunner();
      }
    }
  }

  async releaseQueryRunner(): Promise<void> {
    await TypeOrmHelper.releases();

    TypeOrmHelper.releaseQueryRunner();
  }
}
