import { NestFactory } from '@nestjs/core';
import { SystemLogger } from '@libs/common/logger/system.logger';
import { JobModule } from './job.module';
import { JobServer } from './job.server';

async function job(): Promise<void> {
  const app = await NestFactory.create(JobModule, {
    logger: new SystemLogger().logger,
  });

  const jobServer = new JobServer(app);

  jobServer.init();
  await jobServer.run();
}

void job();
