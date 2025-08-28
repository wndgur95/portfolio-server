import { ContextProvider } from '@libs/common/provider/context.provider';

export class RedisHelper {
  static async commitMulti(): Promise<void> {
    const redisMultiPool = ContextProvider.getRedisMultiPool();
    if (redisMultiPool) {
      const multiPool = Object.values(redisMultiPool);

      await Promise.all(multiPool.map((it) => it.exec()));
    }

    ContextProvider.releaseRedisMultiPool();
  }

  static async rollbackMulti(): Promise<void> {
    const redisMultiPool = ContextProvider.getRedisMultiPool();

    if (!redisMultiPool) {
      return;
    }

    const multiPool = Object.values(redisMultiPool);

    await Promise.all(multiPool.map((it) => it.discard()));

    ContextProvider.releaseRedisMultiPool();
  }
}
