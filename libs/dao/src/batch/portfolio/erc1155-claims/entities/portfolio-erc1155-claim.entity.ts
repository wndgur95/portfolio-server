import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Erc1155ClaimEntity } from '@libs/dao/batch/abstract/erc1155-claims/entities/erc1155-claim.entity';
import { PortfolioErc1155Claim } from '@libs/dao/batch/portfolio/erc1155-claims/interfaces/portfolio-erc1155-claim.interface';

@Entity('portfolio_erc_1155_claim')
@BaseTimeEntity()
export class PortfolioErc1155ClaimEntity
  extends Erc1155ClaimEntity
  implements PortfolioErc1155Claim {}
