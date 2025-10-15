import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { LogStatus } from '@libs/common/constants/contract.contstants';

export interface ShapeOwnerLogsRepository<T>
  extends AbstractRepositoryInterface<T> {
  findByTopicIds(topicIds: number[]): Promise<T[]>;
  updateStatus(ids: number[]): Promise<UpdateResult>;
  countByStatus(status: LogStatus): Promise<number>;
}

export const ShapeOwnerLogsRepository = Symbol('ShapeOwnerLogsRepository');
