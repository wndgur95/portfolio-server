import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';

export interface ShapeMintLogsRepository<T>
  extends AbstractRepositoryInterface<T> {
  findById(id: number): Promise<T>;
  findByName(name: string): Promise<T>;
  findLastBlockNumber(status?: number): Promise<number>;
  findCurrentBlockNumberByRegisteredStatus(): Promise<number>;
  findByBlockNumberAndTopicId(
    blockNumber: number,
    topicId: number,
  ): Promise<T[]>;
  findByTopicIds(topicIds: number[]): Promise<T[]>;
  findByTopicId(topicId: number): Promise<T[]>;
  getCountByAddressAndContractId(
    address: string,
    contractIds: number[],
  ): Promise<T[]>;
  findCountByTopicAndAddress(
    topicIds: number[],
    address: string,
  ): Promise<number>;
  insertCharacterEventLog(characterEventLog: T[]): Promise<void>;
}

export const ShapeMintLogsRepository = Symbol('ShapeMintLogsRepository');
