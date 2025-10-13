import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { ClaimStatus } from '@libs/common/constants/contract.contstants';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export interface Erc1155ClaimsRepository<T>
  extends AbstractRepositoryInterface<T> {
  findByAddress(address: string): Promise<T[]>;
  findByAddressAndStatus(address: string, status: ClaimStatus): Promise<T[]>;
  findByStatus(status: ClaimStatus): Promise<T[]>;
  updateStatus(ids: number[], status: number): Promise<UpdateResult>;
  countByStatus(status: ClaimStatus): Promise<number>;
  findByTreeRound(treeRound: number): Promise<T[]>;
  findByTreeRounds(treeRounds: number[]): Promise<T[]>;
}

export const Erc1155ClaimsRepository = Symbol('Erc1155ClaimsRepository');
