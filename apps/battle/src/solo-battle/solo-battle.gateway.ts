import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { SoloBattleService } from './solo-battle.service';
import { SoloBattleDto } from './dto/solo-battle.dto';
import { KafkaService } from '../kafka/kafka.service';
import { AuthService } from '../auth/auth.service';

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

  constructor(
    private readonly soloBattleService: SoloBattleService,
    private readonly kafkaService: KafkaService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
    
    try {
      // 세션 인증
      const userId = client.handshake.auth.userId || client.handshake.query.userId;
      const sessionId = client.handshake.auth.sessionId || client.handshake.query.sessionId;
      
      if (!sessionId || !userId) {
        this.logger.warn(`No session ID provided for client ${client.id}`);
        client.emit('error', { message: 'Session ID is required' });
        client.disconnect();
        return;
      }

      const session = await this.authService.validateSession(userId, sessionId);
      
      if (!session) {
        this.logger.warn(`Invalid session for client ${client.id}`);
        client.emit('error', { message: 'Invalid or expired session' });
        client.disconnect();
        return;
      }

      // 클라이언트에 사용자 정보 저장
      client.data.userId = session.userId;
      client.data.sessionId = sessionId;

      // 클라이언트 연결 시 초기화
      await this.soloBattleService.initializeClient(client.id);
      
      // 클라이언트에게 연결 성공 메시지 전송
      client.emit('connected', {
        clientId: client.id,
        userId: session.userId,
        message: 'Solo Battle WebSocket connected successfully',
      });

      this.logger.log(`Authenticated user ${session.userId} connected as client ${client.id}`);
    } catch (error) {
      this.logger.error(`Error initializing client ${client.id}:`, error);
      client.emit('error', { message: 'Failed to initialize client' });
      client.disconnect();
    }
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
    
    try {
      const result = await this.soloBattleService.joinBattle(
        client.id,
        data.battleId,
        client.data.userId, // 인증된 사용자 ID 사용
      );
      
      // Kafka에 배틀 참가 이벤트 발행
      await this.kafkaService.publishBattleEvent('player-joined', data.battleId, {
        clientId: client.id,
        userId: client.data.userId,
        timestamp: Date.now(),
      });
      
      client.emit('battle-joined', result);
    } catch (error) {
      this.logger.error(`Error joining battle:`, error);
      client.emit('error', { message: 'Failed to join battle' });
    }
  }

  @SubscribeMessage('leave-battle')
  async handleLeaveBattle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.LeaveBattleDto,
  ): Promise<void> {
    this.logger.log(`Client ${client.id} leaving battle: ${data.battleId}`);
    
    try {
      await this.soloBattleService.leaveBattle(client.id, data.battleId);
      client.emit('battle-left', { battleId: data.battleId });
    } catch (error) {
      this.logger.error(`Error leaving battle:`, error);
      client.emit('error', { message: 'Failed to leave battle' });
    }
  }

  @SubscribeMessage('player-move')
  async handlePlayerMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.PlayerMoveDto,
  ): Promise<void> {
    try {
      const result = await this.soloBattleService.updatePlayerPosition(
        client.id,
        data.battleId,
        data.position,
      );
      
      // 같은 배틀의 다른 클라이언트들에게 위치 업데이트 브로드캐스트
      this.server.to(data.battleId).emit('player-moved', {
        clientId: client.id,
        position: data.position,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error(`Error updating player position:`, error);
      client.emit('error', { message: 'Failed to update player position' });
    }
  }

  @SubscribeMessage('monster-spawn')
  async handleMonsterSpawn(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.MonsterSpawnDto,
  ): Promise<void> {
    try {
      const result = await this.soloBattleService.spawnMonster(
        data.battleId,
        data.monsterType,
        data.position,
      );
      
      // Kafka에 몬스터 스폰 이벤트 발행
      await this.kafkaService.publishMonsterEvent('monster-spawned', result.monsterId, data.battleId, {
        monsterType: data.monsterType,
        position: data.position,
        timestamp: result.timestamp,
      });
      
      // 같은 배틀의 모든 클라이언트에게 몬스터 스폰 알림
      this.server.to(data.battleId).emit('monster-spawned', result);
    } catch (error) {
      this.logger.error(`Error spawning monster:`, error);
      client.emit('error', { message: 'Failed to spawn monster' });
    }
  }

  @SubscribeMessage('monster-defeated')
  async handleMonsterDefeated(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.MonsterDefeatedDto,
  ): Promise<void> {
    try {
      const result = await this.soloBattleService.defeatMonster(
        client.id,
        data.battleId,
        data.monsterId,
      );
      
      // 같은 배틀의 모든 클라이언트에게 몬스터 처치 알림
      this.server.to(data.battleId).emit('monster-defeated', result);
    } catch (error) {
      this.logger.error(`Error defeating monster:`, error);
      client.emit('error', { message: 'Failed to defeat monster' });
    }
  }

  @SubscribeMessage('level-up')
  async handleLevelUp(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.LevelUpDto,
  ): Promise<void> {
    try {
      const result = await this.soloBattleService.levelUp(
        client.id,
        data.battleId,
        data.newLevel,
        data.newStats,
      );
      
      // 같은 배틀의 모든 클라이언트에게 레벨업 알림
      this.server.to(data.battleId).emit('player-leveled-up', {
        clientId: client.id,
        newLevel: data.newLevel,
        newStats: data.newStats,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error(`Error leveling up:`, error);
      client.emit('error', { message: 'Failed to level up' });
    }
  }

  @SubscribeMessage('item-drop')
  async handleItemDrop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.ItemDropDto,
  ): Promise<void> {
    try {
      const result = await this.soloBattleService.dropItem(
        data.battleId,
        data.itemType,
        data.position,
      );
      
      // 같은 배틀의 모든 클라이언트에게 아이템 드롭 알림
      this.server.to(data.battleId).emit('item-dropped', result);
    } catch (error) {
      this.logger.error(`Error dropping item:`, error);
      client.emit('error', { message: 'Failed to drop item' });
    }
  }

  @SubscribeMessage('item-pickup')
  async handleItemPickup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.ItemPickupDto,
  ): Promise<void> {
    try {
      const result = await this.soloBattleService.pickupItem(
        client.id,
        data.battleId,
        data.itemId,
      );
      
      // 같은 배틀의 모든 클라이언트에게 아이템 획득 알림
      this.server.to(data.battleId).emit('item-picked-up', {
        clientId: client.id,
        itemId: data.itemId,
        item: result,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error(`Error picking up item:`, error);
      client.emit('error', { message: 'Failed to pick up item' });
    }
  }

  @SubscribeMessage('battle-status')
  async handleBattleStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SoloBattleDto.BattleStatusDto,
  ): Promise<void> {
    try {
      const status = await this.soloBattleService.getBattleStatus(data.battleId);
      client.emit('battle-status-response', status);
    } catch (error) {
      this.logger.error(`Error getting battle status:`, error);
      client.emit('error', { message: 'Failed to get battle status' });
    }
  }
}
