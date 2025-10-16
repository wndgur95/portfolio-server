import { MISSION_CONDITION_TYPE } from '@libs/dao/static/common.constants';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

export class TestMissionUtils {
  /**
   * 미션 클리어
   */
  static async createMission(
    achievementProvider: AchievementProvider,
    count = 1,
    missionType = MISSION_CONDITION_TYPE.BATTLE,
  ): Promise<Mission[]> {
    AchievementProvider.achieve(missionType, [], count);

    return await achievementProvider.updateAchievements();
  }

  /**
   * 미션 클리어
   */
  static async createMissionAll(
    achievementProvider: AchievementProvider,
    count = 1,
  ): Promise<Mission[]> {
    const missionTypes = Object.values(MISSION_CONDITION_TYPE).filter(Boolean);
    for (const missionType of missionTypes) {
      AchievementProvider.achieve(missionType, [], count);
    }

    return await achievementProvider.updateAchievements();
  }
}
