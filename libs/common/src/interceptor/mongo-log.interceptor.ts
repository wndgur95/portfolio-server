import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { LogServerProvider } from '@libs/common/http/log-server.provider';
import * as process from 'node:process';

@Injectable()
export class MongoLogInterceptor implements NestInterceptor {
  private gameCode = process.env.GAME_CODE;
  constructor(private readonly logServerProvider: LogServerProvider) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap(() => {
        const mongoLog = ContextProvider.getMongoLogs();
        if (mongoLog) {
          ContextProvider.releaseMongoLogs();
          this.logServerProvider.sendLog(
            JSON.stringify(mongoLog.logs),
            this.gameCode,
          );
        }
      }),
    );
  }
}
