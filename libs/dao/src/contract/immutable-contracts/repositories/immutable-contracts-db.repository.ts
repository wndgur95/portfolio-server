import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { ImmutableContractEntity } from '@libs/dao/contract/immutable-contracts/entities/immutable-contract.entity';
import { ImmutableContractsRepository } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contracts-repository.interface';
import { BaseWeb3ContractRepository } from '@libs/dao/base/base-web3-contract.repository';

@EntityRepository(ImmutableContractEntity)
export class ImmutableContractsDbRepository
  extends BaseWeb3ContractRepository<ImmutableContractEntity>
  implements ImmutableContractsRepository {}