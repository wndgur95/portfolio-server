import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BaseHttpService } from '@libs/common/network/base-http-service';
import { AxiosRequestHeaders } from 'axios';
import { GameCode } from '@libs/common/constants/environment.constants';
import { GetMongoLogsInDto } from '@libs/common/dto/get-mongo-logs-in.dto';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GetMongoLogsOutDto } from '@libs/common/dto/get-mongo-logs-out.dto';

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

  /**
   * mongo log 적재
   */
  async getLog(
    getMongoLogsInDto: GetMongoLogsInDto,
  ): Promise<GetMongoLogsOutDto> {
    this.headers['gameCd'] = getMongoLogsInDto.gameCode;
    const response: LogServerResponse = await this.post({
      method: 'log/mongo/search',
      data: getMongoLogsInDto,
    });

    return response.data;
  }

  private static checkCode(code: number, message?: string): void {
    if (code !== 0) {
      throw new InternalServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_SERVER_NETWORK_ERROR,
        `AUTH_SERVER_NETWORK_ERROR : code(${code}), message(${message})`,
      );
    }
  }
}
