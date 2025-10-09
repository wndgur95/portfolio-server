import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ShapeEventLogsRepository } from '@libs/dao/batch/abstract/shape-event-logs/interfaces/shape-event-logs-repository.interface';
import { LOG_STATUS } from '@libs/common/constants/contract.contstants';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class ShapeEventLogsDbRepository<T>
  extends AbstractRepository<T>
  implements ShapeEventLogsRepository<T>
{
  async findLastByThirdTopic(thirdTopic: string): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.third_topic = :thirdTopic`, {
        thirdTopic: thirdTopic,
      })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.PROCESSED,
      })
      .orderBy(`${this.alias}.block_number`, 'DESC')
      .getOne();
  }

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

  async findByTopicIdsJoinTopic(topicIds: number[]): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.topic_id IN (:...topicIds)`, {
        topicIds: topicIds,
      })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      })
      .getMany();
  }

  async findByBlockNumber(blockNumber: number, thirdTopic: string): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.blockNumber < :blockNumber`, {
        blockNumber: blockNumber,
      })
      .andWhere(`${this.alias}.thirdTopic=:thirdTopic`, {
        thirdTopic: thirdTopic,
      })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      })
      .getOne();
  }

  async findCountByTopicAndAddress(
    topicIds: number[],
    address: string,
  ): Promise<number> {
    return await this.queryBuilder
      .where(`${this.alias}.address = :address`, {
        address: address,
      })
      .andWhere(`${this.alias}.topic_id IN (:...topicIds)`, {
        topicIds: topicIds,
      })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      })
      .andWhere(
        `JSON_UNQUOTE(JSON_EXTRACT(${this.alias}.data, "$[3]")) = :value`,
        {
          value:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        },
      )
      .getCount();
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
