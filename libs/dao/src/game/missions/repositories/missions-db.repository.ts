import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { MissionEntity } from '@libs/dao/game/missions/entities/mission.entity';
import { MissionsRepository } from '@libs/dao/game/missions/interfaces/missions-repository.interface';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';
import { FilterValue } from '@libs/common/dto/pagination-in.dto';

export type MissionsDbRepositories = Record<string, MissionsRepository>;

@EntityRepository(MissionEntity)
export class MissionsDbRepository
  extends AbstractRepository<MissionEntity>
  implements MissionsRepository
{
  async findByUserId(userId: number): Promise<Mission[]> {
    return await this.queryBuilder
      .where(`${this.alias}.userId = :userId`, { userId: userId })
      .getMany();
  }

  async findByUserIdAndDataMissionIdIn(
    userId: number,
    dataMissionIds: number[],
  ): Promise<Mission[]> {
    return await this.queryBuilder
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .andWhere(`${this.alias}.dataMissionId IN (:...dataMissionIds)`, {
        dataMissionIds: dataMissionIds,
      })
      .getMany();
  }

  async updateCountAndRewardAtByIdIn(missionIds: number[]): Promise<void> {
    await this.queryBuilder
      .update(this.alias)
      .set({ count: 0, rewardAt: null })
      .where(`${this.alias}.id IN (:...missionIds)`, {
        missionIds: missionIds,
      })
      .execute();
  }

  async findAllWithFilterAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    filter?: Record<string, FilterValue>,
  ): Promise<[Mission[], number]> {
    const qb = this.queryBuilder;

    return await this.applyDynamicFilters(qb, filter)
      .take(take)
      .skip(skip)
      .orderBy(`${qb.alias}.id`, orderBy)
      .getManyAndCount();
  }
}
