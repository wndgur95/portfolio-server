import { Injectable, Logger } from '@nestjs/common';
import { MessageKafkaService } from './message-kafka.service';
import { EnvProvider } from '@libs/common/provider/env.provider';
import {
  AirdropMessageEvent,
  BATCH_MESSAGE_TYPE,
  BatchMessageEvent,
  Erc1155ClaimMessageEvent, GachaMessageEvent,
  MessageEventType,
} from './interfaces/message-kafka-event.interface';

@Injectable()
export class MessageKafkaProducerService {
  private readonly logger = new Logger(MessageKafkaProducerService.name);

  constructor(private readonly messageKafkaService: MessageKafkaService) {}

  async publishAirdropCoin(
    socketIds: string[],
    message: string,
  ): Promise<AirdropMessageEvent> {
    const event: AirdropMessageEvent = {
      type: BATCH_MESSAGE_TYPE.AIRDROP_COIN,
      socketIds,
      message,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent(
      'batch-message-events',
      event,
      BATCH_MESSAGE_TYPE.AIRDROP_COIN,
    );
  }

  async publishErc1155Claim(
    socketIds: string[],
    message: string,
  ): Promise<Erc1155ClaimMessageEvent> {
    const event: Erc1155ClaimMessageEvent = {
      type: BATCH_MESSAGE_TYPE.ERC1155_CLAIM,
      socketIds,
      message,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent(
      'batch-message-events',
      event,
      BATCH_MESSAGE_TYPE.ERC1155_CLAIM,
    );
  }

  async publishGacha(
    socketIds: string[],
    message: string,
  ): Promise<GachaMessageEvent> {
    const event: GachaMessageEvent = {
      type: BATCH_MESSAGE_TYPE.GACHA,
      socketIds,
      message,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent(
      'batch-message-events',
      event,
      BATCH_MESSAGE_TYPE.GACHA,
    );
  }

  async publishUserDisconnect(socketId: string): Promise<BatchMessageEvent> {
    const event: BatchMessageEvent = {
      type: BATCH_MESSAGE_TYPE.USER_DISCONNECT,
      socketId,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent('batch-message-events', event, socketId);
  }

  private async publishEvent(
    topic: string,
    event: MessageEventType,
    key: string,
  ): Promise<MessageEventType> {
    if (!EnvProvider.isProd()) return event;
    try {
      const producer = this.messageKafkaService.getProducer();

      await producer.send({
        topic,
        messages: [
          {
            key,
            value: JSON.stringify(event),
            timestamp: Date.now().toString(),
          },
        ],
      });

      this.logger.log(`Kafka 이벤트 발행 성공: ${event.type} - ${key}`);
    } catch (error) {
      this.logger.error(
        `Kafka 이벤트 발행 실패: ${event.type} - ${key}`,
        error,
      );
      throw error;
    }
  }
}
