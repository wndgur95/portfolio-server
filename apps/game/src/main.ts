import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';
import { GameServer } from './game.server';

async function gameServer(): Promise<void> {
  const app = await NestFactory.create(GameModule);

  const gameServer = new GameServer(app);

  gameServer.init();
  await gameServer.run();
}

void gameServer();
