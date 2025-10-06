import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { PortfolioContractsRepository } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contracts-repository.interface';
import { PortfolioContractsDbRepository } from '@libs/dao/contract/portfolio-contracts/repositories/portfolio-contracts-db.repository';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioContractsDbRepository],
      [ContractDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioContractsRepository,
      inject: [PortfolioContractsDbRepository],
      useFactory: (repo: PortfolioContractsDbRepository): PortfolioContractsRepository => repo,
    },
  ],
  exports: [PortfolioContractsRepository],
})
export class PortfolioContractsModule {
  constructor(
    @InjectDataSource(ContractDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}