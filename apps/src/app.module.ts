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
import { CommonModule } from '@libs/dao/common/common.module';
import { GameModule as GameDbModule } from '@libs/dao/game/game.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { UserLevelLockInterceptor } from '@libs/common/interceptor/user-level-lock.interceptor';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import { PayloadInterceptor } from '@libs/common/interceptor/payload.interceptor';
import { MissionProvider } from '@libs/common/provider/contents/mission.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MissionAchievementProvider } from '@libs/common/provider/achievement/mission-achievement.provider';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { SequenceInterceptor } from '@libs/common/interceptor/sequence.interceptor';
import { ApiElementModule } from './modules/api-element.module';
import { GameElementModule } from './modules/game-element.module';
import { SocketElementModule } from './modules/socker-element.module';
import { LogElementModule } from './modules/log-element.module';
import { MongoLogInterceptor } from '@libs/common/interceptor/mongo-log.interceptor';
import { LogServerProvider } from '@libs/common/http/log-server.provider';
import { HttpModule } from '@nestjs/axios';
import { GetUserIdInterceptor } from '../admin/src/interceptor/get-user-id.interceptor';
import { AdminElementModule } from './modules/admin-element.module';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { ArenaModule } from '@libs/dao/arena/arena.module';

//App
@Module({
  imports: [
    AppServerConfig,
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),

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

    CommonModule,
    GameDbModule,
    StaticModule,
    ArenaModule,

    ApiElementModule,
    GameElementModule,
    SocketElementModule,
    LogElementModule,
    AdminElementModule,
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
    { provide: APP_INTERCEPTOR, useClass: MongoLogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: UserLevelLockInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
    { provide: APP_INTERCEPTOR, useClass: SequenceInterceptor },
    { provide: APP_INTERCEPTOR, useClass: PayloadInterceptor },
    { provide: APP_INTERCEPTOR, useClass: GetUserIdInterceptor },
    MissionProvider,

    AchievementProvider,
    MissionAchievementProvider,
    LogServerProvider,
    //Provider----

    //----DataProvider
    DataCharacterProvider,
    DataGoodsProvider,
    DataMissionProvider,
    //DataProvider----
  ],
})
export class AppModule {}
