import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export interface ShapeOwnerLogsRepository<T>
  extends AbstractRepositoryInterface<T> {
  findByTopicIds(topicIds: number[]): Promise<T[]>;
  updateStatus(ids: number[]): Promise<UpdateResult>;
}

export const ShapeOwnerLogsRepository = Symbol('ShapeOwnerLogsRepository');
