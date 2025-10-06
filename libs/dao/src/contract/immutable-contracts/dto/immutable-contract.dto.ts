import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { BaseWeb3ContractDto } from '@libs/dao/base/base-web3-contract.dto';
import { ImmutableContract } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contract.interface';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@EntitySerializeImpl()
export class ImmutableContractDto extends BaseWeb3ContractDto {
  constructor(partial: Partial<ImmutableContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromEntity(contract: ImmutableContract): ImmutableContractDto {
    return plainToInstance(
      ImmutableContractDto,
      instanceToPlain(contract),
    ).jsonParseApi();
  }
}
