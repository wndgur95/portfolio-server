import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { ClaimErc1155LogEntity } from '@libs/dao/batch/abstract/claim-erc1155-logs/entities/claim-erc1155-log.entity';
import { PortfolioClaimErc1155Log } from '@libs/dao/batch/portfolio/claim-erc1155-logs/interfaces/portfolio-claim-erc1155-log.interface';

@Entity('portfolio_claim_erc1155_log')
@BaseTimeEntity()
export class PortfolioClaimErc1155LogEntity
  extends ClaimErc1155LogEntity
  implements PortfolioClaimErc1155Log {}
