import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { TestingModule } from '@nestjs/testing';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { getGameShardDatabases } from '@libs/dao/config/game/game-database-config.util';

export class TestDataSourceUtils {
  static async clearDataSource(module: TestingModule): Promise<void> {
    const dataSourcesMap = new Map<string, DataSource>();

    for (const database of Object.values(DB_NAME)) {
      if (dataSourcesMap.has(database)) {
        continue;
      }

      try {
        const datasource = module.get<DataSource>(getDataSourceToken(database));

        dataSourcesMap.set(database, datasource);
      } catch (_) {
        /* empty */
      }
    }

    for (const database of getGameShardDatabases) {
      try {
        dataSourcesMap.set(
          database,
          module.get<DataSource>(getDataSourceToken(database)),
        );
      } catch (_) {
        /* empty */
      }
    }

    // release
    if (dataSourcesMap.size) {
      await Promise.all(
        [...dataSourcesMap.values()].map((dataSource) => dataSource.destroy()),
      );
    }
  }
}
