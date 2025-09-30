import { ContextProvider } from '@libs/common/provider/context.provider';
import { Session } from '@libs/dao/redis/session/session.entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';

export class SessionProvider {
  /**
   * Session 생성 후 사용하기 위해서
   * */
  static makeSelectedSession(user: User): void {
    ContextProvider.setSelectedUser(
      Session.create({
        nid: user.nid,
        userId: user.id,
        gameDbId: user.gameDbId,
      }),
    );
  }
}
