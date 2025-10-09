import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PortfolioBlockNumbersRepository } from '@libs/dao/batch/portfolio/block-numbers/interfaces/portfolio-block-numbers-repository.interface';
import { PortfolioBlockNumbersDbRepository } from '@libs/dao/batch/portfolio/block-numbers/repositories/portfolio-block-numbers-db.repository';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioBlockNumbersDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioBlockNumbersRepository,
      inject: [PortfolioBlockNumbersDbRepository],
      useFactory: (
        repo: PortfolioBlockNumbersDbRepository,
      ): PortfolioBlockNumbersRepository => repo,
    },
  ],
  exports: [PortfolioBlockNumbersRepository],
})
export class PortfolioBlockNumbersModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
