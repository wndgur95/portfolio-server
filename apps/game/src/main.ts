import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';
import { GameServer } from './game.server';
import { SystemLogger } from '@libs/common/logger/system.logger';

async function gameServer(): Promise<void> {
  const app = await NestFactory.create(GameModule, {
    logger: new SystemLogger().logger,
  });

  const gameServer = new GameServer(app);

  gameServer.init();
  await gameServer.run();
}

void gameServer();
