import { Module, ValidationPipe } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { SocketServerConfig } from './config/socket.server.config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { SoloBattleGateway } from './solo-battle/solo-battle.gateway';
import { SoloBattleService } from './solo-battle/solo-battle.service';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { SocketController } from './default/socket.controller';
import { SocketService } from './default/socket.service';
import { StaticModule } from '@libs/dao/static/static.module';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { ChattingGateway } from './chatting/chatting.gateway';
import { ChattingService } from './chatting/chatting.service';
import { ChattingRepository } from '@libs/dao/redis/chatting/chatting.repository';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from '@libs/common/constants/jwt.constants';
import { ConfigModule } from '@nestjs/config';
import { ChattingKafkaService } from './chatting-kafka/chatting-kafka.service';
import { ChattingKafkaProducerService } from './chatting-kafka/chatting-kafka-producer.service';
import { ChattingKafkaConsumerService } from './chatting-kafka/chatting-kafka-consumer.service';

@Module({
  imports: [
    SocketServerConfig,
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_OPTIONS.expiresIn },
    }),
    KafkaModule,
    AuthModule,
    StaticModule,
    ConfigModule,
  ],
  controllers: [SocketController],
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
    SocketService,

    ChattingGateway,
    ChattingService,
    ChattingKafkaService,
    ChattingKafkaProducerService,
    ChattingKafkaConsumerService,
    ChattingRepository,

    SoloBattleGateway,
    SoloBattleService,
    SoloBattleRedisRepository,

    DataCharacterProvider,
  ],
})
export class SocketModule {}
