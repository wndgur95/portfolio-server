import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { JobServerConfig } from './config/job.server.config';
import { JobController } from './default/job.controller';
import { JobService } from './default/job.service';
import { HttpModule } from '@nestjs/axios';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PortfolioImportLogService } from './portfolio/import-log/portfolio-import-log.service';
import { ProcessProvider } from './process/process.provider';
import { PortfolioBatchHttpProvider } from './http/portfolio-batch-http.provider';
import { ProcessController } from './process/process.controller';
import { PortfolioAirdropService } from './portfolio/airdrop/portfolio-airdrop.service';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { BatchCommonModule } from '@libs/dao/batch/common/batch-common.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    // config module
    JobServerConfig,
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ...[BatchDatabaseConfig].map((it) => {
      return TypeOrmExModule.forRootAsync({
        name: it().name,
        inject: [it.KEY],
        useFactory: async (config: DataSourceOptions) => config,
      });
    }),

    // schedule module
    ScheduleModule.forRoot(),

    HttpModule,
    AuthModule,
    BatchCommonModule,
  ],
  controllers: [JobController, ProcessController],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    JobService,
    AuthService,
    ProcessProvider,
    PortfolioBatchHttpProvider,

    PortfolioImportLogService,
    PortfolioAirdropService,
  ],
})
export class JobModule {}
