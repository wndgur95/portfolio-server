import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PortfolioShapeMintLogsDbRepository } from '@libs/dao/batch/portfolio/shape-mint-logs/repositories/portfolio-shape-mint-logs-db.repository';
import { PortfolioShapeMintLogsRepository } from '@libs/dao/batch/portfolio/shape-mint-logs/interfaces/portfolio-shape-mint-logs-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioShapeMintLogsDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioShapeMintLogsRepository,
      inject: [PortfolioShapeMintLogsDbRepository],
      useFactory: (
        repo: PortfolioShapeMintLogsDbRepository,
      ): PortfolioShapeMintLogsRepository => repo,
    },
  ],
  exports: [PortfolioShapeMintLogsRepository],
})
export class PortfolioShapeMintLogsModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
