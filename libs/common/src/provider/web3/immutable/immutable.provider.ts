import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseWeb3Provider } from '@libs/common/provider/web3/base-web3.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { ImmutableContractsRepository } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contracts-repository.interface';
import { ImmutableContractsDbRepository } from '@libs/dao/contract/immutable-contracts/repositories/immutable-contracts-db.repository';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

@Injectable()
export class ImmutableProvider extends BaseWeb3Provider {
  constructor(
    private readonly config: ConfigService,
    @Inject(ImmutableContractsRepository)
    protected readonly contractRepository: ImmutableContractsDbRepository,
  ) {
    super(contractRepository);
    const _port = process.env.POLYGON_NETWORK_PORT;
    const _network = process.env.POLYGON_NETWORK;
    const network = Number(_port) ? `${_network}:${_port}` : `${_network}`;
    this._web3 = new Web3(new Web3.providers.HttpProvider(network.toString()));
  }
  protected network = NETWORK.POLYGON;
  protected getDeployerKey(): string {
    if (['test', 'dev', 'dev1'].includes(process.env.NODE_ENV)) {
      return this.config.get<string>('CONTRACT_DEPLOYER_PRIVATE_KEY');
    }
  }

  protected getPrivateKey(contractName: string, type?: number): string {
    switch (contractName) {
      default: {
        return this.config.get<string>('CONTRACT_DEPLOYER_PRIVATE_KEY');
      }
    }
  }
}
