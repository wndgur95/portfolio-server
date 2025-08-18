import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ApiServer } from './api.server';

async function apiServer(): Promise<void> {
  const app = await NestFactory.create(ApiModule);

  const apiServer = new ApiServer(app);

  apiServer.init();
  await apiServer.run();
}

void apiServer();
