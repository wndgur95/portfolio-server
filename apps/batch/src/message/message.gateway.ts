import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  namespace: 'batch/message',
  cors: {
    origin: [process.env.CORS_DOMAIN],
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessageGateway.name);

  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.messageService.setServer(this.server);
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const payload = await this.messageService.validateAndSetupClient(client);
      if (!payload?.address) {
        client.emit('error', { message: '유효하지 않은 인증 토큰입니다.' });
        client.disconnect();
        return;
      }

      const socketId = await this.messageService.getConnectedSocketId(
        payload.userId,
      );

      await this.messageService.connectUser(payload, client);

      await this.messageService.producerDisconnectUser(socketId);
    } catch (error) {
      this.logger.error(`연결 처리 실패: ${error.message}`);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      await this.messageService.producerDisconnectUser(client.id);

      await this.messageService.disconnectUser(client);
    } catch (error) {
      this.logger.error(
        `연결 해제 처리 실패 - 클라이언트 ${client.id}:`,
        error,
      );
    }
  }
}
