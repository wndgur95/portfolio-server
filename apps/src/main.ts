import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from '@nestjs/common';
import { AppServer } from './app.server';
import { SystemLogger } from '@libs/common/logger/system.logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new SystemLogger().logger,
  });

  const appServer = new AppServer(app);
  appServer.init();
  await appServer.run();
}

void bootstrap()
  .then()
  .catch((e) => Logger.error('nestjs bootstrapping errored ' + e.message));
