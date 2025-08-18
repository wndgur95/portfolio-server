import { Module } from '@nestjs/common';
import { GameServerConfig } from './config/game.server.config';

@Module({
  imports: [GameServerConfig],
  controllers: [],
  providers: [],
})
export class GameModule {}
