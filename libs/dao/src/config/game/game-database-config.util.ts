import { DataSourceOptions } from 'typeorm';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';

const gameConfigs = GameDatabaseConfig();

export function getGameServerTypeOrmOptions(): DataSourceOptions[] {
  return Object.values(gameConfigs);
}

/**
 * db 아이디(100, 101, 102..) 로 db 명 조회
 */
export function getDatabaseByGameDbId(gameDbId: number): string {
  return gameConfigs[gameDbId].name satisfies string;
}

/**
 * 샤드된 모든 게임 db명
 */
export const getGameShardDatabases: string[] = Object.values(gameConfigs).map(
  (it: DataSourceOptions) => it.name,
);
