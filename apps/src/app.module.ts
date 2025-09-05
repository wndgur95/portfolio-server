import { Module } from '@nestjs/common';
import { ApiModule } from '../api/src/api.module';
import { GameModule } from '../game/src/game.module';
import { AppServerConfig } from './config/app.server.config';

@Module({
  imports: [AppServerConfig, ApiModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
