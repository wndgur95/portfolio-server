import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { Erc1155ClaimsDbRepository } from '@libs/dao/batch/abstract/erc1155-claims/repositories/erc1155-claims-db.repository';
import { PortfolioErc1155ClaimEntity } from '@libs/dao/batch/portfolio/erc1155-claims/entities/portfolio-erc1155-claim.entity';
import { PortfolioErc1155ClaimsRepository } from '@libs/dao/batch/portfolio/erc1155-claims/interfaces/portfolio-erc1155-claims-repository.interface';

@EntityRepository(PortfolioErc1155ClaimEntity)
export class PortfolioErc1155ClaimsDbRepository
  extends Erc1155ClaimsDbRepository<PortfolioErc1155ClaimEntity>
  implements PortfolioErc1155ClaimsRepository {}
