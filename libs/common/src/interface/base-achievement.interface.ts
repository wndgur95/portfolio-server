import { Achievement } from '@libs/common/interface/achievement.interface';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

export type AchievementDelegateFunctionReturn = Mission[];

export interface BaseAchievement {
  achieve(
    achievements: Achievement[],
  ): Promise<AchievementDelegateFunctionReturn>;
}
