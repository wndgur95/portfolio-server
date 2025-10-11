import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { LogStatus } from '@libs/common/constants/contract.contstants';

export interface Erc1155ClaimMerkleTreeRepository<T>
  extends AbstractRepositoryInterface<T> {
  updateStatus(ids: number[], status: number): Promise<UpdateResult>;
  findByStatus(status: LogStatus): Promise<T[]>;
  countByStatus(status: LogStatus): Promise<number>;
}

export const Erc1155ClaimMerkleTreeRepository = Symbol(
  'Erc1155ClaimMerkleTreeRepository',
);
