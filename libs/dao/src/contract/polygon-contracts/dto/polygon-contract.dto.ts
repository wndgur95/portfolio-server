import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { BaseWeb3ContractDto } from '@libs/dao/base/base-web3-contract.dto';
import { PolygonContract } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contract.interface';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@EntitySerializeImpl()
export class PolygonContractDto extends BaseWeb3ContractDto {
  constructor(partial: Partial<PolygonContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromEntity(contract: PolygonContract): PolygonContractDto {
    return plainToInstance(
      PolygonContractDto,
      instanceToPlain(contract),
    ).jsonParseApi();
  }
}
