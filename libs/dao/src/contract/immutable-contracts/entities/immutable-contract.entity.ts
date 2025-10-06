import { Entity } from 'typeorm'
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { ImmutableContract } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contract.interface';
import { BaseWeb3Contract } from '@libs/dao/base/base-web3-contract.entity';

@Entity('immutable_contract')
@BaseTimeEntity()
export class ImmutableContractEntity extends BaseWeb3Contract implements ImmutableContract {
  constructor(partial?: Partial<ImmutableContract>) {
    super(partial);
    Object.assign(this, partial);
  }
}