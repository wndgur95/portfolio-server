import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { BugReportsRepository } from '@libs/dao/user/bug-reports/interfaces/bug-reports-repository.interface';
import { BugReportsDbRepository } from '@libs/dao/user/bug-reports/repositories/bug-reports-db.repository';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [BugReportsDbRepository],
      getUserShardDatabases,
    ),
  ],
  providers: [
    {
      provide: BugReportsRepository,
      inject: [BugReportsDbRepository],
      useFactory: (repo: BugReportsDbRepository): BugReportsRepository => repo,
    },
  ],
  exports: [BugReportsRepository],
})
export class BugReportsModule {
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