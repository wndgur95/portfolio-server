import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import MongoLogDocumentConfig from '@libs/dao/config/mongo/mongo-log-document.config';

const environment = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `./config/.log.${environment}.env`,
      load: [
        MongoLogDocumentConfig
      ]
    }),
  ],
})
export class LogServerConfig {}
