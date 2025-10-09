import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ShapeOwnerLogsRepository } from '@libs/dao/batch/abstract/shape-owner-logs/interfaces/shape-owner-logs-repository.interface';
import { LOG_STATUS } from '@libs/common/constants/contract.contstants';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class ShapeOwnerLogsDbRepository<T>
  extends AbstractRepository<T>
  implements ShapeOwnerLogsRepository<T>
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
}
