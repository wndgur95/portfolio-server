import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Contract } from 'web3-eth-contract';

export class Web3ContractDto {
  @ApiProperty()
  @IsString()
  contractName: string;

  @ApiProperty()
  web3: Contract;

  constructor(partial?: Partial<Web3ContractDto>) {
    Object.assign(this, partial);
  }

  static of(contractName: string, web3: Contract): Web3ContractDto {
    return new Web3ContractDto({
      contractName: contractName,
      web3: web3,
    });
  }
}
