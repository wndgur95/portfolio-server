import { NestFactory } from '@nestjs/core';
import { DeployServer } from './deploy.server';
import { DeployModule } from './deploy.module';

async function deployServer(): Promise<void> {
  const app = await NestFactory.create(DeployModule);

  const deployServer = new DeployServer(app);

  deployServer.init();
  await deployServer.run();
}

void deployServer();
