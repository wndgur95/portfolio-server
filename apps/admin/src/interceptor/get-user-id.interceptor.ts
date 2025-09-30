import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { SessionProvider } from '@libs/common/provider/session/session.provider';

@Injectable()
export class GetUserIdInterceptor implements NestInterceptor {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = Number(request.headers['selected-user-id']);

    if (userId) {
      const user = await this.usersRepository.findById(userId);
      SessionProvider.makeSelectedSession(user);
    }

    return next.handle().pipe(
      catchError(async (e) => {
        throw e;
      }),
      tap(() => {
        ContextProvider.setSelectedUser(null);
      }),
    );
  }
}
