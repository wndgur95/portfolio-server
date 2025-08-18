import { Module } from '@nestjs/common';
import { AdminServerConfig } from './config/admin.server.config';

@Module({
  imports: [AdminServerConfig],
  controllers: [],
  providers: [],
})
export class AdminModule {}
