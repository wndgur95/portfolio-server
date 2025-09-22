import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChattingKafkaService } from './chatting-kafka.service';
import { ChatEvent } from './interfaces/chatting-kafka-event.interface';
import { ChattingService } from '../chatting/chatting.service';
import { EnvProvider } from '@libs/common/provider/env.provider';

@Injectable()
export class ChattingKafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ChattingKafkaConsumerService.name);

  constructor(
    private readonly chattingKafkaService: ChattingKafkaService,
    private readonly chattingService: ChattingService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      if (!EnvProvider.isProd()) return;
      const consumer = this.chattingKafkaService.getConsumer();

      await consumer.subscribe({
        topics: ['chat-events'],
        fromBeginning: false,
      });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const event = JSON.parse(message.value.toString());
          await this._handleKafkaMessage(event);
        },
      });

      this.logger.log('Kafka Consumer 구독 시작');
    } catch (error) {
      this.logger.error('Kafka Consumer 초기화 실패:', error);
      throw error;
    }
  }

  private async _handleKafkaMessage(event: ChatEvent): Promise<void> {
    try {
      // 자신이 발행한 이벤트는 무시 (무한 루프 방지)
      // if (event.serverId === process.env.SERVER_ID) {
      //   return;
      // }

      switch (event.type) {
        case 'room-join':
          await this.chattingService.consumerJoinRoom(event);
          break;
        case 'room-leave':
          await this.chattingService.consumerLeaveRoom(event);
          break;
        case 'message-send':
          await this.chattingService.consumerChatMessage(event);
          break;
        case 'user-disconnect':
          await this.chattingService.consumerDisconnectUser(event);
          break;
        default:
          this.logger.warn(`알 수 없는 이벤트 타입: ${event.type}`);
      }
    } catch (error) {
      this.logger.error('Kafka 메시지 처리 실패:', error);
    }
  }
}
