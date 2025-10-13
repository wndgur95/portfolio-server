import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { LOG_STATUS, LogStatus } from '@libs/common/constants/contract.contstants';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ClaimErc1155LogsRepository } from '@libs/dao/batch/abstract/claim-erc1155-logs/interfaces/claim-erc1155-logs-repository.interface';

export abstract class ClaimErc1155LogsDbRepository<T>
  extends AbstractRepository<T>
  implements ClaimErc1155LogsRepository<T>
{
  async findByTopicIds(topicIds: number[]): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.topic_id IN (:...topicIds)`, {
        topicIds: topicIds,
      })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      })
      .orderBy(`${this.alias}.block_number`, 'ASC')
      .getMany();
  }

  async updateStatus(ids: number[]): Promise<UpdateResult> {
    return await this.queryBuilder
      .update(this.alias)
      .set({
        status: LOG_STATUS.PROCESSED,
      } as unknown as QueryDeepPartialEntity<T>)
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
