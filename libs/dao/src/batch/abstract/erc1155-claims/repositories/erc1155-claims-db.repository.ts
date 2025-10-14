import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { Erc1155ClaimsRepository } from '@libs/dao/batch/abstract/erc1155-claims/interfaces/erc1155-claims-repository.interface';
import { ClaimStatus } from '@libs/common/constants/contract.contstants';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export abstract class Erc1155ClaimsDbRepository<T>
  extends AbstractRepository<T>
  implements Erc1155ClaimsRepository<T>
{
  async findByAddress(address: string): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.address=:address`, { address })
      .getMany();
  }

  async findByAddressAndStatus(
    address: string,
    status: ClaimStatus,
  ): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.address=:address`, { address })
      .andWhere(`${this.alias}.status=:status`, { status })
      .getMany();
  }

  async findByStatus(status: ClaimStatus): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.status=:status`, { status })
      .getMany();
  }

  async updateStatus(
    treeRounds: number[],
    status: ClaimStatus,
  ): Promise<UpdateResult> {
    return await this.queryBuilder
      .update(this.alias)
      .set({
        status: status,
      })
      .where(`${this.alias}.tree_round IN (:...treeRounds)`, {
        treeRounds: treeRounds,
      })
      .execute();
  }

  async countByStatus(status: ClaimStatus): Promise<number> {
    return await this.queryBuilder
      .where(`${this.alias}.status=:status`, { status })
      .getCount();
  }

  async findByTreeRound(treeRound: number): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.treeRound=:treeRound`, { treeRound })
      .getMany();
  }

  async findByTreeRounds(treeRounds: number[]): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.treeRound IN (:...treeRounds)`, { treeRounds })
      .getMany();
  }
}
