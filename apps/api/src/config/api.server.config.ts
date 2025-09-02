import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/date.extension';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';

const environment = NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.api.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [CommonDatabaseConfig, GameDatabaseConfig],
    }),
  ],
})
export class ApiServerConfig {}
