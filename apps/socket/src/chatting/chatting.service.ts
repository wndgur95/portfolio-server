import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChattingRepository } from '@libs/dao/redis/chatting/chatting.repository';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { Server, Socket } from 'socket.io';
import * as naughtyWords from 'naughty-words';
import {
  RoomInfo,
  UserData,
  OutgoingChatMessageDto,
  UserSessionData,
  RoomLeftEvent,
  UserJoinedEvent,
  RoomJoinedEvent,
  RoomUsersResponse,
} from './interfaces/chat.interface';
import { ChatEvent } from '../chatting-kafka/interfaces/chatting-kafka-event.interface';
import { ChattingKafkaProducerService } from '../chatting-kafka/chatting-kafka-producer.service';
import { EnvProvider } from '@libs/common/provider/env.provider';

@Injectable()
export class ChattingService {
  private readonly logger = new Logger(ChattingService.name);
  private readonly shortServerId = null;
  private server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly chattingRepository: ChattingRepository,
    private readonly chattingKafkaProducerService: ChattingKafkaProducerService,
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
      username: client.data.username,
      serverId: this.shortServerId,
    });
  }

  async producerDisconnectUser(socketId: string): Promise<boolean> {
    if (!socketId) return;

    const event =
      await this.chattingKafkaProducerService.publishUserDisconnect(socketId);

    if (!EnvProvider.isProd()) await this.consumerDisconnectUser(event);
  }

  async consumerDisconnectUser(event: ChatEvent): Promise<boolean> {
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
   * 다른 모든 룸에서 제거 및 정리
   */
  async producerLeaveRoom(client: Socket): Promise<void> {
    const roomId = client.data.currentRoom;
    if (!roomId) return;

    client.leave(roomId);
    client.data.currentRoom = null;

    await this.removeRoomUser(roomId, client.data.userId);

    // 퇴장한 클라이언트에게 성공 메시지
    const roomLeftEvent: RoomLeftEvent = {
      roomId: roomId,
      message: `채팅방 "${roomId}"에서 퇴장했습니다.`,
    };
    client.emit('room-left', roomLeftEvent);

    await this._cleanupEmptyRoom(client, String(roomId));

    const event = await this.chattingKafkaProducerService.publishRoomLeave(
      roomId,
      client.data.userId,
      client.data.username,
    );

    if (!EnvProvider.isProd()) await this.consumerLeaveRoom(event);
  }

  /**
   * 다른 모든 룸에서 제거 및 정리
   */
  async consumerLeaveRoom(event: ChatEvent): Promise<void> {
    const { roomId, userId, username } = event;

    this.server.to(roomId).emit('user-left', {
      userId: userId,
      username: username,
      roomId: roomId,
      message: `${username}가 채팅방을 떠났습니다.`,
    });
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

  /**
   * 룸 정보 삭제
   */
  async deleteRoomInfo(roomId: string): Promise<void> {
    try {
      const roomKey = `room:${roomId}`;
      await this.chattingRepository.del(roomKey);
      this.logger.log(`룸 정보 삭제: roomId=${roomId}`);
    } catch (error) {
      this.logger.error(`룸 정보 삭제 실패: ${error.message}`);
    }
  }

  /**
   * 룸 비밀번호 삭제
   */
  async deleteRoomPassword(roomId: string): Promise<void> {
    try {
      const roomPasswordKey = `room:${roomId}:password`;
      await this.chattingRepository.del(roomPasswordKey);
      this.logger.log(`Deleted room password: ${roomId}`);
    } catch (error) {
      this.logger.error(`Failed to delete room password: ${error.message}`);
    }
  }

  /**
   * 룸 사용자 제거 (Redis JSON 배열)
   */
  async removeRoomUser(roomId: string, userId: string): Promise<void> {
    try {
      const key = `room:${roomId}:users`;
      const current = await this.chattingRepository.get(key);
      if (!current) return;

      let list: UserData[] = [];
      try {
        list = JSON.parse(current);
      } catch (_) {
        list = [];
      }
      const next = list.filter((u) => String(u.userId) !== String(userId));
      if (next.length === 0) {
        await this.chattingRepository.del(key);
      } else {
        await this.chattingRepository.setex(key, 3600, JSON.stringify(next));
      }
    } catch (error) {
      this.logger.error(`Failed to remove room user: ${error.message}`);
    }
  }

  /**
   * 룸 사용자 목록 가져오기 (Redis JSON 배열)
   */
  async getRoomUsers(
    client: Socket,
    roomId: string,
  ): Promise<{ userId: string; username: string }[]> {
    const key = `room:${roomId}:users`;
    const current = await this.chattingRepository.get(key);
    let list: UserData[] = [];
    if (current) {
      try {
        list = JSON.parse(current);
      } catch (_) {
        list = [];
      }
    }
    const roomUsers = list.map((u) => ({
      userId: String(u.userId),
      username: u.username || `User-${String(u.userId).slice(0, 6)}`,
    }));

    const roomUsersResponse: RoomUsersResponse = {
      roomId,
      users: roomUsers,
    };

    client.emit('room-users', roomUsersResponse);

    return roomUsers;
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
    if (!payload) return null;

    client.data.userId = payload.userId;
    client.data.email = payload.email;
    client.data.username = `User-${payload.userId}`;

    return payload;
  }

  /**
   * 룸 비밀번호 확인/저장, 룸 정보 저장. 새 룸 여부 반환
   */
  async ensureRoomWithPassword(
    client: any,
    roomId: string,
    password: string,
  ): Promise<{ isExist: boolean; ok: boolean }> {
    const storedPassword = await this._getRoomPassword(roomId);

    const isExist = storedPassword !== null;

    if (isExist) {
      if (password !== storedPassword) {
        client.emit('error', { message: '비밀번호가 올바르지 않습니다.' });
        return { isExist, ok: false };
      }

      return { isExist, ok: true };
    }

    if (!password || password.trim() === '') {
      client.emit('error', {
        message: '새 룸을 생성하려면 비밀번호를 입력해주세요.',
      });
      return { isExist, ok: false };
    }

    await this._saveRoomPassword(roomId, password);

    const roomData = {
      roomId,
      password,
      createdBy: client.data.userId,
      createdByEmail: client.data.email,
    };

    await this._saveRoomInfo(roomId, roomData);

    return { isExist, ok: true };
  }

  /**
   * 룸 입장 후 클라이언트 데이터 세팅 및 Redis 반영
   */
  async producerJoinRoom(
    client: any,
    roomId: string,
    isExist: boolean,
  ): Promise<void> {
    client.join(roomId);

    client.data.username = `User-${client.data.userId}`;
    client.data.currentRoom = roomId;

    await this._saveRoomUser(
      roomId,
      client.data.userId || client.id,
      client.data.username,
    );

    // 입장한 클라이언트에게 성공 메시지
    const roomJoinedEvent: RoomJoinedEvent = {
      roomId: roomId,
      username: client.data.username,
      message: isExist
        ? `채팅방 "${roomId}"에 입장했습니다.`
        : `채팅방 "${roomId}"에 입장했습니다. (새 룸이 생성되었습니다)`,
    };
    client.emit('room-joined', roomJoinedEvent);

    if (!isExist) return;

    // Kafka 에 룸 입장 이벤트 발행
    const event = await this.chattingKafkaProducerService.publishRoomJoin(
      client.id,
      roomId,
      client.data.userId,
      client.data.username,
    );

    if (!EnvProvider.isProd()) await this.consumerJoinRoom(event);
  }

  /**
   * 룸 입장 후 클라이언트 데이터 세팅 및 Redis 반영
   */
  async consumerJoinRoom(event: ChatEvent): Promise<void> {
    const { roomId, userId, socketId, username } = event;

    if (!this.server) {
      this.logger.error('Server instance not available for room join broadcasting');
      return;
    }

    // 룸의 다른 사용자들에게 입장 알림
    const userJoinedEvent: UserJoinedEvent = {
      userId: userId,
      username: username,
      roomId: roomId,
      message: `${username}님이 방에 입장했습니다.`,
    };

    this.server
      .to(roomId)
      .except(socketId)
      .emit('user-joined', userJoinedEvent);
    
    this.logger.log(`Room join broadcasted via Socket.IO: ${roomId} - ${userId}`);
  }

  /**
   * 메시지 DTO 생성 (텍스트 전처리 포함)
   */
  async producerChatMessage(
    client: Socket,
    text: string,
    username?: string,
  ): Promise<void> {
    if (!this._checkChatMessage(client)) return;

    const roomId = client.data.currentRoom;

    const processed = this._handleMessage(text);

    const chatMessageDto = {
      id: Date.now(),
      userId: client.id,
      username:
        username ||
        client.data.username ||
        `User-${String(client.id).slice(0, 6)}`,
      roomId,
      message: processed,
      timestamp: new Date().toISOString(),
    } as OutgoingChatMessageDto;

    // Kafka 에 메시지 이벤트 발행
    const event = await this.chattingKafkaProducerService.publishMessage(
      roomId,
      chatMessageDto,
    );

    if (!EnvProvider.isProd()) await this.consumerChatMessage(event);
  }

  async consumerChatMessage(event: ChatEvent): Promise<void> {
    const { roomId, messageData } = event;

    if (!this.server) {
      this.logger.error('Server instance not available for batch-message broadcasting');
      return;
    }

    this.server.to(roomId).emit('message', messageData);
    this.logger.log(`Message broadcasted via Socket.IO: ${roomId} - ${messageData.userId}`);
  }


  /**
   * 룸 비밀번호 저장
   */
  private async _saveRoomPassword(
    roomId: string,
    password: string,
  ): Promise<void> {
    const roomPasswordKey = `room:${roomId}:password`;

    await this.chattingRepository.setex(roomPasswordKey, 3600, password); // 1시간 TTL
  }

  /**
   * 룸 비밀번호 가져오기
   */
  private async _getRoomPassword(roomId: string): Promise<string> {
    const roomPasswordKey = `room:${roomId}:password`;

    return await this.chattingRepository.get(roomPasswordKey);
  }

  private _checkChatMessage(client: Socket): boolean {
    // client.data에서 현재 룸 ID 가져오기
    const roomId = client.data.currentRoom;

    if (!roomId) {
      client.emit('error', {
        message: '룸에 입장하지 않았습니다.',
      });
      return false;
    }

    // 클라이언트가 해당 룸에 있는지 확인
    if (!client.rooms.has(roomId)) {
      client.emit('error', {
        message: '해당 룸에 입장하지 않았습니다.',
      });
      return false;
    }

    return true;
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

      await this.chattingRepository.setex(
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
      const userData = await this.chattingRepository.get(userKey);

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
   * 사용자 데이터 삭제
   */
  private async _deleteUserData(userId: number): Promise<void> {
    const userKey = `user:${userId}:data`;
    await this.chattingRepository.del(userKey);
  }

  /**
   * 룸 정보 저장 (JWT 기반 사용자 정보 포함)
   */
  private async _saveRoomInfo(roomId: string, roomData: any): Promise<void> {
    const roomKey = `room:${roomId}`;
    const roomInfo: RoomInfo = {
      ...roomData,
      createdAt: new Date().toISOString(),
      userCount: 0,
    };

    await this.chattingRepository.setex(
      roomKey,
      3600, // 1시간 TTL
      JSON.stringify(roomInfo),
    );
  }

  /**
   * 룸이 비어 있으면 비밀번호/정보 정리
   */
  private async _cleanupEmptyRoom(
    client: Socket,
    roomId: string,
  ): Promise<void> {
    const users = await this.getRoomUsers(client, roomId);

    if (users.length === 0) {
      await this.deleteRoomPassword(roomId);
      await this.deleteRoomInfo(roomId);
    }
  }

  /**
   * 메시지 필터링 처리
   */
  private _filterMessage(text: string): {
    isFiltered: boolean;
    filteredText: string;
  } {
    let filteredText = text;
    let isFiltered = false;

    // 모든 언어의 금칙어 목록을 합쳐서 검사
    const allBadWords = [
      ...naughtyWords.en,
      ...naughtyWords.ko,
      ...naughtyWords.ja,
      ...naughtyWords.zh,
    ];

    // 금칙어 검사 및 대체
    for (const badWord of allBadWords) {
      if (filteredText.toLowerCase().includes(badWord.toLowerCase())) {
        const regex = new RegExp(badWord, 'gi');
        filteredText = filteredText.replace(regex, '*'.repeat(badWord.length));
        isFiltered = true;
      }
    }

    return {
      isFiltered: isFiltered,
      filteredText: filteredText,
    };
  }

  /**
   * 메시지 처리 - 필터링 포함
   */
  private _handleMessage(text: string): string {
    const trimmed = (text ?? '').toString().trim();
    if (!trimmed) return '';

    // 금칙어 필터링
    const { isFiltered, filteredText } = this._filterMessage(trimmed);

    if (isFiltered) {
      this.logger.warn(`Filtered message: "${trimmed}" -> "${filteredText}"`);
    }

    return filteredText;
  }

  /**
   * 룸 사용자 저장 (Redis JSON 배열)
   * - room:{roomId}:users => JSON.stringify(UserData[])
   */
  private async _saveRoomUser(
    roomId: string,
    userId: string,
    username: string,
  ): Promise<void> {
    const key = `room:${roomId}:users`;
    const current = await this.chattingRepository.get(key);
    let list: UserData[] = [];

    if (current) {
      try {
        list = JSON.parse(current);
      } catch (_) {
        list = [];
      }
    }

    const now = new Date().toISOString();
    const without = list.filter((u) => String(u.userId) !== String(userId));

    without.push({ userId: String(userId), username, joinedAt: now });
    await this.chattingRepository.setex(key, 3600, JSON.stringify(without));
  }
}
