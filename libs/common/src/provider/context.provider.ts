import { ClsServiceManager } from 'nestjs-cls';
import {
  ENVIRONMENT,
  NODE_ENV,
} from '@libs/common/constants/environment.constants';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { ChainableCommander } from 'ioredis/built/utils/RedisCommander';

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
    ContextProvider.set('jwt', jwt);
  }

  static getGroupDatabase(): string {
    return ContextProvider.get('group-database');
  }

  static setGroupDatabase(groupDatabase: string): void {
    ContextProvider.set('group-database', groupDatabase);
  }

  static getUserDatabase(): string {
    return ContextProvider.get('user-database');
  }

  static setUserDatabase(userDatabase: string): void {
    ContextProvider.set('user-database', userDatabase);
  }

  static getOtherUserDatabase(): string[] {
    return ContextProvider.get('other-user-database') ?? [];
  }

  static setOtherUserDatabase(otherUserDatabase: string): void {
    const databases = [
      ...new Set([
        ContextProvider.get('other-user-database'),
        otherUserDatabase,
      ]),
    ];
    ContextProvider.set('other-user-database', databases);
  }

  /**
   * user level lock
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
