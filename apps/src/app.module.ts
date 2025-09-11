import { Module, ValidationPipe } from '@nestjs/common';
import { AppServerConfig } from './config/app.server.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { AuthModule as ApiAuthModule } from '../api/src/auth/auth.module';
import { AuthModule as GameAuthModule } from '../game/src/auth/auth.module';
import { CommonModule } from '@libs/dao/common/common.module';
import { GameModule as GameDbModule } from '@libs/dao/game/game.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { UserController as ApiUserController } from '../api/src/user/user.controller';
import { UserController as GameUserController } from '../game/src/user/user.controller';
import { CharacterController } from '../game/src/character/character.controller';
import { BattleController } from '../game/src/battle/battle.controller';
import { MissionController } from '../game/src/mission/mission.controller';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { UserLevelLockInterceptor } from '@libs/common/interceptor/user-level-lock.interceptor';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import { PayloadInterceptor } from '@libs/common/interceptor/payload.interceptor';
import { UserService as ApiUserService } from '../api/src/user/user.service';
import { UserService as GameUserService } from '../game/src/user/user.service';
import { CharacterService } from '../game/src/character/character.service';
import { BattleService } from '../game/src/battle/battle.service';
import { MissionService } from '../game/src/mission/mission.service';
import { ConsumptionProvider } from '@libs/common/provider/goods/consumption.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { RewardProvider } from '@libs/common/provider/goods/reward.provider';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { BattleProvider } from '@libs/common/provider/contents/battle.provider';
import { MissionProvider } from '@libs/common/provider/contents/mission.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MissionAchievementProvider } from '@libs/common/provider/achievement/mission-achievement.provider';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { ApiController } from '../api/src/default/api.controller';
import { DatabaseController } from '../api/src/database/database.controller';
import { ApiService } from '../api/src/default/api.service';
import { DatabaseService } from '../api/src/database/database.service';
import { ValidateProvider } from '@libs/common/provider/validate.provider';
import { ApiServerConfig } from '../api/src/config/api.server.config';
import { GameServerConfig } from '../game/src/config/game.server.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisThrottlerStorage } from '../api/src/auth/guard/redis-throttler-storage';
import { ArenaModule } from '@libs/dao/arena/arena.module';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { GameController } from '../game/src/default/game.controller';
import { GameService } from '../game/src/default/game.service';
import { SoloBattleProvider } from '@libs/common/provider/contents/solo-battle.provider';
import { GachaProvider } from '@libs/common/provider/gacha/gacha.provider';
import { ShopService } from '../game/src/shop/shop.service';
import { ShopController } from '../game/src/shop/shop.controller';
import { BattleServerConfig } from '../battle/src/config/battle.server.config';
import { AuthModule as AuthBattleModule } from '../battle/src/auth/auth.module';
import { BattleController as BattleDefaultController } from '../battle/src/default/battle.controller';
import { BattleService as BattleDefaultService } from '../battle/src/default/battle.service';
import { SoloBattleGateway } from '../battle/src/solo-battle/solo-battle.gateway';
import { SoloBattleService } from '../battle/src/solo-battle/solo-battle.service';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { KafkaModule } from '../battle/src/kafka/kafka.module';

//Api
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
    ...[CommonDatabaseConfig].map((it) => {
      return TypeOrmExModule.forRootAsync({
        name: it().name,
        inject: [it.KEY],
        useFactory: async (config: DataSourceOptions) => config,
      });
    }),

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
  ],
  controllers: [
    //App
    ApiController,
    ApiUserController,
    DatabaseController,
  ],
  providers: [
    ApiService,
    ApiUserService,
    DatabaseService,

    ValidateProvider,

    ConsumptionProvider,
    GoodsProvider,
    RewardProvider,

    UserDetailProvider,

    DataCharacterProvider,
    DataGoodsProvider,

    AchievementProvider,
    MissionAchievementProvider,
    MissionProvider,
    DataMissionProvider,
  ],
})
export class ApiElementModule {}

//Game
@Module({
  imports: [
    GameServerConfig,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'), // dist/apps/api/public
      serveRoot: '/public', // → http://localhost:3000/public/privacy_policy.html
    }),

    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ...[CommonDatabaseConfig, ArenaDatabaseConfig].map((it) => {
      return TypeOrmExModule.forRootAsync({
        name: it().name,
        inject: [it.KEY],
        useFactory: async (config: DataSourceOptions) => config,
      });
    }),

    ...getGameServerTypeOrmOptions().map((options) =>
      TypeOrmExModule.forRootAsync({
        name: options.name,
        inject: [GameDatabaseConfig.KEY],
        useFactory: (configs: Record<string, DataSourceOptions>) =>
          Object.values(configs).find((it) => it.name === options.name),
      }),
    ),

    RedisModule,

    GameAuthModule,
    CommonModule,
    GameDbModule,
    StaticModule,

    ArenaModule,
  ],
  controllers: [
    GameController,
    GameUserController,
    CharacterController,
    BattleController,
    MissionController,
    ShopController,
  ],
  providers: [
    //----Service
    GameService,
    GameUserService,
    CharacterService,
    BattleService,
    MissionService,
    ShopService,
    //Service----

    //----Provider
    ConsumptionProvider,
    GoodsProvider,
    RewardProvider,
    UserDetailProvider,
    BattleProvider,
    MissionProvider,
    GachaProvider,

    AchievementProvider,
    MissionAchievementProvider,
    SoloBattleProvider,
    //Provider----

    //----DataProvider
    DataCharacterProvider,
    DataGoodsProvider,
    DataMissionProvider,
    //DataProvider----
  ],
})
export class GameElementModule {}

@Module({
  imports: [BattleServerConfig, KafkaModule, StaticModule, AuthBattleModule],
  controllers: [BattleDefaultController],
  providers: [
    BattleDefaultService,
    SoloBattleGateway,
    SoloBattleService,
    SoloBattleRedisRepository,
    DataCharacterProvider,
  ],
})
export class BattleElementModule {}

//App
@Module({
  imports: [
    AppServerConfig,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'), // dist/apps/api/public
      serveRoot: '/public', // → http://localhost:3000/public/privacy_policy.html
    }),

    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ...[CommonDatabaseConfig].map((it) => {
      return TypeOrmExModule.forRootAsync({
        name: it().name,
        inject: [it.KEY],
        useFactory: async (config: DataSourceOptions) => config,
      });
    }),

    ...getGameServerTypeOrmOptions().map((options) =>
      TypeOrmExModule.forRootAsync({
        name: options.name,
        inject: [GameDatabaseConfig.KEY],
        useFactory: (configs: Record<string, DataSourceOptions>) =>
          Object.values(configs).find((it) => it.name === options.name),
      }),
    ),

    RedisModule,

    CommonModule,
    GameDbModule,
    StaticModule,

    ApiElementModule,
    GameElementModule,
    BattleElementModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true, // 암시적 타입 변환 활성화 (문자열 → 숫자, 불린 등)
        },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: UserLevelLockInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
    { provide: APP_INTERCEPTOR, useClass: PayloadInterceptor },
    MissionProvider,

    AchievementProvider,
    MissionAchievementProvider,
    //Provider----

    //----DataProvider
    DataCharacterProvider,
    DataGoodsProvider,
    DataMissionProvider,
    //DataProvider----
  ],
})
export class AppModule {}
