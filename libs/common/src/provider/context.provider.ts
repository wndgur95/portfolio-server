import { ClsServiceManager } from 'nestjs-cls';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { ChainableCommander } from 'ioredis/built/utils/RedisCommander';
import { getDatabaseByGameDbId } from '@libs/dao/config/game/game-database-config.util';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Session } from '@libs/dao/redis/session/session.entity';
import { MongoLogs } from '@libs/dao/mongo/mongo-log/dto/mongo-log.dto';
import { CommonUserInfoDto } from '@libs/common/dto/common-user-info.dto';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { EnvProvider } from '@libs/common/provider/env.provider';

// test debugging 용
export const context = {};

export class ContextProvider {
  static get<T>(key: string): T {
    return EnvProvider.isTest()
      ? context[key]
      : ClsServiceManager.getClsService().get(key);
  }

  static set<T>(key: string, value: T): void {
    EnvProvider.isTest()
      ? (context[key] = value)
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
    ContextProvider.setUserInfo(session);
    ContextProvider.set('session', session);
  }

  static getSelectedUser(): CommonUserInfoDto {
    const session: Session = ContextProvider.get('selected-user');

    if (!session) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_NOT_FOUND);
    }

    return session
      ? {
          ...session,
          database: session.gameDbId
            ? getDatabaseByGameDbId(session.gameDbId)
            : null,
        }
      : null;
  }

  static setSelectedUser(session: Session): void {
    ContextProvider.set('selected-user', session);
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
    ContextProvider.setUserInfo(jwt);
    ContextProvider.set('jwt', jwt);
  }

  static getUserInfo(): CommonUserInfoDto {
    return ContextProvider.get('user-info') ?? CommonUserInfoDto.emptyDto;
  }

  static setUserInfo(userInfo: JwtPayload | Session): void {
    if (!userInfo) {
      ContextProvider.set('user-info', userInfo);
      return;
    }

    const commonUserInfo = {
      userId: userInfo.userId,
      gameDbId: userInfo.gameDbId,
      database: userInfo.database ?? getDatabaseByGameDbId(userInfo.gameDbId),
      nid: userInfo.nid,
    } as CommonUserInfoDto;

    ContextProvider.set('user-info', commonUserInfo);
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

  static getMongoLogs(): MongoLogs {
    return this.get('mongo-log');
  }

  static setMongoLogs(mongoLogs: MongoLogs): void {
    this.set('mongo-log', mongoLogs);
  }

  static releaseMongoLogs(): void {
    ContextProvider.set('mongo-log', undefined);
  }

  static getAddReason(): string {
    return this.get('mongo-log-add-reason');
  }

  static setAddReason(reason: string): void {
    this.set('mongo-log-add-reason', reason);
  }

  static getReason(): string {
    return this.get('mongo-log-reason');
  }

  static setReason(reason: string): void {
    this.set('mongo-log-reason', reason);
  }

  static getNetwork(): string {
    return this.get('network');
  }

  static setNetwork(network: string): void {
    this.set('network', network ?? NETWORK.PORTFOLIO);
  }

  static releaseNetwork(): void {
    this.set('network', undefined);
  }
}
