import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BaseHttpService } from '@libs/common/network/base-http-service';
import { AxiosRequestHeaders } from 'axios';
import { GameCode } from '@libs/common/constants/environment.constants';

export type LogServerResponse = {
  code: number;
  data?: any | any[];
  message?: string;
};

@Injectable()
export class LogServerProvider extends BaseHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(
      httpService,
      process.env.LOG_SERVER_HOST,
      Number(process.env.LOG_SERVER_PORT),
    );
    this.headers = {
      'Content-Type': 'application/json',
      nfToken: process.env.LOG_NF_TOKEN,
    } as unknown as AxiosRequestHeaders;
  }

  /**
   * mongo log 적재
   */
  sendLog(log: string, gameCode: GameCode): void {
    this.headers['gameCd'] = gameCode;
    this.post({
      method: 'log/mongo',
      data: { gameCd: gameCode, data: log },
    });
  }
}
