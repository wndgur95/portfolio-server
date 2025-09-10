import { Module, ValidationPipe } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { BattleServerConfig } from './config/battle.server.config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { SoloBattleGateway } from './solo-battle/solo-battle.gateway';
import { SoloBattleService } from './solo-battle/solo-battle.service';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { BattleController } from './default/battle.controller';
import { BattleService } from './default/battle.service';
import { StaticModule } from '@libs/dao/static/static.module';

@Module({
  imports: [
    BattleServerConfig,
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    KafkaModule,
    AuthModule,
    StaticModule,
  ],
  controllers: [BattleController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
    BattleService,
    SoloBattleGateway,
    SoloBattleService,
    SoloBattleRedisRepository,
  ],
})
export class BattleModule {}
