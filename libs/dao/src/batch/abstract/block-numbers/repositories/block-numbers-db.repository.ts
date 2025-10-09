import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { BlockNumbersRepository } from '@libs/dao/batch/abstract/block-numbers/interfaces/block-numbers-repository.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BlockNumbersDbRepository<T>
  extends AbstractRepository<T>
  implements BlockNumbersRepository<T>
{
  async findByTopicType(topicType: number): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.topicType=:topicType`, { topicType: topicType })
      .getOne();
  }

  async updateBlockNumber(
    id: number,
    blockNumber: number,
  ): Promise<UpdateResult> {
    return await this.queryBuilder
      .update(this.target)
      .set({
        blockNumber: blockNumber,
      } as unknown as QueryDeepPartialEntity<T>)
      .where(`${this.alias}.id = :id`, {
        id: id,
      })
      .execute();
  }
}
