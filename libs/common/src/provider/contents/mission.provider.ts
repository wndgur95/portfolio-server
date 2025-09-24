import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { MissionsRepository } from '@libs/dao/game/missions/interfaces/missions-repository.interface';
import { MissionsDbRepositories } from '@libs/dao/game/missions/repositories/missions-db.repository';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

@Injectable()
export class MissionProvider {
  constructor(
    @Inject(MissionsRepository)
    private readonly missionRepositories: MissionsDbRepositories,
    private readonly dataMissionProvider: DataMissionProvider,
  ) {}

  /**
   * 다중 미션 조회
   */
  async getMission(): Promise<Mission[]> {
    const { userId, database } = ContextProvider.getUserInfo();

    return await this.missionRepositories[database].findByUserId(userId);
  }

  /**
   * 타입들로 다중 미션 포인트 조회
   */
  async getMissionsByDataMissionIds(
    dataMissionIds: number[],
  ): Promise<Mission[]> {
    const { userId, database } = ContextProvider.getUserInfo();

    const currentAndPrevMissions =
      this.dataMissionProvider.getCurrentAndPrevStepDataMission(dataMissionIds);

    return await this.missionRepositories[
      database
    ].findByUserIdAndDataMissionIdIn(
      userId,
      currentAndPrevMissions.map((it) => it.ID),
    );
  }

  /**
   * 다중 미션 포인트 리워드 수령시간 변경
   */
  async updateMissionsRewardAt(
    missionIds: number[],
    rewardAt: Date,
  ): Promise<UpdateResult> {
    const { database } = ContextProvider.getUserInfo();

    return await this.missionRepositories[database].updateByIdIn(missionIds, {
      rewardAt: rewardAt,
    });
  }

  /**
   * 미션 업데이트 및 생성
   */
  async saveMission(updateMissions: Mission[]): Promise<void> {
    const { database } = ContextProvider.getUserInfo();

    await this.missionRepositories[database].save(updateMissions, {
      reload: false,
    });
  }
}
