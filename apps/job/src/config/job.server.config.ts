import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/date.extension';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';

const environment = NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.job.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [BatchDatabaseConfig],
    }),
  ],
})
export class JobServerConfig {}
