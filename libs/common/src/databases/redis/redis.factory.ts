import { Redis } from 'ioredis';
import RedisConfig from '@libs/dao/config/redis/redis.config';

const customRedisClient: Record<string, Redis> = {};

export class RedisFactory {
  static getAllRedisClient(): Redis[] {
    return Object.values(customRedisClient);
  }

  static createRedisClient(dbNumber = 0): Redis {
    const { port, sshUsed } = RedisConfig();

    let host: string = RedisConfig().host;

    if (sshUsed) {
      host = '0.0.0.0';
    }
    return new Redis({
      host: host,
      port: port,
      db: dbNumber,
    });
  }
}
