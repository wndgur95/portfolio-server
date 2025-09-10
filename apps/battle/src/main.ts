import { NestFactory } from '@nestjs/core';

import { Logger } from '@nestjs/common';
import { BattleServer } from './battle.server';
import { BattleModule } from './battle.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(BattleModule);
  const battleServer = new BattleServer(app);
  battleServer.init();
  await battleServer.run();
}

void bootstrap()
  .then()
  .catch((e) => Logger.error('nestjs bootstrapping errored ' + e.message));
