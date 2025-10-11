import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { PortfolioErc1155ClaimMerkleTreeDbRepository } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/repositories/portfolio-erc1155-claim-merkle-tree-db.repository';
import { PortfolioErc1155ClaimMerkleTreeRepository } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/interfaces/portfolio-erc1155-claim-merkle-tree-repository.interface';
import { PortfolioErc1155ClaimMerkleTreeEntity } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/entities/portfolio-erc1155-claim-merkle-tree.entity';

@Injectable()
export class Erc1155ClaimMerkleTreeProvider extends BaseBatchTableProvider<
  PortfolioErc1155ClaimMerkleTreeDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioErc1155ClaimMerkleTreeRepository)
    protected readonly portfolioErc1155ClaimMerkleTreeRepository: PortfolioErc1155ClaimMerkleTreeDbRepository,
  ) {
    super(portfolioErc1155ClaimMerkleTreeRepository);
  }

  createEntity(dto): PortfolioErc1155ClaimMerkleTreeEntity {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.PORTFOLIO: {
        return new PortfolioErc1155ClaimMerkleTreeEntity(dto);
      }
    }
  }
}
