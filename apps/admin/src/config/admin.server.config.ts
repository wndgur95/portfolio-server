import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/date.extension';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';

const environment = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.admin.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [
        CommonDatabaseConfig,
        GameDatabaseConfig,
        ArenaDatabaseConfig,
        ContractDatabaseConfig,
      ],
    }),
  ],
})
export class AdminServerConfig {}
