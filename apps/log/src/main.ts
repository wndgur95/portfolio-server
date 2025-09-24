import { NestFactory } from '@nestjs/core';
import { LogServer } from './log.server';
import { LogModule } from './log.module';

async function logServer(): Promise<void> {
  const app = await NestFactory.create(LogModule);

  const logServer = new LogServer(app);

  logServer.init();
  await logServer.run();
}

void logServer();
