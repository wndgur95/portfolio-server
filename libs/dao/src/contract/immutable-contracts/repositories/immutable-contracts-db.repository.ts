import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ImmutableContractEntity } from '@libs/dao/contract/immutable-contracts/entities/immutable-contract.entity';
import { ImmutableContractsRepository } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contracts-repository.interface';

@EntityRepository(ImmutableContractEntity)
export class ImmutableContractsDbRepository
  extends AbstractRepository<ImmutableContractEntity>
  implements ImmutableContractsRepository {}