import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { PortfolioContractEntity } from '@libs/dao/contract/portfolio-contracts/entities/portfolio-contract.entity';
import { PortfolioContractsRepository } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contracts-repository.interface';
import { BaseWeb3ContractRepository } from '@libs/dao/base/base-web3-contract.repository';

@EntityRepository(PortfolioContractEntity)
export class PortfolioContractsDbRepository
  extends BaseWeb3ContractRepository<PortfolioContractEntity>
  implements PortfolioContractsRepository {}