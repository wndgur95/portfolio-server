import { ContextProvider } from '@libs/common/provider/context.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';

export class TestContextUtils {
  static releaseContexts(): void {
    ContextProvider.setJwt(undefined);
    ContextProvider.setSession(undefined);
    ContextProvider.releaseRedisMultiPool();
    AchievementProvider.releaseAchievements();
    TypeOrmHelper.releaseQueryRunner();
  }
}
