import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PortfolioErc1155ClaimsDbRepository } from '@libs/dao/batch/portfolio/erc1155-claims/repositories/portfolio-erc1155-claims-db.repository';
import { PortfolioErc1155ClaimsRepository } from '@libs/dao/batch/portfolio/erc1155-claims/interfaces/portfolio-erc1155-claims-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioErc1155ClaimsDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioErc1155ClaimsRepository,
      inject: [PortfolioErc1155ClaimsDbRepository],
      useFactory: (
        repo: PortfolioErc1155ClaimsDbRepository,
      ): PortfolioErc1155ClaimsRepository => repo,
    },
  ],
  exports: [PortfolioErc1155ClaimsRepository],
})
export class PortfolioErc1155ClaimsModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
