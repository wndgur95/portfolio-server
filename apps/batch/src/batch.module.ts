import { Module } from '@nestjs/common';
import { BatchServerConfig } from './config/batch.server.config';

@Module({
  imports: [BatchServerConfig],
  controllers: [],
  providers: [],
})
export class BatchModule {}
