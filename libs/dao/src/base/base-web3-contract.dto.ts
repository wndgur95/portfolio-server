import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BaseWeb3Contract } from '@libs/dao/base/base-web3-contract.entity';
import {
  CONTRACT_TYPE,
  ContractType,
} from '@libs/common/constants/contract.contstants';

export class BaseWeb3ContractDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty({
    enum: CONTRACT_TYPE,
    example: CONTRACT_TYPE.CONTRACT,
  })
  type: ContractType;

  @ApiProperty()
  abi: any;

  jsonParseApi(): this {
    this.abi = JSON.parse(this.abi);
    return this;
  }

  constructor(partial: Partial<BaseWeb3ContractDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(contract: BaseWeb3Contract): BaseWeb3ContractDto {
    return plainToInstance(
      BaseWeb3ContractDto,
      instanceToPlain(contract),
    ).jsonParseApi();
  }
}
