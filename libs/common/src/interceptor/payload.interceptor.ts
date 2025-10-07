import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';

@Injectable()
export class PayloadInterceptor implements NestInterceptor {
  constructor(private readonly achievementProvider: AchievementProvider) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // execute
      mergeMap(async (res) => {
        if (typeof res !== 'object' || res?.code === undefined) {
          return res;
        }

        const updateAchievements =
          await this.achievementProvider.updateAchievements();

        res.payLoad = {
          ...(res.payLoad ?? {}),
          achievements: updateAchievements ? updateAchievements : [],
        };

        return res;
      }),
    );
  }
}
