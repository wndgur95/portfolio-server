import { Injectable, Logger } from '@nestjs/common';
import { ChattingKafkaService } from './chatting-kafka.service';
import {
  ChatEvent,
  ChatEventType,
} from './interfaces/chatting-kafka-event.interface';

@Injectable()
export class ChattingKafkaProducerService {
  private readonly logger = new Logger(ChattingKafkaProducerService.name);

  constructor(private readonly kafkaService: ChattingKafkaService) {}

  async publishRoomJoin(
    roomId: string,
    userId: string,
    username: string,
  ): Promise<void> {
    const event: ChatEvent = {
      type: 'room-join' as ChatEventType,
      roomId,
      userId,
      username,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    await this.publishEvent('chat-events', event, roomId);
  }

  async publishRoomLeave(roomId: string, userId: string): Promise<void> {
    const event: ChatEvent = {
      type: 'room-leave' as ChatEventType,
      roomId,
      userId,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    await this.publishEvent('chat-events', event, roomId);
  }

  async publishMessage(roomId: string, messageData: any): Promise<void> {
    const event: ChatEvent = {
      type: 'message-send' as ChatEventType,
      roomId,
      userId: messageData.userId,
      messageData,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    await this.publishEvent('chat-events', event, roomId);
  }

  async publishUserConnect(userId: string, username: string): Promise<void> {
    const event: ChatEvent = {
      type: 'user-connect' as ChatEventType,
      userId,
      username,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    await this.publishEvent('chat-events', event, userId);
  }

  async publishUserDisconnect(userId: string): Promise<void> {
    const event: ChatEvent = {
      type: 'user-disconnect' as ChatEventType,
      userId,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    await this.publishEvent('chat-events', event, userId);
  }

  private async publishEvent(
    topic: string,
    event: ChatEvent,
    key: string,
  ): Promise<void> {
    try {
      const producer = this.kafkaService.getProducer();

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
