import { Injectable, Logger } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { MongoLogs } from '@libs/dao/mongo/mongo-log/dto/mongo-log.dto';

@Injectable()
export class MongoLogProvider {
  static setMongoLog(
    collectionName: string,
    contents: any,
  ): void {
    try {
      const mongoLogs = ContextProvider.getMongoLogs() ?? ({ logs: {} } as MongoLogs);

      if (!mongoLogs.logs[collectionName]) mongoLogs.logs[collectionName] = [];

      if (Array.isArray(contents)) {
        mongoLogs.logs[collectionName] = [
          ...mongoLogs.logs[collectionName],
          ...contents,
        ];
      } else {
        mongoLogs.logs[collectionName].push(contents);
      }

      ContextProvider.setMongoLogs(mongoLogs);
    } catch (e) {
      Logger.error(collectionName, e);
    }
  }
}
