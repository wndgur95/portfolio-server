import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { PolygonContractEntity } from '@libs/dao/contract/polygon-contracts/entities/polygon-contract.entity';
import { PolygonContractsRepository } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contracts-repository.interface';

@EntityRepository(PolygonContractEntity)
export class PolygonContractsDbRepository
  extends AbstractRepository<PolygonContractEntity>
  implements PolygonContractsRepository {}