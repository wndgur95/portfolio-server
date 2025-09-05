import { ClsServiceManager } from 'nestjs-cls';
import {
  ENVIRONMENT,
  NODE_ENV,
} from '@libs/common/constants/environment.constants';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { ChainableCommander } from 'ioredis/built/utils/RedisCommander';
import { getDatabaseByGameDbId } from '@libs/dao/config/game/game-database-config.util';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Session } from '@libs/dao/redis/session/session.entity';

// test debugging 용
export const context = {};

export class ContextProvider {
  static get<T>(key: string): T {
    return NODE_ENV === ENVIRONMENT.TEST
      ? ClsServiceManager.getClsService().get(key)
      : ClsServiceManager.getClsService().get(key);
  }

  static set<T>(key: string, value: T): void {
    NODE_ENV === ENVIRONMENT.TEST
      ? ClsServiceManager.getClsService().set(key, value)
      : ClsServiceManager.getClsService().set(key, value);
  }

  static getSession(check = true): Session {
    const session: Session = ContextProvider.get('session');

    if (check && !session) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_NOT_FOUND);
    }
    if (!session) {
      return null;
    }

    session.database = session.gameDbId
      ? getDatabaseByGameDbId(session.gameDbId)
      : null;

    return session;
  }

  static setSession(session: Session): void {
    ContextProvider.setGameDatabase(
      session.database ?? getDatabaseByGameDbId(session.gameDbId),
    );
    ContextProvider.setUserId(session.userId);
    ContextProvider.set('session', session);
  }

  static getNow(): Date {
    // return new Date('2025-02-17T05:25:45.134Z');
    return ContextProvider.get('now') ?? new Date();
  }

  static setNow(now: Date): void {
    ContextProvider.set('now', now);
  }

  static getJwt(): JwtPayload {
    return ContextProvider.get('jwt');
  }

  static setJwt(jwt: JwtPayload): void {
    ContextProvider.setGameDatabase(jwt.database);
    ContextProvider.setUserId(jwt.id);
    ContextProvider.set('jwt', jwt);
  }

  static getDbInfo(): { database: string; userId: number } {
    return {
      database: ContextProvider.getGameDatabase(),
      userId: ContextProvider.getUserId(),
    };
  }

  static getUserId(): number {
    return ContextProvider.get('user-id');
  }

  static setUserId(userId: number): void {
    ContextProvider.set('user-id', userId);
  }

  static getGameDatabase(): string {
    return ContextProvider.get('game-database');
  }

  static setGameDatabase(gameDatabase: string): void {
    ContextProvider.set('game-database', gameDatabase);
  }

  /**
   * game level lock
   * */
  static isUserLevelLockActive(): boolean {
    return ContextProvider.get('user-level-lock') ?? false;
  }

  static setIsUserLevelLockActive(lock: boolean): void {
    ContextProvider.set('user-level-lock', lock);
  }

  static getRedisMultiPool(): Record<string, ChainableCommander> {
    return ContextProvider.get('redis');
  }

  static getRedisMulti(dbNumber: number): ChainableCommander {
    return ContextProvider.get('redis') == undefined
      ? undefined
      : ContextProvider.get('redis')[dbNumber];
  }

  static setRedisMultiPool(
    multiPool: Record<string, ChainableCommander>,
  ): void {
    ContextProvider.set('redis', multiPool);
  }

  static setRedisMulti(dbNumber: number, multi: ChainableCommander): void {
    let multiPool = ContextProvider.get('redis');
    if (undefined == multiPool) {
      multiPool = {};
    }
    if (undefined == multiPool[dbNumber]) {
      multiPool[dbNumber] = {};
    }
    multiPool[dbNumber] = multi;
    ContextProvider.setRedisMultiPool(
      multiPool as Record<string, ChainableCommander>,
    );
  }

  static releaseRedisMultiPool(): void {
    ContextProvider.set('dsp-redis', undefined);
  }
}
