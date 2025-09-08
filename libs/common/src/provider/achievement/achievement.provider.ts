import { Injectable } from '@nestjs/common';
import { MissionAchievementProvider } from '@libs/common/provider/achievement/mission-achievement.provider';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { AchievementDelegateFunctionReturn, BaseAchievement } from '@libs/common/interface/base-achievement.interface';
import { MissionConditionType } from '@libs/dao/static/common.constants';
import { Achievement } from '@libs/common/interface/achievement.interface';

@Injectable()
export class AchievementProvider {
  private readonly achievementDelegate: BaseAchievement[] = [];

  constructor(
    private readonly missionAchievementProvider: MissionAchievementProvider,
  ) {
    this.achievementDelegate.push(this.missionAchievementProvider);
  }

  /**
   * 업적 등록
   */
  static achieve(
    missionConditionType: MissionConditionType,
    conditions: number[],
    count = 1,
  ): void {
    const achievement = {
      missionConditionType: missionConditionType,
      conditions: conditions,
      count: count,
    };

    const achievements = AchievementProvider.getAchievements();

    achievements.push(achievement);

    ContextProvider.set('achievements', achievements);
  }

  /**
   * 업적 처리
   * - 1. interceptor 에서 후 처리
   * - 2. 클라이언트에서 보내 준 컨디션 처리
   */
  async updateAchievements(): Promise<AchievementDelegateFunctionReturn> {
    // 업적 조회
    const achievements: Achievement[] = AchievementProvider.getAchievements();

    if (achievements.isEmpty()) {
      return;
    }

    // 같은 업적 count 병합
    const achievementsMap = new Map<string, Achievement>();

    for (const achievement of achievements) {
      const { missionConditionType, conditions, count } = achievement;

      const key = `${missionConditionType}_${JSON.stringify(conditions)}`;

      const existAchievement = achievementsMap.get(key);

      existAchievement
        ? (existAchievement.count += count)
        : achievementsMap.set(key, achievement);
    }

    // 업적 달성
    const allAchievementResult = [];
    for (const achievementDelegate of this.achievementDelegate) {
      const achievementResult = await achievementDelegate.achieve([
        ...achievementsMap.values(),
      ]);

      if (achievementResult) {
        allAchievementResult.push(...achievementResult);
      }
    }

    AchievementProvider.releaseAchievements();

    return allAchievementResult;
  }

  /**
   * 업적 리스트 조회
   */
  static getAchievements(): Achievement[] {
    return ContextProvider.get('achievements') ?? [];
  }

  /**
   * 업적 리스트 릴리즈
   */
  static releaseAchievements(): void {
    ContextProvider.set('achievements', undefined);
  }
}
