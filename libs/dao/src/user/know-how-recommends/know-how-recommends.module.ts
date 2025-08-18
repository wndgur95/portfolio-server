import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { KnowHowRecommendsRepository } from '@libs/dao/user/know-how-recommends/interfaces/know-how-recommends-repository.interface';
import { KnowHowRecommendsDbRepository } from '@libs/dao/user/know-how-recommends/repositories/know-how-recommends-db.repository';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [KnowHowRecommendsDbRepository],
      getUserShardDatabases,
    ),
  ],
  providers: [
    {
      provide: KnowHowRecommendsRepository,
      inject: [KnowHowRecommendsDbRepository],
      useFactory: (repo: KnowHowRecommendsDbRepository): KnowHowRecommendsRepository => repo,
    },
  ],
  exports: [KnowHowRecommendsRepository],
})
export class KnowHowRecommendsModule {
  constructor(
    @InjectDataSource(...getUserShardDatabases)
    private readonly dataSources: DataSource[],
  ) {}

  async onModuleDestroy(): Promise<void> {
    for (const dataSource of this.dataSources) {
      await dataSource.destroy();
    }
  }
}