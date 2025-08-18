import { DataSourceOptions } from 'typeorm';
import GroupDatabaseConfig from '@libs/dao/config/group/group-database.config';

const groupConfigs = GroupDatabaseConfig();

export function getGroupServerTypeOrmOptions(): DataSourceOptions[] {
  return Object.values(groupConfigs);
}

/**
 * db 아이디(100, 101, 102..) 로 db 명 조회
 */
export function getDatabaseByGroupDbId(gameDbId: number): string {
  return groupConfigs[gameDbId].name satisfies string;
}

/**
 * 샤드된 모든 게임 db명
 */
export const getGroupShardDatabases: string[] = Object.values(groupConfigs).map(
  (it: DataSourceOptions) => it.name,
);
