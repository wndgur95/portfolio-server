import { Inject, Injectable } from '@nestjs/common';
import { BaseAchievement } from '@libs/common/interface/base-achievement.interface';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { MISSION_TYPE, MissionType } from '@libs/dao/static/common.constants';
import { DataMissionRepository } from '@libs/dao/static/data-mission/data-mission.repository';
import { Achievement } from '@libs/common/interface/achievement.interface';
import { DataMission } from '@libs/dao/static/data-mission/data-mission.entity';
import { BaseAchievementProvider } from '@libs/common/provider/achievement/base-achievement.provider';
import { MissionsDbRepositories } from '@libs/dao/game/missions/repositories/missions-db.repository';
import { MissionsRepository } from '@libs/dao/game/missions/interfaces/missions-repository.interface';
import { MissionEntity } from '@libs/dao/game/missions/entities/mission.entity';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

interface DataMissionInfo extends DataMission {
  prevCount?: number;
}

@Injectable()
export class MissionAchievementProvider
  extends BaseAchievementProvider
  implements BaseAchievement
{
  readonly missionTypes: MissionType[] = [
    MISSION_TYPE.DAILY,
    MISSION_TYPE.REPETITION,
    MISSION_TYPE.ONCE,
  ];

  constructor(
    @Inject(MissionsRepository)
    private readonly missionRepositories: MissionsDbRepositories,
    private readonly dataMissionRepository: DataMissionRepository,
  ) {
    super();
  }

  /**
   * 업적 달성
   */
  async achieve(achievements: Achievement[]): Promise<Mission[]> {
    const { userId, database } = ContextProvider.getUserInfo();
    const missionRepository = this.missionRepositories[database];
    const missions = await missionRepository.findByUserId(userId);

    const updateMissions = [];
    for (const achievement of achievements) {
      const { missionConditionType, conditions, count } = achievement;
      // 조건에 맞는 진행 중인 미션 정보 조회

      const dataMissions: DataMissionInfo[] = this.dataMissionRepository.query(
        {
          MISSION_TYPE: this.missionTypes,
          MISSION_CONDITION_TYPE: [missionConditionType],
          CONDITION_VALUE: conditions.generateSubsets(),
        },
        this.getMissionFilter,
      );

      if (dataMissions.isEmpty()) {
        continue;
      }

      // 진행 중인 미션 정보 조회: get or create
      for (const dataMission of dataMissions) {
        const mission =
          updateMissions.find((it) => dataMission.ID === it.dataMissionId) ||
          missions.find((it) => dataMission.ID === it.dataMissionId) ||
          MissionEntity.create({
            userId: userId,
            dataMissionId: dataMission.ID,
            count: dataMission?.prevCount ?? 0, // 이전 카운트부터 시작하도록
          });

        if (!mission?.id || mission.count < dataMission.CONDITION_COUNT) {
          updateMissions.push(mission);
        }

        // 이미 목표 달성
        if (mission.count + count >= dataMission.CONDITION_COUNT) {
          const nextMission = this.getNextMissionData<DataMissionInfo>(
            this.dataMissionRepository,
            dataMission,
            mission.count,
          );

          if (nextMission) {
            dataMissions.push(nextMission);
          }
        }

        mission.count = Math.min(
          mission.count + count,
          dataMission.CONDITION_COUNT,
        );
      }
    }

    if (updateMissions.isEmpty()) {
      return;
    }

    await missionRepository.save(updateMissions, { reload: false });

    return updateMissions;
  }
}
