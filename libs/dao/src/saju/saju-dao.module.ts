import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SajuDatabaseConfig from '@libs/dao/config/saju/saju-database.config';
import { SajuResultDbRepository } from '@libs/dao/saju/repositories/saju-result-db.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [SajuResultDbRepository],
      [SajuDatabaseConfig().name],
    ),
  ],
  providers: [SajuResultDbRepository],
  exports: [SajuResultDbRepository],
})
export class SajuDaoModule {
  constructor(
    @InjectDataSource(SajuDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
