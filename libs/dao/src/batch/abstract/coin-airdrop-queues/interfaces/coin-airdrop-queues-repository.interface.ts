import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { LogStatus } from '@libs/common/constants/contract.contstants';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export interface CoinAirdropQueuesRepository<T>
  extends AbstractRepositoryInterface<T> {
  findByAddress(address: string): Promise<T>;
  findByStatus(status: LogStatus): Promise<T[]>;
  updateStatus(ids: number[]): Promise<UpdateResult>;
  countByStatus(status: LogStatus): Promise<number>;
}

export const CoinAirdropQueuesRepository = Symbol(
  'CoinAirdropQueuesRepository',
);
