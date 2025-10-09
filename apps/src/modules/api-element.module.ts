import { Module } from '@nestjs/common';
import { ApiServerConfig } from '../../api/src/config/api.server.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisThrottlerStorage } from '../../api/src/auth/guard/redis-throttler-storage';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { AuthModule as ApiAuthModule } from '../../api/src/auth/auth.module';
import { CommonModule } from '@libs/dao/common/common.module';
import { GameModule as GameDbModule } from '@libs/dao/game/game.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { ApiController } from '../../api/src/default/api.controller';
import { UserController as ApiUserController } from '../../api/src/user/user.controller';
import { DatabaseController } from '../../api/src/database/database.controller';
import { StaticController } from '../../api/src/static/static.controller';
import { ErrorController } from '../../api/src/error/error.controller';
import { ApiService } from '../../api/src/default/api.service';
import { UserService as ApiUserService } from '../../api/src/user/user.service';
import { DatabaseService } from '../../api/src/database/database.service';
import { StaticService } from '../../api/src/static/static.service';
import { ErrorService } from '../../api/src/error/error.service';
import { ValidateProvider } from '@libs/common/provider/validate.provider';
import { ConsumptionProvider } from '@libs/common/provider/goods/consumption.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { RewardProvider } from '@libs/common/provider/goods/reward.provider';
import { CharacterProvider } from '@libs/common/provider/contents/character.provider';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MissionAchievementProvider } from '@libs/common/provider/achievement/mission-achievement.provider';
import { MissionProvider } from '@libs/common/provider/contents/mission.provider';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { Web3Service } from '../../api/src/web3/web3.service';
import { PortfolioService } from '../../api/src/web3/portfolio/portfolio.service';
import { PolygonService } from '../../api/src/web3/polygon/polygon.service';
import { ImmutableService } from '../../api/src/web3/immutable/immutable.service';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { ContractModule } from '@libs/dao/contract/contract.module';
import { TokenController } from '../../api/src/token/token.controller';
import { TokenService } from '../../api/src/token/token.service';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { ImmutableProvider } from '@libs/common/provider/web3/immutable/immutable.provider';
import { PolygonProvider } from '@libs/common/provider/web3/polygon/polygon.provider';
import { PortfolioProvider } from '@libs/common/provider/web3/portfolio/portfolio.provider';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { BatchCommonModule } from '@libs/dao/batch/common/batch-common.module';
import { AirdropController } from '../../api/src/airdrop/airdrop.controller';
import { AirdropService } from '../../api/src/airdrop/airdrop.service';

@Module({
  imports: [
    ApiServerConfig,

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1분
          limit: 10, // 10번 요청
        },
      ],
      storage: new RedisThrottlerStorage(),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'), // dist/apps/api/public
      serveRoot: '/public', // → http://localhost:3000/public/privacy_policy.html
    }),

    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ...[CommonDatabaseConfig, ContractDatabaseConfig, BatchDatabaseConfig].map(
      (it) => {
        return TypeOrmExModule.forRootAsync({
          name: it().name,
          inject: [it.KEY],
          useFactory: async (config: DataSourceOptions) => config,
        });
      },
    ),

    ...getGameServerTypeOrmOptions().map((options) =>
      TypeOrmExModule.forRootAsync({
        name: options.name,
        inject: [GameDatabaseConfig.KEY],
        useFactory: (configs: Record<string, DataSourceOptions>) =>
          Object.values(configs).find((it) => it.name === options.name),
      }),
    ),

    RedisModule,

    ApiAuthModule,
    CommonModule,
    GameDbModule,
    StaticModule,
    ContractModule,
    BatchCommonModule,
  ],
  controllers: [
    //App
    ApiController,
    ApiUserController,
    DatabaseController,
    StaticController,
    ErrorController,
    TokenController,
    AirdropController,
  ],
  providers: [
    ApiService,
    ApiUserService,
    DatabaseService,
    StaticService,
    ErrorService,
    AirdropService,

    ValidateProvider,

    ConsumptionProvider,
    GoodsProvider,
    RewardProvider,
    CharacterProvider,

    UserDetailProvider,

    DataCharacterProvider,
    DataGoodsProvider,

    AchievementProvider,
    MissionAchievementProvider,
    MissionProvider,
    DataMissionProvider,

    Web3Service,
    PortfolioService,
    PolygonService,
    ImmutableService,

    TokenService,

    Web3Provider,
    ImmutableProvider,
    PolygonProvider,
    PortfolioProvider,
  ],
})
export class ApiElementModule {}
