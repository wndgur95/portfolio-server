import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  PortfolioErc1155ClaimMerkleTreeDbRepository
} from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/repositories/portfolio-erc1155-claim-merkle-tree-db.repository';
import {
  PortfolioErc1155ClaimMerkleTreeRepository
} from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/interfaces/portfolio-erc1155-claim-merkle-tree-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioErc1155ClaimMerkleTreeDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioErc1155ClaimMerkleTreeRepository,
      inject: [PortfolioErc1155ClaimMerkleTreeDbRepository],
      useFactory: (repo: PortfolioErc1155ClaimMerkleTreeDbRepository): PortfolioErc1155ClaimMerkleTreeRepository => repo,
    },
  ],
  exports: [PortfolioErc1155ClaimMerkleTreeRepository],
})
export class PortfolioErc1155ClaimMerkleTreeModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}