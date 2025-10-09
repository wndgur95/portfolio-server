import { Injectable, Logger } from '@nestjs/common';
import {
  Account,
  TransactionConfig,
  Log,
  SignedTransaction,
  TransactionReceipt,
  PromiEvent,
} from 'web3-core';
import { ContractSendMethod } from 'web3-eth-contract';
import { Web3ContractDto } from '@libs/common/provider/web3/dto/web3-contract.dto';
import { PolygonContract } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contract.interface';
import { ImmutableContract } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contract.interface';
import { PortfolioContract } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contract.interface';
import { TOKEN_LIST } from '@libs/common/constants/contract.contstants';

@Injectable()
export abstract class BaseWeb3Provider {
  protected abstract getPrivateKey(contractName: string, type?: number): string;
  protected abstract getDeployerKey(): string;
  protected abstract network: string;

  protected _web3;
  protected _contract = {};

  protected constructor(protected readonly contractRepository) {}

  getAccount(privateKey: string): Account {
    return this._web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  getToWei(amount: number): any {
    return this._web3.utils.toWei(amount.toString(), 'ether');
  }

  async createContract(contractName: string): Promise<Web3ContractDto> {
    const contractData = await this.contractRepository.findByName(contractName);
    if (contractData) {
      if (!this._contract[contractData.address]) {
        this._contract[contractData.address] = new this._web3.eth.Contract(
          JSON.parse(contractData.abi),
          contractData.address,
        );
      }
      return Web3ContractDto.of(
        contractName,
        this._contract[contractData.address],
      );
    }
    return new Web3ContractDto();
  }

  createContractByContractData(
    contractData: PolygonContract | ImmutableContract | PortfolioContract,
  ): Web3ContractDto {
    if (!this._contract[contractData.address]) {
      this._contract[contractData.address] = new this._web3.eth.Contract(
        JSON.parse(contractData.abi),
        contractData.address,
      );
    }
    return Web3ContractDto.of(
      contractData.name,
      this._contract[contractData.address],
    );
  }

  async getTransactionConfig(
    contract: Web3ContractDto,
    account: Account,
    tx: ContractSendMethod,
    value?: number | string,
  ): Promise<TransactionConfig> {
    const data = tx.encodeABI();
    const gas = await tx.estimateGas({
      from: account.address,
      value: value ?? 0, // ← 추가!
    });
    const gasPrice = await this._web3.eth.getGasPrice();
    const nonce = await this._web3.eth.getTransactionCount(account.address);
    return {
      to: contract.web3.options.address,
      data: data,
      gas: gas,
      gasPrice: gasPrice,
      nonce: nonce,
      chainId: await this._web3.eth.getChainId(),
      value: value ?? 0,
    };
  }

  async getSignTransaction(
    transactionConfig: TransactionConfig,
    privateKey: string,
  ): Promise<SignedTransaction> {
    return await this._web3.eth.accounts.signTransaction(
      transactionConfig,
      privateKey,
    );
  }

  async sendSignedTransaction(
    signedTransactionData: string,
  ): Promise<PromiEvent<TransactionReceipt>> {
    const transactionReceipt = await this._web3.eth.sendSignedTransaction(
      signedTransactionData,
    );
    Logger.warn(
      `${this.network} end transactionHash ${transactionReceipt.transactionHash}`,
    );

    return transactionReceipt;
  }

  async signAndSendTransaction(
    contract: Web3ContractDto,
    tx: ContractSendMethod,
    amount?: number | string,
    type?: number,
  ): Promise<TransactionReceipt> {
    const privateKey = this.getPrivateKey(contract.contractName, type);
    const account: Account = this.getAccount(privateKey);
    Logger.warn(
      `${this.network} send address ${account.address}`,
    );
    const transactionConfig = await this.getTransactionConfig(
      contract,
      account,
      tx,
      amount,
    );
    const signedTx = await this.getSignTransaction(
      transactionConfig,
      account.privateKey,
    );
    return await this.sendSignedTransaction(signedTx.rawTransaction);
  }

  async subscription_dev(contractAddress: string, topic: any): Promise<Log[]> {
    return this._web3.eth.getPastLogs({
      fromBlock: 1,
      address: contractAddress,
      topics: topic,
    });
  }

  getTransaction(hash: string): Promise<any> {
    return this._web3.eth.getTransaction(hash);
  }

  getTransactionReceipt(hash: string): Promise<any> {
    return this._web3.eth.getTransactionReceipt(hash);
  }

  subscription(
    params: Partial<{
      address: string;
      fromBlockNumber: number;
      toBlockNumber: number | string;
      topics: string | string[];
    }>,
  ): Promise<Log[]> {
    const topics =
      typeof params.topics === 'object' ? [...params.topics] : [params.topics];
    const toBlockNumber = params.toBlockNumber ?? 'latest';

    return this._web3.eth.getPastLogs({
      fromBlock: params.fromBlockNumber,
      toBlock: toBlockNumber,
      address: params.address,
      topics: topics,
    });
  }

  async airdropMatic(address: string): Promise<any> {
    if (['test', 'dev', 'dev1'].includes(process.env.NODE_ENV)) {
      const account = this.getAccount(this.getDeployerKey());
      const nonce = await this._web3.eth.getTransactionCount(account.address);
      const gas = await this._web3.eth.estimateGas({
        from: account.address,
      });
      const gasPrice = await this._web3.eth.getGasPrice();
      const rawTx = {
        nonce: nonce,
        gas: gas,
        gasPrice: gasPrice,
        to: address,
        value: 5000000000000000000,
      };
      const signedTx = await this.getSignTransaction(rawTx, account.privateKey);

      return await this.sendSignedTransaction(signedTx.rawTransaction);
    }
  }

  hexToHex32(hex: string): string {
    return '0x000000000000000000000000' + hex.slice(2).toLowerCase();
  }

  async getErc721TokenList(
    findTokenList: Web3ContractDto,
    lctContract: PolygonContract | ImmutableContract | PortfolioContract,
    userAddress: string,
  ): Promise<any[]> {
    if (['test', 'dev', 'dev1'].includes(process.env.NODE_ENV)) {
      const [getLog, giveLog] = await Promise.all([
        this.subscription_dev(lctContract.address, [
          process.env.TRANSFER_TOPIC,
          null,
          this.hexToHex32(userAddress),
        ]),
        this.subscription_dev(lctContract.address, [
          process.env.TRANSFER_TOPIC,
          this.hexToHex32(userAddress),
        ]),
      ]);
      const log = [...getLog, ...giveLog];
      let tokenIds = log.map((it) => {
        return parseInt(it.topics[3], 16);
      });
      const countByTokenId = tokenIds.reduce((accu, curr) => {
        accu[curr] = (accu[curr] || 0) + 1;
        return accu;
      }, {});
      tokenIds = [];
      for (const [key, value] of Object.entries(countByTokenId)) {
        if (Number(value) % 2 != 0) {
          tokenIds.push(Number(key));
        }
      }
      return tokenIds;
    } else {
      const currentTokenId = await findTokenList.web3.methods
        .getCurrentTokenId(lctContract.address)
        .call();

      let startIdx = TOKEN_LIST.START;
      let endIdx = TOKEN_LIST.END;
      const promises = [];
      const repeatCount = Math.ceil(currentTokenId / 1000);
      for (let i = 0; i < repeatCount; i++) {
        promises.push(
          findTokenList.web3.methods
            .getErc721ListV2(lctContract.address, startIdx, endIdx)
            .call({ from: userAddress }),
        );

        startIdx += TOKEN_LIST.REPEAT;
        endIdx += TOKEN_LIST.REPEAT;
      }

      return (await Promise.all(promises)).flat(1);
    }
  }

  async getBalance(address: string): Promise<number> {
    return await this._web3.eth.getBalance(address);
  }

  async getPastEvents(
    contract: Web3ContractDto,
    eventName: string,
    fromBlock: number,
    toBlock: number | string,
  ): Promise<any> {
    return await contract.web3.getPastEvents(eventName, {
      fromBlock: fromBlock,
      toBlock: toBlock,
    });
  }
}
