import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';

@Injectable()
export class PayloadInterceptor implements NestInterceptor {
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
