import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { PolygonContractEntity } from '@libs/dao/contract/polygon-contracts/entities/polygon-contract.entity';
import { PolygonContractsRepository } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contracts-repository.interface';
import { BaseWeb3ContractRepository } from '@libs/dao/base/base-web3-contract.repository';

@EntityRepository(PolygonContractEntity)
export class PolygonContractsDbRepository
  extends BaseWeb3ContractRepository<PolygonContractEntity>
  implements PolygonContractsRepository {}