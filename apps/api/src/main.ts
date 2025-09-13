import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ApiServer } from './api.server';
import { SystemLogger } from '@libs/common/logger/system.logger';

async function apiServer(): Promise<void> {
  const app = await NestFactory.create(ApiModule, {
    logger: new SystemLogger().logger,
  });

  const apiServer = new ApiServer(app);

  apiServer.init();
  await apiServer.run();
}

void apiServer();
