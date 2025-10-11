import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Erc1155ClaimMerkleTreeRepository } from '@libs/dao/batch/abstract/erc1155-claim-merkle-tree/interfaces/erc1155-claim-merkle-tree-repository.interface';
import { LogStatus } from '@libs/common/constants/contract.contstants';

export abstract class Erc1155ClaimMerkleTreeDbRepository<T>
  extends AbstractRepository<T>
  implements Erc1155ClaimMerkleTreeRepository<T>
{
  async updateStatus(ids: number[], status: number): Promise<UpdateResult> {
    return await this.queryBuilder
      .update(this.alias)
      .set({
        status: status,
      })
      .where(`${this.alias}.id IN (:...ids)`, {
        ids: ids,
      })
      .execute();
  }

  async findByStatus(status: LogStatus): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.status=:status`, { status })
      .getMany();
  }

  async countByStatus(status: LogStatus): Promise<number> {
    return await this.queryBuilder
      .where(`${this.alias}.status=:status`, { status })
      .getCount();
  }
}
