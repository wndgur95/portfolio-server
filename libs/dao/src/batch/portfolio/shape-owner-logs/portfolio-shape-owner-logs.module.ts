import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PortfolioShapeOwnerLogsRepository } from '@libs/dao/batch/portfolio/shape-owner-logs/interfaces/portfolio-shape-owner-logs-repository.interface';
import { PortfolioShapeOwnerLogsDbRepository } from '@libs/dao/batch/portfolio/shape-owner-logs/repositories/portfolio-shape-owner-logs-db.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioShapeOwnerLogsDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioShapeOwnerLogsRepository,
      inject: [PortfolioShapeOwnerLogsDbRepository],
      useFactory: (
        repo: PortfolioShapeOwnerLogsDbRepository,
      ): PortfolioShapeOwnerLogsRepository => repo,
    },
  ],
  exports: [PortfolioShapeOwnerLogsRepository],
})
export class PortfolioShapeOwnerLogsModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
