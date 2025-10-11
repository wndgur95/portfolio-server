import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Erc1155ClaimMerkleTreeEntity } from '@libs/dao/batch/abstract/erc1155-claim-merkle-tree/entities/erc1155-claim-merkle-tree.entity';
import { PortfolioErc1155ClaimMerkleTree } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/interfaces/portfolio-erc1155-claim-merkle-tree.interface';

@Entity('portfolio_erc1155_claim_merkle_tree')
@BaseTimeEntity()
export class PortfolioErc1155ClaimMerkleTreeEntity
  extends Erc1155ClaimMerkleTreeEntity
  implements PortfolioErc1155ClaimMerkleTree {}
