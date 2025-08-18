import { DataSourceOptions } from 'typeorm';
import UserDatabaseConfig from '@libs/dao/config/user/user-database.config';

const userConfigs = UserDatabaseConfig();

export function getUserServerTypeOrmOptions(): DataSourceOptions[] {
  return Object.values(userConfigs);
}

/**
 * db 아이디(100, 101, 102..) 로 db 명 조회
 */
export function getDatabaseByUserDbId(gameDbId: number): string {
  return userConfigs[gameDbId].name satisfies string;
}

/**
 * 샤드된 모든 게임 db명
 */
export const getUserShardDatabases: string[] = Object.values(userConfigs).map(
  (it: DataSourceOptions) => it.name,
);
