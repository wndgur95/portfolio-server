import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { PortfolioContractEntity } from '@libs/dao/contract/portfolio-contracts/entities/portfolio-contract.entity';
import { PortfolioContractsRepository } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contracts-repository.interface';

@EntityRepository(PortfolioContractEntity)
export class PortfolioContractsDbRepository
  extends AbstractRepository<PortfolioContractEntity>
  implements PortfolioContractsRepository {}