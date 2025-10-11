import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BaseHttpService } from '@libs/common/network/base-http-service';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { AxiosRequestHeaders } from 'axios';

export type BaseBatchResponse = {
  code: number;
  data?: any | any[];
  message?: string;
};

@Injectable()
export abstract class BaseBatchHttpService extends BaseHttpService {
  protected constructor(
    protected readonly httpService: HttpService,
    _host: string,
    _port: number,
    _apiKey: string,
    _network: string,
  ) {
    super(httpService, _host, Number(_port));
    this.headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': _apiKey,
      'web3-network': _network,
    } as unknown as AxiosRequestHeaders;
  }
  async airdropCoin(): Promise<void> {
    const response: BaseBatchResponse = await this.post({
      method: 'batch/airdrop/coin',
      data: {},
    });

    BaseBatchHttpService.checkCode(response.code, response?.message);
    return response.data;
  }

  async erc1155MakeMerkleTree(): Promise<void> {
    const response: BaseBatchResponse = await this.post({
      method: 'batch/erc1155/merkle-tree/make',
      data: {},
    });

    BaseBatchHttpService.checkCode(response.code, response?.message);
    return response.data;
  }

  async erc1155SetMerkleTree(): Promise<void> {
    const response: BaseBatchResponse = await this.post({
      method: 'batch/erc1155/merkle-tree/set',
      data: {},
    });

    BaseBatchHttpService.checkCode(response.code, response?.message);
    return response.data;
  }

  protected static checkCode(code: number, message?: string): void {
    if (code !== 0) {
      throw new InternalServerErrorException(
        INTERNAL_ERROR_CODE.BATCH_SERVER_NETWORK_ERROR,
        `BATCH_SERVER_NETWORK_ERROR : ${message}`,
      );
    }
  }
}
