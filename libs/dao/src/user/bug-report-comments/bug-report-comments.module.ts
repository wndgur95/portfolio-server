import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { BugReportCommentsRepository } from '@libs/dao/user/bug-report-comments/interfaces/bug-report-comments-repository.interface';
import { BugReportCommentsDbRepository } from '@libs/dao/user/bug-report-comments/repositories/bug-report-comments-db.repository';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [BugReportCommentsDbRepository],
      getUserShardDatabases,
    ),
  ],
  providers: [
    {
      provide: BugReportCommentsRepository,
      inject: [BugReportCommentsDbRepository],
      useFactory: (repo: BugReportCommentsDbRepository): BugReportCommentsRepository => repo,
    },
  ],
  exports: [BugReportCommentsRepository],
})
export class BugReportCommentsModule {
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