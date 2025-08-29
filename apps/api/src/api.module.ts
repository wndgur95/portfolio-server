import { Module, ValidationPipe } from '@nestjs/common';
import { ApiServerConfig } from './config/api.server.config';
import { AuthModule } from './auth/auth.module';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { ApiController } from './default/api.controller';
import { ApiService } from './default/api.service';
import { ValidateProvider } from '@libs/common/provider/validate.provider';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { CommonModule } from '@libs/dao/common/common.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { PayloadInterceptor } from '@libs/common/interceptor/payload.interceptor';
import { UserLevelLockInterceptor } from '@libs/common/interceptor/user-level-lock.interceptor';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { UserModule } from '@libs/dao/game/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisThrottlerStorage } from './auth/guard/redis-throttler-storage';
import { DatabaseController } from './database/database.controller';
import { DatabaseService } from './database/database.service';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import { StaticModule } from '@libs/dao/static/static.module';

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

    AuthModule,
    CommonModule,
    UserModule,
    StaticModule,
  ],
  controllers: [ApiController, UserController, DatabaseController],
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
    // { provide: APP_GUARD, useClass: ThrottlerGuard }, // 개별 적용으로 변경
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: UserLevelLockInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
    { provide: APP_INTERCEPTOR, useClass: PayloadInterceptor },
    ApiService,
    UserService,
    DatabaseService,

    ValidateProvider,
  ],
})
export class ApiModule {}
