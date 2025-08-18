import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/date.extension';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import WeddingDatabaseConfig from '@libs/dao/config/wedding/wedding-database.config';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import GroupDatabaseConfig from '@libs/dao/config/group/group-database.config';
import UserDatabaseConfig from '@libs/dao/config/user/user-database.config';

const environment = NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.api.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [
        WeddingDatabaseConfig,
        CommonDatabaseConfig,
        GroupDatabaseConfig,
        UserDatabaseConfig,
      ],
    }),
  ],
})
export class ApiServerConfig {}
