import { Injectable } from '@nestjs/common';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { GetContractOutDto } from './dto/get-contract-out.dto';

@Injectable()
export class ContractService {
  constructor(private readonly web3: Web3Provider) {}

  async getContract(name: string): Promise<GetContractOutDto> {
    const contract = await this.web3.repository.findByName(name);

    return GetContractOutDto.of(contract.address, JSON.parse(contract.abi));
  }
}
