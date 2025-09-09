import { Module } from '@nestjs/common';
import { SoloScoreHistoriesModule } from '@libs/dao/arena/solo-score-histories/solo-score-histories.module';
import { SoloScoresModule } from '@libs/dao/arena/solo-scores/solo-scores.module';

@Module({
  imports: [SoloScoresModule, SoloScoreHistoriesModule],
  exports: [SoloScoresModule, SoloScoreHistoriesModule],
})
export class ArenaModule {}
