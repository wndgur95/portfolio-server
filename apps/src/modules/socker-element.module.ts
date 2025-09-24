import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from '@libs/common/constants/jwt.constants';
import { SocketServerConfig } from '../../socket/src/config/socket.server.config';
import { KafkaModule } from '../../socket/src/kafka/kafka.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { AuthModule as AuthBattleModule } from '../../socket/src/auth/auth.module';
import { SocketController } from '../../socket/src/default/socket.controller';
import { SocketService as SocketDefaultService } from '../../socket/src/default/socket.service';
import { ChattingGateway } from '../../socket/src/chatting/chatting.gateway';
import { ChattingService } from '../../socket/src/chatting/chatting.service';
import { ChattingKafkaService } from '../../socket/src/chatting-kafka/chatting-kafka.service';
import { ChattingKafkaProducerService } from '../../socket/src/chatting-kafka/chatting-kafka-producer.service';
import { ChattingKafkaConsumerService } from '../../socket/src/chatting-kafka/chatting-kafka-consumer.service';
import { ChattingRepository } from '@libs/dao/redis/chatting/chatting.repository';
import { SoloBattleGateway } from '../../socket/src/solo-battle/solo-battle.gateway';
import { SoloBattleService } from '../../socket/src/solo-battle/solo-battle.service';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_OPTIONS.expiresIn },
    }),
    SocketServerConfig,
    KafkaModule,
    StaticModule,
    AuthBattleModule,
  ],
  controllers: [SocketController],
  providers: [
    SocketDefaultService,

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
export class SocketElementModule {}
