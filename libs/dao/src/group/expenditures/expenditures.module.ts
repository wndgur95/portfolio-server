import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { ExpendituresRepository } from '@libs/dao/group/expenditures/interfaces/expenditures-repository.interface';
import { ExpendituresDbRepository } from '@libs/dao/group/expenditures/repositories/expenditures-db.repository';
import { getGroupShardDatabases } from '@libs/dao/config/group/group-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [ExpendituresDbRepository],
      getGroupShardDatabases,
    ),
  ],
  providers: [
    {
      provide: ExpendituresRepository,
      inject: [ExpendituresDbRepository],
      useFactory: (repo: ExpendituresDbRepository): ExpendituresRepository => repo,
    },
  ],
  exports: [ExpendituresRepository],
})
export class ExpendituresModule {
  constructor(
    @InjectDataSource(...getGroupShardDatabases)
    private readonly dataSources: DataSource[],
  ) {}

  async onModuleDestroy(): Promise<void> {
    for (const dataSource of this.dataSources) {
      await dataSource.destroy();
    }
  }
}