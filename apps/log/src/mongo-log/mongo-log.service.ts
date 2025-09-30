import { Inject, Injectable } from '@nestjs/common';
import { CreateMongoLogInDto } from '@libs/dao/mongo/mongo-log/dto/create-mongo-log-in.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import {
  MongoLogRepositories,
  MongoLogRepository,
} from '@libs/dao/mongo/mongo-log/interfaces/mongo-log-repository.interface';
import { MongoLog } from '@libs/dao/mongo/mongo-log/interfaces/mongo-log.interface';
import { GetMongoLogsInDto } from '@libs/common/dto/get-mongo-logs-in.dto';
import { GetMongoLogsOutDto } from '@libs/common/dto/get-mongo-logs-out.dto';

@Injectable()
export class MongoLogService {
  constructor(
    @Inject(MongoLogRepositories)
    private readonly mongoLogRepositories: Record<string, MongoLogRepository>,
  ) {}

  /**
   * common 로그 적재
   */
  async setMongoLog(
    createMongoLogInDto: CreateMongoLogInDto,
  ): Promise<MongoLog[]> {
    const { data, gameCd } = createMongoLogInDto;

    const parseData = this._parseJson(data);

    this._validateData(parseData);

    if (!this.mongoLogRepositories[gameCd]) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.MONGO_LOG_UNSUPPORTED_GAME_CODE,
      );
    }

    return await this.mongoLogRepositories[gameCd].set(parseData);
  }

  async getMongoLog(
    getMongoLogsInDto: GetMongoLogsInDto,
  ): Promise<GetMongoLogsOutDto> {
    const { gameCode, collectionName, nid, page, take } =
      getMongoLogsInDto;

    let { startAt, endAt } = getMongoLogsInDto;

    startAt = new Date(startAt)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    endAt = new Date(endAt).toISOString().replace('T', ' ').replace('Z', '');

    let logs: any[];
    if (nid) {
      logs = await this.mongoLogRepositories[gameCode].findByNidAndTimeRange(
        collectionName,
        nid,
        startAt,
        endAt,
      );
    } else {
      logs = await this.mongoLogRepositories[gameCode].findByTimeRange(
        collectionName,
        startAt,
        endAt,
      );
    }

    const totalCount = logs.length;
    let resultLog = logs;
    // take 1이면 전체리스트 받아가게함.( csv download )
    if (1 !== take) {
      const startIndex = (page - 1) * take;
      const endIndex = startIndex + take;
      resultLog = logs.slice(startIndex, endIndex);
    }

    return GetMongoLogsOutDto.of({ logs: resultLog, totalCount: totalCount });
  }

  /**
   * 로그 데이터 JSON parse with try catch
   */
  private _parseJson(text: string): any {
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.MONGO_LOG_DATA_PARSE_ERROR,
      );
    }
  }

  /**
   * 로그 데이터 검증
   */
  private _validateData(data: Record<string, any[]>): void {
    if (Object.keys(data).length === 0) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.MONGO_LOG_DATA_EMPTY);
    }

    for (const collectionName of Object.keys(data)) {
      if (data[collectionName].length === 0) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.MONGO_LOG_DATA_EMPTY,
        );
      }
    }
  }
}
