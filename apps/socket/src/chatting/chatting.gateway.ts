import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ChatMessageDto,
  JoinRoomDto,
  ErrorEvent,
} from './interfaces/chat.interface';
import { ChattingService } from './chatting.service';
import { ChattingKafkaProducerService } from '../chatting-kafka/chatting-kafka-producer.service';
import { ChattingKafkaConsumerService } from '../chatting-kafka/chatting-kafka-consumer.service';

@WebSocketGateway({ namespace: 'socket/chat', cors: { origin: '*' } })
export class ChattingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChattingGateway.name);

  constructor(
    private readonly chattingService: ChattingService,
    private readonly kafkaProducer: ChattingKafkaProducerService,
    private readonly kafkaConsumer: ChattingKafkaConsumerService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.logger.log('웹소켓 서버 초기화');
    // Consumer에 Server 인스턴스 전달
    this.kafkaConsumer.setServer(this.server);
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const payload = await this.chattingService.validateAndSetupClient(client);
      if (!payload) {
        client.emit('error', { message: '유효하지 않은 인증 토큰입니다.' });
        client.disconnect();
        return;
      }

      await this.chattingService.disconnectExistingConnection(
        this.server,
        payload.id,
      );

      await this.chattingService.connectUser(payload, client);
    } catch (error) {
      this.logger.error(`연결 처리 실패: ${error.message}`);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Kafka 기반 클라이언트 연결 해제: ${client.id}`);
    try {
      await this.chattingService.disconnectUser(client);

      await this.chattingService.leaveRoom(this.server, client);
    } catch (error) {
      this.logger.error(
        `연결 해제 처리 실패 - 클라이언트 ${client.id}:`,
        error,
      );
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { roomId, password } = data;

    // 룸 비밀번호 확인/생성 위임
    const ensure = await this.chattingService.ensureRoomWithPassword(
      client,
      roomId,
      password,
    );

    if (!ensure.ok) return;

    // 기존 룸에서 모두 나가기
    await this.chattingService.leaveRoom(this.server, client);

    // 최종 입장 처리
    await this.chattingService.joinRoom(client, roomId, ensure.roomExists);
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket): Promise<void> {
    await this.chattingService.leaveRoom(this.server, client);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { message, username } = data;

    // client.data에서 현재 룸 ID 가져오기
    const roomId = client.data.currentRoom;

    if (!roomId) {
      client.emit('error', {
        message: '룸에 입장하지 않았습니다.',
      });
      return;
    }

    // 클라이언트가 해당 룸에 있는지 확인
    if (!client.rooms.has(roomId)) {
      client.emit('error', {
        message: '해당 룸에 입장하지 않았습니다.',
      });
      return;
    }

    await this.chattingService.chatMessage(
      this.server,
      client,
      roomId,
      message,
      username,
    );
  }

  @SubscribeMessage('get-room-users')
  async handleGetRoomUsers(@ConnectedSocket() client: Socket): Promise<void> {
    const roomId = client.data.currentRoom;

    try {
      if (!client.rooms.has(roomId)) {
        this.logger.warn(`Client ${client.id} not in room ${roomId}`);
        client.emit('error', {
          message: '해당 룸에 입장하지 않았습니다.',
        });
        return;
      }

      // 서비스에서 룸 사용자 목록 가져오기
      await this.chattingService.getRoomUsers(client, roomId);
    } catch (error) {
      this.logger.error(`Error getting room users for room ${roomId}:`, {
        message: error.message,
        stack: error.stack,
        name: error.name,
        error: error,
      });
      const errorEvent: ErrorEvent = {
        message: '사용자 목록을 가져오는 중 오류가 발생했습니다.',
      };
      client.emit('error', errorEvent);
    }
  }
}
