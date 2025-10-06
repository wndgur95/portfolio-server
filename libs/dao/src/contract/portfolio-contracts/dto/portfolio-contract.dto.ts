import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { BaseWeb3ContractDto } from '@libs/dao/base/base-web3-contract.dto';
import { PortfolioContract } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contract.interface';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@EntitySerializeImpl()
export class PortfolioContractDto extends BaseWeb3ContractDto {
  constructor(partial: Partial<PortfolioContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromEntity(contract: PortfolioContract): PortfolioContractDto {
    return plainToInstance(
      PortfolioContractDto,
      instanceToPlain(contract),
    ).jsonParseApi();
  }
}
