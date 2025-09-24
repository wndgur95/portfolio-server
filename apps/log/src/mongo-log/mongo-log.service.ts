import { Inject, Injectable } from '@nestjs/common';
import { MongoLogRepositories, MongoLogRepository } from '@libs/common/databases/mongo/mongo-log-repository.interface';
import { CreateMongoLogInDto } from '@libs/dao/mongo/mongo-log/dto/create-mongo-log-in.dto';
import { MongoLog } from '@libs/common/databases/mongo/mongo-log.interface';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

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
