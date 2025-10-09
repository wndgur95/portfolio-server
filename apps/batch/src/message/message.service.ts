import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { Server, Socket } from 'socket.io';
import {
  UserSessionData,
  AirdropCoinEvent,
} from './interfaces/message.interface';
import { EnvProvider } from '@libs/common/provider/env.provider';
import { BatchMessageRepository } from '@libs/dao/redis/batch-message/batch-message.repository';
import { MessageKafkaProducerService } from '../message-kafka/message-kafka-producer.service';
import {
  AirdropMessageEvent,
  BATCH_MESSAGE_TYPE,
  BatchMessageEvent,
} from '../message-kafka/interfaces/message-kafka-event.interface';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  private readonly shortServerId = null;
  private server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly batchMessageRepository: BatchMessageRepository,
    private readonly messageKafkaProducerService: MessageKafkaProducerService,
  ) {
    const splitServerId = process.env.SERVER_ID.split('-');
    this.shortServerId = splitServerId[splitServerId.length - 1];
  }

  setServer(server: Server): void {
    this.server = server;
  }

  /**
   * 기존 연결 해제 (Redis 기반)
   */
  async getConnectedSocketId(userId: number): Promise<string> {
    if (!userId) return;

    return await this._getExistingSocketId(userId);
  }

  async connectUser(payload: JwtPayload, client: Socket): Promise<void> {
    await this._saveUserData(payload.userId, client.id, payload);

    // 연결 성공 이벤트 전송 (동일 포맷)
    client.emit('authenticated', {
      userId: payload.userId,
      address: client.data.address,
      serverId: this.shortServerId,
    });
  }

  async producerDisconnectUser(socketId: string): Promise<boolean> {
    if (!socketId) return;

    const event =
      await this.messageKafkaProducerService.publishUserDisconnect(socketId);

    if (!EnvProvider.isProd()) await this.consumerDisconnectUser(event);
  }

  async consumerDisconnectUser(event: BatchMessageEvent): Promise<boolean> {
    if (!event.socketId) return;

    const fetched = await this.server.fetchSockets();

    const existingSocket =
      fetched.find((s: any) => s.id === event.socketId) || null;

    if (!existingSocket) return;

    existingSocket.emit('error', {
      message: '다른 위치에서 로그인되어 기존 연결이 종료됩니다.',
    });
    existingSocket.disconnect(true);
  }

  /**
   * 사용자 데이터 삭제
   */
  async disconnectUser(client: Socket): Promise<void> {
    const userId = client.data.userId;
    if (!userId) return;

    const currentSocketId = await this._getExistingSocketId(userId);

    if (currentSocketId != client.id) return;

    await this._deleteUserData(userId);
  }

  // ====== High-level helpers for a thinner Gateway ======

  /**
   * 연결 시 인증 및 초기 사용자 저장, 클라이언트 데이터 세팅
   */
  async validateAndSetupClient(client: Socket): Promise<JwtPayload> {
    const jwt = (client.handshake?.auth as any)?.authToken;
    this.logger.log(
      `Client 연결 시도: ${client.id}, JWT: ${jwt ? '제공됨' : '없음'}`,
    );
    if (!jwt) return null;

    const payload = await this._validateJwtToken(jwt);
    if (!payload?.address) return null;

    client.data.userId = payload.userId;
    client.data.email = payload.email;
    client.data.address = payload.address;

    return payload;
  }

  /**
   * 에어드랍
   */
  async producerAirdropCoin(userIds: number[], message: string): Promise<void> {
    const users = await this._getUsers(userIds);

    // Kafka 에 룸 입장 이벤트 발행
    const event = await this.messageKafkaProducerService.publishAirdropCoin(
      users.map((it) => it.socketId),
      message,
    );

    if (!EnvProvider.isProd()) await this.consumerAirdropCoin(event);
  }

  /**
   * 에어드랍
   */
  async consumerAirdropCoin(event: AirdropMessageEvent): Promise<void> {
    const { socketIds, message } = event;

    if (!this.server) {
      this.logger.error('Server instance not available for join broadcasting');
      return;
    }

    // 룸의 다른 사용자들에게 입장 알림
    const airdropCoinEvent: AirdropCoinEvent = {
      message: message,
    };

    this.server
      .to(socketIds)
      .emit(BATCH_MESSAGE_TYPE.AIRDROP_COIN, airdropCoinEvent);
  }

  /**
   * JWT 토큰 검증
   */
  private async _validateJwtToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });
    } catch (error) {
      this.logger.error('JWT 토큰 검증 실패:', error);
      return null;
    }
  }

  /**
   * JWT 기반 사용자 데이터 저장
   */
  private async _saveUserData(
    userId: number,
    socketId: string,
    userData: JwtPayload,
  ): Promise<void> {
    try {
      const userKey = `user:${userId}:data`;
      const userInfo = {
        ...userData,
        socketId,
        connectedAt: new Date().toISOString(),
      } as UserSessionData;

      await this.batchMessageRepository.setex(
        userKey,
        3600, // 1시간 TTL
        JSON.stringify(userInfo),
      );

      this.logger.log(
        `사용자 데이터 저장: userId=${userId}, socketId=${socketId}, email=${userData.email}`,
      );
    } catch (error) {
      this.logger.error(`사용자 데이터 저장 실패: ${error.message}`);
    }
  }

  /**
   * 기존 연결된 소켓 ID 조회
   */
  private async _getExistingSocketId(userId: number): Promise<string> {
    try {
      const userData = await this._getUserData(userId);
      return userData?.socketId || null;
    } catch (error) {
      this.logger.error(`기존 소켓 ID 조회 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * JWT 기반 사용자 데이터 조회
   */
  private async _getUserData(userId: number): Promise<UserSessionData> {
    try {
      const userKey = `user:${userId}:data`;
      const userData = await this.batchMessageRepository.get(userKey);

      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      this.logger.error(`사용자 데이터 조회 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * JWT 기반 사용자 데이터 조회
   */
  private async _getUsers(userIds: number[]): Promise<UserSessionData[]> {
    const userKeys = [];
    for (const userId of userIds) {
      userKeys.push(`user:${userId}:data`);
    }

    const users = await this.batchMessageRepository.mgetExisting(userKeys);
    return Object.values(users).map((it) => JSON.parse(it));
  }

  /**
   * 사용자 데이터 삭제
   */
  private async _deleteUserData(userId: number): Promise<void> {
    const userKey = `user:${userId}:data`;
    await this.batchMessageRepository.del(userKey);
  }
}
