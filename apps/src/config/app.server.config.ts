import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/date.extension';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import MongoLogDocumentConfig from '@libs/dao/config/mongo/mongo-log-document.config';

const environment = NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.app.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [
        CommonDatabaseConfig,
        GameDatabaseConfig,
        ArenaDatabaseConfig,
        MongoLogDocumentConfig,
      ],
    }),
  ],
})
export class AppServerConfig {}
