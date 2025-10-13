import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PortfolioClaimErc1155LogsDbRepository } from '@libs/dao/batch/portfolio/claim-erc1155-logs/repositories/portfolio-claim-erc1155-logs-db.repository';
import { PortfolioClaimErc1155LogsRepository } from '@libs/dao/batch/portfolio/claim-erc1155-logs/interfaces/portfolio-claim-erc1155-logs-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioClaimErc1155LogsDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioClaimErc1155LogsRepository,
      inject: [PortfolioClaimErc1155LogsDbRepository],
      useFactory: (
        repo: PortfolioClaimErc1155LogsDbRepository,
      ): PortfolioClaimErc1155LogsRepository => repo,
    },
  ],
  exports: [PortfolioClaimErc1155LogsRepository],
})
export class PortfolioClaimErc1155LogsModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
