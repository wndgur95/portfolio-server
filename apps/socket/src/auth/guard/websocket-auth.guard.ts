import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();

    // WebSocket handshake에서 세션 ID 추출
    const sessionId =
      client.handshake.auth?.sessionId ||
      client.handshake.query?.sessionId ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');

    const userId =
      client.handshake.auth?.userId ||
      client.handshake.query?.userId ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!sessionId) {
      throw new WsException('Session ID is required');
    }

    // 세션 검증
    const session = await this.authService.validateSession(userId, sessionId);

    if (!session) {
      throw new WsException('Invalid or expired session');
    }

    // 클라이언트에 사용자 정보 저장
    client.data.userId = session.userId;
    client.data.sessionId = sessionId;
    client.data.session = session;

    return true;
  }
}
