import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { TestTablesRepository } from '@libs/dao/common/test-tables/interfaces/test-tables-repository.interface';
import { TestTablesDbRepository } from '@libs/dao/common/test-tables/repositories/test-tables-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [TestTablesDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: TestTablesRepository,
      inject: [TestTablesDbRepository],
      useFactory: (repo: TestTablesDbRepository): TestTablesRepository => repo,
    },
  ],
  exports: [TestTablesRepository],
})
export class TestTablesModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}