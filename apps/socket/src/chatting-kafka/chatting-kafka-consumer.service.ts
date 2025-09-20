import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChattingKafkaService } from './chatting-kafka.service';
import { ChatEvent } from './interfaces/chatting-kafka-event.interface';
import { ChattingService } from '../chatting/chatting.service';
import { EnvProvider } from '@libs/common/provider/env.provider';

@Injectable()
export class ChattingKafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ChattingKafkaConsumerService.name);

  constructor(
    private readonly kafkaService: ChattingKafkaService,
    private readonly chattingService: ChattingService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      if (!EnvProvider.isProd()) return;
      const consumer = this.kafkaService.getConsumer();
      
      await consumer.subscribe({ 
        topics: ['chat-events'],
        fromBeginning: false 
      });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.handleKafkaMessage(topic, message);
        },
      });

      this.logger.log('Kafka Consumer 구독 시작');
    } catch (error) {
      this.logger.error('Kafka Consumer 초기화 실패:', error);
      throw error;
    }
  }

  private async handleKafkaMessage(topic: string, message: any): Promise<void> {
    if (!EnvProvider.isProd()) return;
    try {
      const event: ChatEvent = JSON.parse(message.value.toString());
      
      // 자신이 발행한 이벤트는 무시 (무한 루프 방지)
      if (event.serverId === process.env.SERVER_ID) {
        return;
      }

      this.logger.log(`Kafka 이벤트 수신: ${event.type} - ${event.roomId || event.userId}`);

      switch (event.type) {
        case 'room-join':
          await this.chattingService.handleRemoteRoomJoin(event);
          break;
        case 'room-leave':
          await this.chattingService.handleRemoteRoomLeave(event);
          break;
        case 'message-send':
          await this.chattingService.handleRemoteMessage(event);
          break;
        case 'user-connect':
          await this.chattingService.handleRemoteUserConnect(event);
          break;
        case 'user-disconnect':
          await this.chattingService.handleRemoteUserDisconnect(event);
          break;
        default:
          this.logger.warn(`알 수 없는 이벤트 타입: ${event.type}`);
      }
    } catch (error) {
      this.logger.error('Kafka 메시지 처리 실패:', error);
    }
  }
}
