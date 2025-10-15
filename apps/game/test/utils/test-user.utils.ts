import { Session } from '@libs/dao/redis/session/session.entity';
import { randomUUID } from 'crypto';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { TimeUtil } from '@libs/common/utils/time.util';
import { getDatabaseByGameDbId } from '@libs/dao/config/game/game-database-config.util';
import gameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { TestCharacterUtils } from './test-character.utils';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';
import { UserDetailsDbRepository } from '@libs/dao/game/user-details/repositories/user-details-db.repository';

export class TestUserUtils {
  /**
   * 샤드 된 게임 DB 아이디 조회
   */
  static getGameDbIdFromUserId(userId: number): number {
    const enableDbList = Object.keys(gameDatabaseConfig()).map((it) =>
      Number(it),
    );
    const shardId = enableDbList.length;
    const dbIndex = userId % shardId;
    return enableDbList[dbIndex];
  }

  static async login(userId: number, gameDbId: number): Promise<User> {
    const nid = `test_${userId}`;

    let user;
    try {
      user = await TestUserUtils.createUser(
        UserEntity.create({
          id: userId,
          nid: nid,
        }),
      );
    } catch (_) {
      /* empty */
    }

    TestUserUtils.createSession(userId, gameDbId, nid);

    return user;
  }

  static createSession(
    userId: number,
    gameDbId: number,
    nid?: string,
  ): Session {
    const session = Session.create({
      id: randomUUID(),
      userId: userId,
      nid: nid,
      gameDbId: gameDbId,
      database: getDatabaseByGameDbId(gameDbId),
    });

    ContextProvider.setSession(session);
    ContextProvider.setNow(TimeUtil.now());

    return session;
  }

  static async createUser(user: User): Promise<User> {
    const userRepository = UsersDbRepository.instance(DB_NAME.COMMON);
    if (!userRepository) return null;

    await userRepository.insert(user);
    return user;
  }

  static async createUserDetail(
    goodsProvider: GoodsProvider,
  ): Promise<{ userDetail: UserDetail; character: Character }> {
    // 캐릭터 생성
    const character = await TestCharacterUtils.createCharacter(goodsProvider);

    const { userId, gameDbId, database } = ContextProvider.getUserInfo();

    const userDetail = UserDetailEntity.create({
      userId: userId,
    });

    await UserDetailsDbRepository.instance(database).insert(userDetail);

    const userRepository = UsersDbRepository.instance(DB_NAME.COMMON);
    if (userRepository) {
      await userRepository.updateById(userId, { gameDbId: gameDbId });
    }

    return { userDetail, character };
  }

  static async createOtherUser(
    id: number,
    nid: string,
    gameDbId: number,
  ): Promise<User> {
    const user = await TestUserUtils.createUser(
      UserEntity.create({
        id: id,
        nid: nid,
        gameDbId: gameDbId,
      }),
    );

    const database = getDatabaseByGameDbId(gameDbId);

    await UserDetailsDbRepository.instance(database).insert(
      UserDetailEntity.create({
        userId: user.id,
      }),
    );

    return user;
  }

  static async getUserDetail(
    userId: number,
    gameDbId: number,
  ): Promise<UserDetail> {
    const userDetailRepository = UserDetailsDbRepository.instance(
      getDatabaseByGameDbId(gameDbId),
    );

    return await userDetailRepository.findByUserId(userId);
  }

  static async updateUserDetail(
    userId: number,
    gameDbId: number,
    values: Partial<UserDetail>,
  ): Promise<void> {
    const userDetailRepository = UserDetailsDbRepository.instance(
      getDatabaseByGameDbId(gameDbId),
    );
    const userDetail = await TestUserUtils.getUserDetail(userId, gameDbId);

    await userDetailRepository.updateById(userDetail.id, values);
  }
}
