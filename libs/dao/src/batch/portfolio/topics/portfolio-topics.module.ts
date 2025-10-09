import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PortfolioTopicsDbRepository } from '@libs/dao/batch/portfolio/topics/repositories/portfolio-topics-db.repository';
import { PortfolioTopicsRepository } from '@libs/dao/batch/portfolio/topics/interfaces/portfolio-topics-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioTopicsDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioTopicsRepository,
      inject: [PortfolioTopicsDbRepository],
      useFactory: (
        repo: PortfolioTopicsDbRepository,
      ): PortfolioTopicsRepository => repo,
    },
  ],
  exports: [PortfolioTopicsRepository],
})
export class PortfolioTopicsModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
