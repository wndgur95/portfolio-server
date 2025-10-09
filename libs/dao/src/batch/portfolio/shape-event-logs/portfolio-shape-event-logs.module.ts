import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  PortfolioShapeEventLogsDbRepository
} from '@libs/dao/batch/portfolio/shape-event-logs/repositories/portfolio-shape-event-logs-db.repository';
import {
  PortfolioShapeEventLogsRepository
} from '@libs/dao/batch/portfolio/shape-event-logs/interfaces/portfolio-shape-event-logs-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioShapeEventLogsDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioShapeEventLogsRepository,
      inject: [PortfolioShapeEventLogsDbRepository],
      useFactory: (repo: PortfolioShapeEventLogsDbRepository): PortfolioShapeEventLogsRepository => repo,
    },
  ],
  exports: [PortfolioShapeEventLogsRepository],
})
export class PortfolioShapeEventLogsModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}