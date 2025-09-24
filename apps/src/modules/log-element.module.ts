import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongoLogDocumentModule } from '@libs/dao/mongo/mongo-log/mongo-log.module';
import { ClsModule } from 'nestjs-cls';
import { MongooseModule } from '@nestjs/mongoose';
import mongoLogDocumentConfig from '@libs/dao/config/mongo/mongo-log-document.config';
import { LogServerConfig } from '../../log/src/config/log.server.config';
import { MongoLogController } from '../../log/src/mongo-log/mongo-log.controller';
import { AuthService } from '../../log/src/auth/auth.service';
import { NfTokenStrategy } from '../../log/src/auth/strategy/nf-token.strategy';
import { MongoLogService } from '../../log/src/mongo-log/mongo-log.service';
import { LogController } from '../../log/src/default/log.controller';
import { LogService } from '../../log/src/default/log.service';

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
  providers: [LogService, AuthService, NfTokenStrategy, MongoLogService],
})
export class LogElementModule {}
