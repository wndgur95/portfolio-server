import { NestFactory } from '@nestjs/core';
import { BatchServer } from './batch.server';
import { BatchModule } from './batch.module';

async function batchServer(): Promise<void> {
  const app = await NestFactory.create(BatchModule);

  const batchServer = new BatchServer(app);

  batchServer.init();
  await batchServer.run();
}

void batchServer();
