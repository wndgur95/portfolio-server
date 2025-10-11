import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { Erc1155ClaimMerkleTreeDbRepository } from '@libs/dao/batch/abstract/erc1155-claim-merkle-tree/repositories/erc1155-claim-merkle-tree-db.repository';
import { PortfolioErc1155ClaimMerkleTreeEntity } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/entities/portfolio-erc1155-claim-merkle-tree.entity';
import { PortfolioErc1155ClaimMerkleTreeRepository } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/interfaces/portfolio-erc1155-claim-merkle-tree-repository.interface';

@EntityRepository(PortfolioErc1155ClaimMerkleTreeEntity)
export class PortfolioErc1155ClaimMerkleTreeDbRepository
  extends Erc1155ClaimMerkleTreeDbRepository<PortfolioErc1155ClaimMerkleTreeEntity>
  implements PortfolioErc1155ClaimMerkleTreeRepository {}
