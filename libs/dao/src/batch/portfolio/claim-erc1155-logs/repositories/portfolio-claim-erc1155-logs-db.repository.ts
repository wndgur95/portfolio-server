import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { ClaimErc1155LogsDbRepository } from '@libs/dao/batch/abstract/claim-erc1155-logs/repositories/claim-erc1155-logs-db.repository';
import { PortfolioClaimErc1155LogEntity } from '@libs/dao/batch/portfolio/claim-erc1155-logs/entities/portfolio-claim-erc1155-log.entity';
import { PortfolioClaimErc1155LogsRepository } from '@libs/dao/batch/portfolio/claim-erc1155-logs/interfaces/portfolio-claim-erc1155-logs-repository.interface';

@EntityRepository(PortfolioClaimErc1155LogEntity)
export class PortfolioClaimErc1155LogsDbRepository
  extends ClaimErc1155LogsDbRepository<PortfolioClaimErc1155LogEntity>
  implements PortfolioClaimErc1155LogsRepository {}
