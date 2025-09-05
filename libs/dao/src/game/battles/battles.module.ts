import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { BattlesRepository } from '@libs/dao/game/battles/interfaces/battles-repository.interface';
import { BattlesDbRepository } from '@libs/dao/game/battles/repositories/battles-db.repository';
import { getGameShardDatabases } from '@libs/dao/config/game/game-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [BattlesDbRepository],
      getGameShardDatabases,
    ),
  ],
  providers: [
    {
      provide: BattlesRepository,
      inject: [BattlesDbRepository],
      useFactory: (repo: BattlesDbRepository): BattlesRepository => repo,
    },
  ],
  exports: [BattlesRepository],
})
export class BattlesModule {
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