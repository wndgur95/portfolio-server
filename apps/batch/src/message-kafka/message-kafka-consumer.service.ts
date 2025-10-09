import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { MessageKafkaService } from './message-kafka.service';
import { EnvProvider } from '@libs/common/provider/env.provider';
import { MessageService } from '../message/message.service';
import {
  BATCH_MESSAGE_TYPE,
  BatchMessageEvent,
} from './interfaces/message-kafka-event.interface';

@Injectable()
export class MessageKafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(MessageKafkaConsumerService.name);

  constructor(
    private readonly messageKafkaService: MessageKafkaService,
    private readonly messageService: MessageService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      if (!EnvProvider.isProd()) return;
      const consumer = this.messageKafkaService.getConsumer();

      await consumer.subscribe({
        topics: ['batch-message-events'],
        fromBeginning: false,
      });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const event = JSON.parse(message.value.toString());
          this.logger.log(
            `Kafka 메시지 수신: ${event.type} - ${event.roomId || event.socketId}`,
          );
          await this._handleKafkaMessage(event);
        },
      });

      this.logger.log('Kafka Consumer 구독 시작');
    } catch (error) {
      this.logger.error('Kafka Consumer 초기화 실패:', error);
      throw error;
    }
  }

  private async _handleKafkaMessage(event: BatchMessageEvent): Promise<void> {
    try {
      this.logger.log(
        `Kafka 메시지 처리 시작: ${event.type} - ${event.socketId}`,
      );

      // 자신이 발행한 이벤트는 무시 (무한 루프 방지)
      // if (event.serverId === process.env.SERVER_ID) {
      //   return;
      // }

      switch (event.type) {
        case BATCH_MESSAGE_TYPE.AIRDROP_COIN:
          await this.messageService.consumerAirdropCoin(event);
          break;
        case BATCH_MESSAGE_TYPE.USER_DISCONNECT:
          await this.messageService.consumerDisconnectUser(event);
          break;
        default:
          this.logger.warn(`알 수 없는 이벤트 타입: ${event.type}`);
      }
    } catch (error) {
      this.logger.error('Kafka 메시지 처리 실패:', error);
    }
  }
}
