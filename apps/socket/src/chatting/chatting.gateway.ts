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
import { ChatMessageDto, JoinRoomDto } from './interfaces/chat.interface';
import { ChattingService } from './chatting.service';

@WebSocketGateway({
  namespace: 'socket/chat',
  cors: {
    origin: [process.env.CORS_DOMAIN],
    credentials: true,
  },
})
export class ChattingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChattingGateway.name);

  constructor(private readonly chattingService: ChattingService) {}

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.chattingService.setServer(this.server);
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const payload = await this.chattingService.validateAndSetupClient(client);
      if (!payload) {
        client.emit('error', { message: '유효하지 않은 인증 토큰입니다.' });
        client.disconnect();
        return;
      }

      const socketId = await this.chattingService.getConnectedSocketId(
        payload.id,
      );

      await this.chattingService.connectUser(payload, client);

      await this.chattingService.producerDisconnectUser(socketId);
    } catch (error) {
      this.logger.error(`연결 처리 실패: ${error.message}`);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      await this.chattingService.producerLeaveRoom(client);
      await this.chattingService.producerDisconnectUser(client.id);

      await this.chattingService.disconnectUser(client);
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
    await this.chattingService.producerLeaveRoom(client);

    // 최종 입장 처리
    await this.chattingService.producerJoinRoom(client, roomId, ensure.isExist);
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket): Promise<void> {
    await this.chattingService.producerLeaveRoom(client);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { message, username } = data;

    await this.chattingService.producerChatMessage(client, message, username);
  }

  @SubscribeMessage('get-room-users')
  async handleGetRoomUsers(@ConnectedSocket() client: Socket): Promise<void> {
    const roomId = client.data.currentRoom;

    if (!client.rooms.has(roomId)) {
      this.logger.warn(`Client ${client.id} not in room ${roomId}`);
      client.emit('error', {
        message: '해당 룸에 입장하지 않았습니다.',
      });
      return;
    }

    // 서비스에서 룸 사용자 목록 가져오기
    await this.chattingService.getRoomUsers(client, roomId);
  }
}
