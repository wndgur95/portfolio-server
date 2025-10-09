import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/date.extension';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';

const environment = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.batch.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [ContractDatabaseConfig, BatchDatabaseConfig],
    }),
  ],
})
export class BatchServerConfig {}
