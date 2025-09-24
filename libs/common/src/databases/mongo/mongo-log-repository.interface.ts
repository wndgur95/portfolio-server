import { MongoLog } from './mongo-log.interface';

export const MongoLogRepository = Symbol('MongoLogRepository');

export const MongoLogRepositories = Symbol('MongoLogRepositories');

export interface MongoLogRepository {
  connectionName: string;

  get(id: string, collectionName: string): Promise<any>;
  set(data: Record<string, any[]>): Promise<MongoLog[]>;
  del(id: string, collectionName: string): Promise<void>;
  close(): Promise<void>;
}
