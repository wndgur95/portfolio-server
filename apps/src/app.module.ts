import { Module } from '@nestjs/common';
import { ApiModule } from '../api/src/api.module';
import { GameModule } from '../game/src/game.module';

@Module({
  imports: [ApiModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
