import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { IdeaDoItsRepository } from '@libs/dao/user/idea-do-its/interfaces/idea-do-its-repository.interface';
import { IdeaDoItsDbRepository } from '@libs/dao/user/idea-do-its/repositories/idea-do-its-db.repository';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [IdeaDoItsDbRepository],
      getUserShardDatabases,
    ),
  ],
  providers: [
    {
      provide: IdeaDoItsRepository,
      inject: [IdeaDoItsDbRepository],
      useFactory: (repo: IdeaDoItsDbRepository): IdeaDoItsRepository => repo,
    },
  ],
  exports: [IdeaDoItsRepository],
})
export class IdeaDoItsModule {
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