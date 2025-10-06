import { Entity } from 'typeorm'
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { PolygonContract } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contract.interface';
import { BaseWeb3Contract } from '@libs/dao/base/base-web3-contract.entity';

@Entity('polygon_contract')
@BaseTimeEntity()
export class PolygonContractEntity extends BaseWeb3Contract implements PolygonContract {
  constructor(partial?: Partial<PolygonContract>) {
    super(partial);
    Object.assign(this, partial);
  }
}