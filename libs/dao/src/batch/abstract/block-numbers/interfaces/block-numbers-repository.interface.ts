import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export interface BlockNumbersRepository<T>
  extends AbstractRepositoryInterface<T> {

  findByTopicType(topicType: number): Promise<T>;
  updateBlockNumber(id: number, blockNumber: number): Promise<UpdateResult>;
}

export const BlockNumbersRepository = Symbol('BlockNumbersRepository');
