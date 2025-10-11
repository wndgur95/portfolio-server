import { PortfolioErc1155ClaimMerkleTreeEntity } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/entities/portfolio-erc1155-claim-merkle-tree.entity';
import { Erc1155ClaimMerkleTreeRepository } from '@libs/dao/batch/abstract/erc1155-claim-merkle-tree/interfaces/erc1155-claim-merkle-tree-repository.interface';

export type PortfolioErc1155ClaimMerkleTreeRepository =
  Erc1155ClaimMerkleTreeRepository<PortfolioErc1155ClaimMerkleTreeEntity>;

export const PortfolioErc1155ClaimMerkleTreeRepository = Symbol(
  'PortfolioErc1155ClaimMerkleTreeRepository',
);
