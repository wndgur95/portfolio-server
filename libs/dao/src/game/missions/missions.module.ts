import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { MissionsRepository } from '@libs/dao/game/missions/interfaces/missions-repository.interface';
import { MissionsDbRepository } from '@libs/dao/game/missions/repositories/missions-db.repository';
import { getGameShardDatabases } from '@libs/dao/config/game/game-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [MissionsDbRepository],
      getGameShardDatabases,
    ),
  ],
  providers: [
    {
      provide: MissionsRepository,
      inject: [MissionsDbRepository],
      useFactory: (repo: MissionsDbRepository): MissionsRepository => repo,
    },
  ],
  exports: [MissionsRepository],
})
export class MissionsModule {
  constructor(
    @InjectDataSource(...getGameShardDatabases)
    private readonly dataSources: DataSource[],
  ) {}

  async onModuleDestroy(): Promise<void> {
    for (const dataSource of this.dataSources) {
      await dataSource.destroy();
    }
  }
}