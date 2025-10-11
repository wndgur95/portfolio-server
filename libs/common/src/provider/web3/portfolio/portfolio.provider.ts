import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseWeb3Provider } from '@libs/common/provider/web3/base-web3.provider';
import { PortfolioContractsDbRepository } from '@libs/dao/contract/portfolio-contracts/repositories/portfolio-contracts-db.repository';
import { PortfolioContractsRepository } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contracts-repository.interface';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { CONTRACT } from '@libs/common/constants/contract.contstants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

@Injectable()
export class PortfolioProvider extends BaseWeb3Provider {
  constructor(
    private readonly config: ConfigService,
    @Inject(PortfolioContractsRepository)
    protected readonly contractRepository: PortfolioContractsDbRepository,
  ) {
    super(contractRepository);
    const _port = process.env.PORTFOLIO_NETWORK_PORT;
    const _network = process.env.PORTFOLIO_NETWORK;
    const network = Number(_port) ? `${_network}:${_port}` : `${_network}`;
    this._web3 = new Web3(new Web3.providers.HttpProvider(network.toString()));
  }
  protected network = NETWORK.PORTFOLIO;
  protected getDeployerKey(): string {
    if (['test', 'dev', 'dev1'].includes(process.env.NODE_ENV)) {
      return this.config.get<string>('CONTRACT_DEPLOYER_PRIVATE_KEY');
    }
  }

  protected getPrivateKey(contractName: string, type?: number): string {
    switch (contractName) {
      case CONTRACT.ADMIN_AIRDROP_COIN: {
        return this.config.get<string>('AIRDROP_COIN_PRIVATE_KEY');
      }
      case CONTRACT.ERC1155_CLAIM_PROOF: {
        return this.config.get<string>('ERC115_MANAGER_PRIVATE_KEY');
      }
      default: {
        return this.config.get<string>('CONTRACT_DEPLOYER_PRIVATE_KEY');
      }
    }
  }
}
