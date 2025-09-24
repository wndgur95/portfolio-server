import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
import { MongoLogRepository } from '@libs/common/databases/mongo/mongo-log-repository.interface';
import mongoLogDocumentConfig from '@libs/dao/config/mongo/mongo-log-document.config';
import { MongoLog } from '@libs/common/databases/mongo/mongo-log.interface';

export class SurviveMongoLogDocumentRepository implements MongoLogRepository {
  readonly connectionName: string;

  constructor(
    @InjectConnection(mongoLogDocumentConfig().surviveName)
    private readonly connection: Connection,
  ) {
    this.connectionName = mongoLogDocumentConfig().surviveName;
  }

  async get(id: string, collectionName: string): Promise<any> {
    const collection = this.connection.collection(collectionName);

    const log = await collection.findOne({ _id: new ObjectId(id) });

    return {
      collectionName: collectionName,
      objectId: log._id.toString(),
      data: log,
    } as MongoLog;
  }

  async set(data: Record<string, any[]>): Promise<MongoLog[]> {
    const result: MongoLog[] = [];
    for (const collectionName of Object.keys(data)) {
      const collection = this.connection.collection(collectionName);

      const logs = data[collectionName];

      const { insertedIds } = await collection.insertMany(logs);

      const mongoLogs = Object.values(insertedIds).map(
        (it, index) =>
          ({
            collectionName: collectionName,
            objectId: it.toString(),
            data: logs[index],
          }) as MongoLog,
      );

      result.push(...mongoLogs);
    }

    return result;
  }

  async del(id: string, collectionName: string): Promise<void> {
    const collection = this.connection.collection(collectionName);

    await collection.deleteOne({ _id: new ObjectId(id) });
  }

  async close(): Promise<void> {
    await this.connection.close();
  }
}
