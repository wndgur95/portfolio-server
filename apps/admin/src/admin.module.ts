import { Module, ValidationPipe } from '@nestjs/common';
import { AdminServerConfig } from './config/admin.server.config';
import { ClsModule } from 'nestjs-cls';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@libs/dao/common/common.module';
import { GameModule } from '@libs/dao/game/game.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { UserLevelLockInterceptor } from '@libs/common/interceptor/user-level-lock.interceptor';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import { PayloadInterceptor } from '@libs/common/interceptor/payload.interceptor';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
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
import { GetUserIdInterceptor } from './interceptor/get-user-id.interceptor';
import { UserDetailController } from './user-detail/user-detail.controller';
import { UserDetailService } from './user-detail/user-detail.service';
import { AdminController } from './default/admin.controller';
import { AdminService } from './default/admin.service';
import { CharacterController } from './character/character.controller';
import { CharacterService } from './character/character.service';
import { MissionController } from './mission/mission.controller';
import { MissionService } from './mission/mission.service';
import { ArenaController } from './arena/arena.controller';
import { ArenaService } from './arena/arena.service';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { ArenaModule } from '@libs/dao/arena/arena.module';
import { MongoLogController } from './mongo-log/mongo-log.controller';
import { MongoLogService } from './mongo-log/mongo-log.service';
import { LogServerProvider } from '@libs/common/http/log-server.provider';
import { HttpModule } from '@nestjs/axios';
import { NetworkInterceptor } from '@libs/common/interceptor/network.interceptor';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';
import { ContractModule } from '@libs/dao/contract/contract.module';

@Module({
  imports: [
    AdminServerConfig,
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
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
    GameModule,
    StaticModule,
    ArenaModule,
    ContractModule,
  ],
  controllers: [
    AdminController,
    UserController,
    UserDetailController,
    CharacterController,
    MissionController,
    ArenaController,
    MongoLogController,
    TokenController,
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
    { provide: APP_INTERCEPTOR, useClass: PayloadInterceptor },
    { provide: APP_INTERCEPTOR, useClass: GetUserIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: NetworkInterceptor },
    AdminService,
    UserService,
    UserDetailService,
    CharacterService,
    MissionService,
    ArenaService,
    MongoLogService,

    ConsumptionProvider,
    GoodsProvider,
    RewardProvider,
    CharacterProvider,

    UserDetailProvider,

    LogServerProvider,

    DataCharacterProvider,
    DataGoodsProvider,

    AchievementProvider,
    MissionAchievementProvider,
    MissionProvider,
    DataMissionProvider,

    TokenService,
  ],
})
export class AdminModule {}
