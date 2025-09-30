import { Injectable } from '@nestjs/common';
import { MONGO_LOG_COLLECTION } from '@libs/common/constants/mongo-log.constants';
import { GetMongoLogsInDto } from '@libs/common/dto/get-mongo-logs-in.dto';
import { GetMongoLogsOutDto } from '@libs/common/dto/get-mongo-logs-out.dto';
import { LogServerProvider } from '@libs/common/http/log-server.provider';
import { GAME_CODE } from '@libs/common/constants/environment.constants';

@Injectable()
export class MongoLogService {
  constructor(private readonly logServerProvider: LogServerProvider) {}

  getMongoLogCollection(): string[] {
    return Object.values(MONGO_LOG_COLLECTION);
  }

  async getMongoLog(
    getMongoLogsInDto: GetMongoLogsInDto,
  ): Promise<GetMongoLogsOutDto> {
    return await this.logServerProvider.getLog({
      ...getMongoLogsInDto,
      gameCode: GAME_CODE.SURVIVE,
    } as GetMongoLogsInDto);
  }
}
