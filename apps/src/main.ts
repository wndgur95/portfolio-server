import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from '@nestjs/common';
import { AppServer } from './app.server';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const adminServer = new AppServer(app);
  adminServer.init();
  await adminServer.run();
}

void bootstrap()
  .then()
  .catch((e) => Logger.error('nestjs bootstrapping errored ' + e.message));
