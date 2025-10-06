import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class NetworkInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const network = request.headers['web3-network'] ?? NETWORK.PORTFOLIO;
    ContextProvider.setNetwork(network);

    return next.handle().pipe(
      catchError(async (e) => {
        throw e;
      }),
      tap(() => {
        ContextProvider.releaseNetwork();
      }),
    );
  }
}
