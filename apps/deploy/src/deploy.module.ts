import { Module } from '@nestjs/common';
import { DeployServerConfig } from './config/deploy.server.config';

@Module({
  imports: [DeployServerConfig],
  controllers: [],
  providers: [],
})
export class DeployModule {}
