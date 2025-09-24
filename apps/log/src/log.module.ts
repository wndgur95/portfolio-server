import { Module, ValidationPipe } from '@nestjs/common';
import { LogServerConfig } from './config/log.server.config';
import { AuthService } from './auth/auth.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { MongoLogController } from './mongo-log/mongo-log.controller';
import { MongoLogService } from './mongo-log/mongo-log.service';
import { NfTokenStrategy } from './auth/strategy/nf-token.strategy';
import { PassportModule } from '@nestjs/passport';
import { MongoLogDocumentModule } from '@libs/dao/mongo/mongo-log/mongo-log.module';
import { ClsModule } from 'nestjs-cls';
import { MongooseModule } from '@nestjs/mongoose';
import mongoLogDocumentConfig from '@libs/dao/config/mongo/mongo-log-document.config';
import { LogController } from './default/log.controller';
import { LogService } from './default/log.service';

@Module({
  imports: [
    LogServerConfig,
    PassportModule,
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),

    MongooseModule.forRootAsync({
      connectionName: mongoLogDocumentConfig().surviveName,
      inject: [mongoLogDocumentConfig.KEY],
      useFactory: async (config) => ({
        uri: config.uri,
        user: config.user,
        pass: config.pass,
        dbName: config.dspDatabase,
      }),
    }),

    MongoLogDocumentModule,
  ],
  controllers: [LogController, MongoLogController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    LogService,
    AuthService,
    NfTokenStrategy,
    MongoLogService,
  ],
})
export class LogModule {}
