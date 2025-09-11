import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { SoloBattleService } from './solo-battle.service';
import { SoloBattleDto } from './dto/solo-battle.dto';
import { KafkaService } from '../kafka/kafka.service';
import { AuthService } from '../auth/auth.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/solo-battle',
})
export class SoloBattleGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SoloBattleGateway.name);
  private socketConnectTime = 5 * 60 * 1000;

  constructor(
    private readonly soloBattleService: SoloBattleService,
    private readonly kafkaService: KafkaService,
    private readonly authService: AuthService,
    private readonly clsService: ClsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);

    // CLS 컨텍스트로 래핑
    await this.clsService.run(async () => {
      try {
        // 세션 인증
        const userId =
          client.handshake.auth.userId || client.handshake.query.userId;
        const sessionId =
          client.handshake.auth.sessionId || client.handshake.query.sessionId;

        if (!sessionId || !userId) {
          this.logger.warn(`No session ID provided for client ${client.id}`);
          client.emit('error', { message: 'Session ID is required' });
          client.disconnect();
          return;
        }

        const session = await this.authService.validateSession(
          userId,
          sessionId,
        );

        if (!session) {
          this.logger.warn(`Invalid session for client ${client.id}`);
          client.emit('error', { message: 'Invalid or expired session' });
          client.disconnect();
          return;
        }

        // 클라이언트에 사용자 정보 저장
        client.data.userId = session.userId;
        client.data.sessionId = sessionId;
        client.data.currentBattleId = null; // 현재 참가 중인 배틀 ID 초기화
        client.data.lastActivity = Date.now(); // 마지막 활동 시간
        client.data.heartbeatCount = 0; // Heartbeat 카운터
        client.data.namespace = '/solo-battle'; // 네임스페이스 정보

        // 클라이언트 연결 시 초기화 (배틀 참가 전 상태)
        await this.soloBattleService.initializeClient(client.id);

        // Heartbeat 설정 (30초마다)
        const heartbeatInterval = setInterval(() => {
          if (client.connected) {
            client.emit('heartbeat', { timestamp: Date.now() });
            client.data.heartbeatCount++;

            // 5분간 응답이 없으면 연결 해제
            if (Date.now() - client.data.lastActivity > this.socketConnectTime) {
              this.logger.warn(`Client ${client.id} inactive for 5 minutes, disconnecting`);
              client.disconnect();
            }
          } else {
            clearInterval(heartbeatInterval);
          }
        }, 30000);

        // 클라이언트 연결 해제 시 heartbeat 정리
        client.on('disconnect', () => {
          clearInterval(heartbeatInterval);
        });

        // 클라이언트에게 연결 성공 메시지 전송
        client.emit('connected', {
          clientId: client.id,
          userId: session.userId,
          message: 'Solo Battle WebSocket connected successfully',
          status: 'ready', // 배틀 참가 준비 상태
          heartbeatInterval: 30000, // 30초
        });

        this.logger.log(
          `Authenticated user ${session.userId} connected as client ${client.id} (ready for battle)`,
        );
      } catch (error) {
        this.logger.error(`Error initializing client ${client.id}:`, error);
        client.emit('error', { message: 'Failed to initialize client' });
        client.disconnect();
      }
    });
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);

    try {
      // 클라이언트 연결 해제 시 정리 작업
      await this.soloBattleService.cleanupClient(client.id);
    } catch (error) {
      this.logger.error(`Error cleaning up client ${client.id}:`, error);
    }
  }

  @SubscribeMessage('join-battle')
  async handleJoinBattle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.JoinBattleDto,
  ): Promise<void> {
    this.logger.log(`Client ${client.id} joining battle: ${data.battleId}`);

    // 인증 상태 확인 (연결 시 이미 인증됨)
    if (!client.data.authenticated || !client.data.userId) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    // CLS 컨텍스트로 래핑
    await this.clsService.run(async () => {
      try {
        const result = await this.soloBattleService.joinBattle(
          client,
          data.battleId,
          client.data.userId, // 인증된 사용자 ID 사용
        );

        // Kafka에 배틀 참가 이벤트 발행 (임시 비활성화)
        try {
          await this.kafkaService.publishBattleEvent(
            'player-joined',
            data.battleId,
            {
              clientId: client.id,
              userId: client.data.userId,
              timestamp: Date.now(),
            },
          );
        } catch (error) {
          this.logger.warn(
            'Kafka publish failed, continuing without it:',
            error.message,
          );
        }

        // 클라이언트의 현재 배틀 ID 저장
        client.data.currentBattleId = data.battleId;
        
        this.logger.log(`=== [SoloBattleGateway] battle-joined 이벤트 발송 시작 ===`);
        this.logger.log(`Client ${client.id}에게 battle-joined 이벤트 발송`);
        this.logger.log(`Result: ${JSON.stringify(result)}`);
        
        client.emit('battle-joined', {
          ...result,
          status: 'in-battle', // 배틀 중 상태
          message: 'Successfully joined battle'
        });
        
        this.logger.log(`=== [SoloBattleGateway] battle-joined 이벤트 발송 완료 ===`);
      } catch (error) {
        this.logger.error(`Error joining battle:`, error);
        client.emit('error', { message: 'Failed to join battle' });
      }
    });
  }

  @SubscribeMessage('leave-battle')
  async handleLeaveBattle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.LeaveBattleDto,
  ): Promise<void> {
    this.logger.log(`Client ${client.id} leaving battle: ${data.battleId}`);

    // CLS 컨텍스트로 래핑
    await this.clsService.run(async () => {
      try {
        await this.soloBattleService.leaveBattle(client.id, data.battleId, data.playStatus);
        
        // 클라이언트의 현재 배틀 ID 초기화
        client.data.currentBattleId = null;
        
        // 클라이언트에게 배틀 퇴장 확인 및 준비 상태 알림
        client.emit('battle-left', { 
          battleId: data.battleId,
          status: 'ready', // 새로운 배틀 참가 준비 상태
          message: 'Successfully left battle. Ready for new battle.'
        });
        
        this.logger.log(`Client ${client.id} successfully left battle ${data.battleId} and is ready for new battle`);
      } catch (error) {
        this.logger.error(`Error leaving battle:`, error);
        client.emit('error', { message: 'Failed to leave battle' });
      }
    });
  }
}
