import { Injectable, Logger } from '@nestjs/common';
import { ChattingKafkaService } from './chatting-kafka.service';
import {
  ChatEvent,
  ChatEventType,
} from './interfaces/chatting-kafka-event.interface';
import { EnvProvider } from '@libs/common/provider/env.provider';

@Injectable()
export class ChattingKafkaProducerService {
  private readonly logger = new Logger(ChattingKafkaProducerService.name);

  constructor(private readonly chattingKafkaService: ChattingKafkaService) {}

  async publishRoomJoin(
    socketId: string,
    roomId: string,
    userId: string,
    username: string,
  ): Promise<ChatEvent> {
    const event: ChatEvent = {
      type: 'room-join' as ChatEventType,
      socketId,
      roomId,
      userId,
      username,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent('chat-events', event, roomId);
  }

  async publishRoomLeave(
    roomId: string,
    userId: string,
    username: string,
  ): Promise<ChatEvent> {
    const event: ChatEvent = {
      type: 'room-leave' as ChatEventType,
      roomId,
      userId,
      username,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent('chat-events', event, roomId);
  }

  async publishMessage(roomId: string, messageData: any): Promise<ChatEvent> {
    const event: ChatEvent = {
      type: 'message-send' as ChatEventType,
      roomId,
      userId: messageData.userId,
      messageData,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent('chat-events', event, roomId);
  }

  async publishUserDisconnect(socketId: string): Promise<ChatEvent> {
    const event: ChatEvent = {
      type: 'user-disconnect' as ChatEventType,
      socketId,
      timestamp: new Date().toISOString(),
      serverId: process.env.SERVER_ID,
    };

    return await this.publishEvent('chat-events', event, socketId);
  }

  private async publishEvent(
    topic: string,
    event: ChatEvent,
    key: string,
  ): Promise<ChatEvent> {
    if (!EnvProvider.isProd()) return event;
    try {
      const producer = this.chattingKafkaService.getProducer();

      await producer.send({
        topic,
        messages: [
          {
            // key 제거 - 라운드 로빈으로 파티션 분산
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
