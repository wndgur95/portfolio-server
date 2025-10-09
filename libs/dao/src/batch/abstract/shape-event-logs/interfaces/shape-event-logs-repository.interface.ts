import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export interface ShapeEventLogsRepository<T>
  extends AbstractRepositoryInterface<T> {
  findLastByThirdTopic(thirdTopic: string): Promise<T>;
  findByTopicIds(topicIds: number[]): Promise<T[]>;
  findByTopicIdsJoinTopic(topicIds: number[]): Promise<T[]>;
  findByBlockNumber(blockNumber: number, thirdTopic: string): Promise<T>;
  findCountByTopicAndAddress(
    topicIds: number[],
    address: string,
  ): Promise<number>;
  updateStatus(ids: number[]): Promise<UpdateResult>;
}

export const ShapeEventLogsRepository = Symbol('ShapeEventLogsRepository');
