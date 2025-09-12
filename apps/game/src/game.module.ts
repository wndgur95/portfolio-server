import { Module, ValidationPipe } from '@nestjs/common';
import { GameServerConfig } from './config/game.server.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { CommonModule } from '@libs/dao/common/common.module';
import { GameModule as GameDbModule } from '@libs/dao/game/game.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { UserLevelLockInterceptor } from '@libs/common/interceptor/user-level-lock.interceptor';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import { PayloadInterceptor } from '@libs/common/interceptor/payload.interceptor';
import { AuthModule } from './auth/auth.module';
import { CharacterController } from './character/character.controller';
import { CharacterService } from './character/character.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { ConsumptionProvider } from '@libs/common/provider/goods/consumption.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { RewardProvider } from '@libs/common/provider/goods/reward.provider';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { BattleController } from './battle/battle.controller';
import { BattleService } from './battle/battle.service';
import { BattleProvider } from '@libs/common/provider/contents/battle.provider';
import { MissionController } from './mission/mission.controller';
import { MissionService } from './mission/mission.service';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { MissionProvider } from '@libs/common/provider/contents/mission.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MissionAchievementProvider } from '@libs/common/provider/achievement/mission-achievement.provider';
import { ArenaModule } from '@libs/dao/arena/arena.module';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { GameController } from './default/game.controller';
import { GameService } from './default/game.service';
import { SoloBattleProvider } from '@libs/common/provider/contents/solo-battle.provider';
import { ShopController } from './shop/shop.controller';
import { ShopService } from './shop/shop.service';
import { GachaProvider } from '@libs/common/provider/gacha/gacha.provider';
import { SequenceInterceptor } from '@libs/common/interceptor/sequence.interceptor';

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

    AuthModule,
    CommonModule,
    GameDbModule,
    StaticModule,

    ArenaModule,
  ],
  controllers: [
    GameController,
    UserController,
    CharacterController,
    BattleController,
    MissionController,
    ShopController,
  ],
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
    { provide: APP_INTERCEPTOR, useClass: SequenceInterceptor },
    { provide: APP_INTERCEPTOR, useClass: PayloadInterceptor },

    //----Service
    GameService,
    UserService,
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
export class GameModule {}
