import { NestFactory } from '@nestjs/core';

import { Logger } from '@nestjs/common';
import { SocketServer } from './socket.server';
import { SocketModule } from './socket.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SocketModule);
  const socketServer = new SocketServer(app);
  socketServer.init();
  await socketServer.run();
}

void bootstrap()
  .then()
  .catch((e) => Logger.error('nestjs bootstrapping errored ' + e.message));
