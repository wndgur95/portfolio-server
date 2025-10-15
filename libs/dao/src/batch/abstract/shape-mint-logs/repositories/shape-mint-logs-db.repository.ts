import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ShapeMintLogsRepository } from '@libs/dao/batch/abstract/shape-mint-logs/interfaces/shape-mint-logs-repository.interface';
import { LOG_STATUS, LogStatus } from '@libs/common/constants/contract.contstants';

export abstract class ShapeMintLogsDbRepository<T>
  extends AbstractRepository<T>
  implements ShapeMintLogsRepository<T>
{
  async findById(id: number): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.id=:id`, { id: id })
      .getOne();
  }

  async findByName(name: string): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.name=:name`, { name: name })
      .loadAllRelationIds({ relations: ['contract', 'topic', 'eventBlock'] })
      .getOne();
  }

  async findLastBlockNumber(status?: number): Promise<number> {
    return this.findBlockNumberByOrder('DESC', status);
  }

  async findCurrentBlockNumberByRegisteredStatus(): Promise<number> {
    return this.findBlockNumberByOrder('ASC', LOG_STATUS.REGISTERED);
  }

  protected async findBlockNumberByOrder(
    order: 'DESC' | 'ASC' = 'DESC',
    status?: number,
  ): Promise<number> {
    let qb = this.queryBuilder.select('block_number', 'blockNumber');

    if (status !== undefined) {
      qb = qb.where(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      });
    }

    const result = await qb
      .orderBy(`${this.alias}.block_number`, order)
      .limit(1)
      .getRawOne();

    return result?.blockNumber ?? 0;
  }

  async findByBlockNumberAndTopicId(
    blockNumber: number,
    topicId: number,
  ): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.block_number=:blockNumber`, {
        blockNumber: blockNumber,
      })
      .andWhere(`${this.alias}.topic_id=:topicId`, { topicId: topicId })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      })
      .getMany();
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

  async findByTopicId(topicId: number): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.topic_id=:topicId`, {
        topicId: topicId,
      })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      })
      .orderBy(`${this.alias}.block_number`, 'ASC')
      .getMany();
  }

  async getCountByAddressAndContractId(
    address: string,
    contractIds: number[],
  ): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.address=:address`, {
        address: address,
      })
      .andWhere(`${this.alias}.status=:status`, {
        status: LOG_STATUS.REGISTERED,
      })
      .andWhere(`${this.alias}.contract_id IN (:...contractIds)`, {
        contractIds: contractIds,
      })
      .getMany();
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
        `JSON_UNQUOTE(JSON_EXTRACT(${this.alias}.data, "$[1]")) = :value`,
        {
          value:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        },
      )
      .getCount();
  }

  async insertCharacterEventLog(characterEventLog: T[]): Promise<void> {
    await this.queryBuilder
      .insert()
      .into(this.alias)
      .values(characterEventLog)
      .execute();
  }

  async countByStatus(status: LogStatus): Promise<number> {
    return await this.queryBuilder
      .where(`${this.alias}.status=:status`, { status })
      .getCount();
  }
}
