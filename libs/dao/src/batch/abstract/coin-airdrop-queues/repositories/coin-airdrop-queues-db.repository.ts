import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { CoinAirdropQueuesRepository } from '@libs/dao/batch/abstract/coin-airdrop-queues/interfaces/coin-airdrop-queues-repository.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import {
  LOG_STATUS,
  LogStatus,
} from '@libs/common/constants/contract.contstants';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class CoinAirdropQueuesDbRepository<T>
  extends AbstractRepository<T>
  implements CoinAirdropQueuesRepository<T>
{
  async findByAddress(address: string): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.address=:address`, { address })
      .getOne();
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
