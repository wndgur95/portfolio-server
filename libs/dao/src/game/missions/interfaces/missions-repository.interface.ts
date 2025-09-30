import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { MissionEntity } from '@libs/dao/game/missions/entities/mission.entity';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

export interface MissionsRepository
  extends AbstractRepositoryInterface<MissionEntity> {
  findByUserId(userId: number): Promise<Mission[]>;

  findByUserIdAndDataMissionIdIn(
    userId: number,
    dataMissionIds: number[],
  ): Promise<Mission[]>;

  updateCountAndRewardAtByIdIn(missionIds: number[]): Promise<void>;

  findAllWithFilterAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    filter?: any,
  ): Promise<[Mission[], number]>;
}

export const MissionsRepository = Symbol('MissionsRepository');
