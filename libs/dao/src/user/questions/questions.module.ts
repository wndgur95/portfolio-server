import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { QuestionsRepository } from '@libs/dao/user/questions/interfaces/questions-repository.interface';
import { QuestionsDbRepository } from '@libs/dao/user/questions/repositories/questions-db.repository';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [QuestionsDbRepository],
      getUserShardDatabases,
    ),
  ],
  providers: [
    {
      provide: QuestionsRepository,
      inject: [QuestionsDbRepository],
      useFactory: (repo: QuestionsDbRepository): QuestionsRepository => repo,
    },
  ],
  exports: [QuestionsRepository],
})
export class QuestionsModule {
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