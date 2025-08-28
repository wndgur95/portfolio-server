import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { SqlInjectionsRepository } from '@libs/dao/common/sql-injections/interfaces/sql-injections-repository.interface';
import { SqlInjectionsDbRepository } from '@libs/dao/common/sql-injections/repositories/sql-injections-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [SqlInjectionsDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: SqlInjectionsRepository,
      inject: [SqlInjectionsDbRepository],
      useFactory: (repo: SqlInjectionsDbRepository): SqlInjectionsRepository => repo,
    },
  ],
  exports: [SqlInjectionsRepository],
})
export class SqlInjectionsModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}