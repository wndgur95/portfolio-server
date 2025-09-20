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

@Injectable()
export class ChattingService {
  private readonly logger = new Logger(ChattingService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly chattingRepository: ChattingRepository,
    private readonly kafkaProducer: ChattingKafkaProducerService,
  ) {}

  async connectUser(payload: JwtPayload, client: Socket): Promise<void> {
    await this._saveUserData(payload.id, client.id, payload);

    // Kafka에 사용자 연결 이벤트 발행
    await this.kafkaProducer.publishUserConnect(
      String(client.data.userId),
      client.data.email || client.data.username,
    );

    // 연결 성공 이벤트 전송 (동일 포맷)
    client.emit('authenticated', {
      userId: payload.id,
      username: client.data.username,
    });
  }

  /**
   * 기존 연결 해제 (Redis 기반)
   */
  async disconnectExistingConnection(
    server: Server,
    userId: number,
  ): Promise<boolean> {
    if (!userId) return;
    try {
      const existingSocketId = await this._getExistingSocketId(userId);
      if (!existingSocketId) {
        return false; // 기존 연결 없음
      }

      const fetched = await server.fetchSockets();

      const existingSocket =
        fetched.find((s: any) => s.id === existingSocketId) || null;

      if (existingSocket) {
        this.logger.log(
          `기존 연결 발견: userId=${userId}, socketId=${existingSocketId}`,
        );
        existingSocket.emit('error', {
          message: '다른 위치에서 로그인되어 기존 연결이 종료됩니다.',
        });
        existingSocket.disconnect(true);
        this.logger.log(
          `기존 연결 해제 완료: userId=${userId}, socketId=${existingSocketId}`,
        );
        return true;
      } else {
        // 소켓이 서버에 없으면 Redis 데이터만 정리
        await this._deleteUserData(userId);
        this.logger.log(
          `기존 소켓이 서버에 없어 Redis 데이터만 정리: userId=${userId}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`기존 연결 해제 실패: ${error.message}`);
      return false;
    }
  }

  /**
   * 사용자 데이터 삭제
   */
  async disconnectUser(client: Socket): Promise<void> {
    if (!client.data.userId) return;

    await this._deleteUserData(client.data.userId);

    // Kafka에 사용자 연결 해제 이벤트 발행
    await this.kafkaProducer.publishUserDisconnect(
      client.data.userId.toString(),
    );
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
   * 룸 비밀번호 저장
   */
  async saveRoomPassword(roomId: string, password: string): Promise<void> {
    try {
      const roomPasswordKey = `room:${roomId}:password`;
      await this.chattingRepository.setex(roomPasswordKey, 3600, password); // 1시간 TTL
      this.logger.log(`Saved room password: ${roomId}`);
    } catch (error) {
      this.logger.error(`Failed to save room password: ${error.message}`);
    }
  }

  /**
   * 룸 비밀번호 가져오기
   */
  private async _getRoomPassword(roomId: string): Promise<string> {
    const roomPasswordKey = `room:${roomId}:password`;

    return await this.chattingRepository.get(roomPasswordKey);
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
      if (!current) {
        this.logger.log(`No room users key for room ${roomId}`);
        return;
      }
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
      this.logger.log(
        `Removed user from room (Redis-JSON): roomId=${roomId}, userId=${userId}`,
      );
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
    this.logger.log(`Getting room users for room: ${roomId}`);

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

    this.logger.log(`Found ${roomUsers.length} users in room ${roomId}`);

    const roomUsersResponse: RoomUsersResponse = {
      roomId,
      users: roomUsers,
    };

    this.logger.log(
      `Sending room users response: ${JSON.stringify(roomUsersResponse)}`,
    );
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

    client.data.userId = payload.id;
    client.data.email = payload.email;
    client.data.username = `User-${payload.id}`;

    return payload;
  }

  /**
   * 룸 비밀번호 확인/저장, 룸 정보 저장. 새 룸 여부 반환
   */
  async ensureRoomWithPassword(
    client: any,
    roomId: string,
    password: string,
  ): Promise<{ roomExists: boolean; ok: boolean }> {
    const storedPassword = await this._getRoomPassword(roomId);

    const roomExists = storedPassword !== null;
    if (roomExists) {
      if (password !== storedPassword) {
        client.emit('error', { message: '비밀번호가 올바르지 않습니다.' });
        return { roomExists, ok: false };
      }

      return { roomExists, ok: true };
    }

    if (!password || password.trim() === '') {
      client.emit('error', {
        message: '새 룸을 생성하려면 비밀번호를 입력해주세요.',
      });
      return { roomExists, ok: false };
    }

    await this.saveRoomPassword(roomId, password);

    const roomData = {
      roomId,
      password,
      createdBy: client.data.userId,
      createdByEmail: client.data.email,
    };

    await this._saveRoomInfo(roomId, roomData, client.data.userId);

    return { roomExists, ok: true };
  }

  /**
   * 다른 모든 룸에서 제거 및 정리
   */
  async leaveRoom(server: Server, client: Socket): Promise<void> {
    const roomId = client.data.currentRoom;
    if (!roomId) return;

    client.leave(roomId);
    client.data.currentRoom = null;

    await this.removeRoomUser(roomId, client.data.userId || client.id);

    if (server) {
      server.to(roomId).emit('user-left', {
        userId: client.id,
        username:
          client.data.username || `User-${String(client.id).slice(0, 6)}`,
        roomId: roomId,
        message: '사용자가 채팅방을 떠났습니다.',
      });
    }

    // 퇴장한 클라이언트에게 성공 메시지
    const roomLeftEvent: RoomLeftEvent = {
      roomId: roomId,
      message: `채팅방 "${roomId}"에서 퇴장했습니다.`,
    };
    client.emit('room-left', roomLeftEvent);

    await this._cleanupEmptyRoom(client, String(roomId));

    await this.kafkaProducer.publishRoomLeave(
      roomId,
      client.data.userId || client.id,
    );
  }

  /**
   * 룸 입장 후 클라이언트 데이터 세팅 및 Redis 반영
   */
  async joinRoom(
    client: any,
    roomId: string,
    roomExists: boolean,
  ): Promise<void> {
    client.join(roomId);

    client.data.username = `User-${client.data.userId}`;
    client.data.currentRoom = roomId;

    await this._saveRoomUser(
      roomId,
      client.data.userId || client.id,
      client.data.username,
    );

    this.logger.log(`Client ${client.id} joined room: ${roomId}`);

    // Kafka 에 룸 입장 이벤트 발행
    await this.kafkaProducer.publishRoomJoin(
      roomId,
      client.data.userId || client.id,
      client.data.username,
    );

    // 룸의 다른 사용자들에게 입장 알림
    const userJoinedEvent: UserJoinedEvent = {
      userId: client.id,
      username: client.data.username,
      roomId: roomId,
      message: `${client.data.username}님이 채팅방에 입장했습니다.`,
    };
    client.to(roomId).emit('user-joined', userJoinedEvent);

    // 입장한 클라이언트에게 성공 메시지
    const roomJoinedEvent: RoomJoinedEvent = {
      roomId: roomId,
      username: client.data.username,
      message: roomExists
        ? `채팅방 "${roomId}"에 입장했습니다.`
        : `채팅방 "${roomId}"에 입장했습니다. (새 룸이 생성되었습니다)`,
    };
    client.emit('room-joined', roomJoinedEvent);
  }

  /**
   * 메시지 DTO 생성 (텍스트 전처리 포함)
   */
  async chatMessage(
    server: Server,
    client: Socket,
    roomId: string,
    text: string,
    username?: string,
  ): Promise<void> {
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
    await this.kafkaProducer.publishMessage(roomId, chatMessageDto);

    // 해당 룸의 다른 사용자들에게만 메시지 전송 (자신 제외)
    server.to(roomId).emit('message', chatMessageDto);

    this.logger.log(`Message sent to room ${roomId} by ${client.id}: ${text}`);
  }

  // ===== Kafka 이벤트 처리 메서드들 =====

  /**
   * 원격 서버에서 온 룸 입장 이벤트 처리
   */
  async handleRemoteRoomJoin(event: ChatEvent, server: Server): Promise<void> {
    try {
      await this._saveRoomUser(event.roomId, event.userId, event.username);
      
      // Socket.IO로 룸 입장 브로드캐스트
      const userJoinedEvent: UserJoinedEvent = {
        userId: event.userId,
        username: event.username,
        roomId: event.roomId,
        message: `${event.username}님이 채팅방에 입장했습니다.`,
      };
      server.to(event.roomId).emit('user-joined', userJoinedEvent);
      
      this.logger.log(
        `Remote room join handled: ${event.roomId} - ${event.userId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to handle remote room join:`, error);
    }
  }

  /**
   * 원격 서버에서 온 룸 퇴장 이벤트 처리
   */
  async handleRemoteRoomLeave(event: ChatEvent, server: Server): Promise<void> {
    try {
      await this.removeRoomUser(event.roomId, event.userId);
      
      // Socket.IO로 룸 퇴장 브로드캐스트
      server.to(event.roomId).emit('user-left', {
        userId: event.userId,
        username: event.username || `User-${String(event.userId).slice(0, 6)}`,
        roomId: event.roomId,
        message: '사용자가 채팅방을 떠났습니다.',
      });
      
      this.logger.log(
        `Remote room leave handled: ${event.roomId} - ${event.userId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to handle remote room leave:`, error);
    }
  }

  /**
   * 원격 서버에서 온 메시지 이벤트 처리
   */
  async handleRemoteMessage(event: ChatEvent, server: Server): Promise<void> {
    try {
      // Socket.IO로 메시지 브로드캐스트
      server.to(event.roomId).emit('message', event.messageData);
      
      this.logger.log(
        `Remote message broadcasted: ${event.roomId} - ${event.userId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to handle remote message:`, error);
    }
  }

  /**
   * 원격 서버에서 온 사용자 연결 이벤트 처리
   */
  async handleRemoteUserConnect(event: ChatEvent): Promise<void> {
    try {
      this.logger.log(`Remote user connect handled: ${event.userId}`);
    } catch (error) {
      this.logger.error(`Failed to handle remote user connect:`, error);
    }
  }

  /**
   * 원격 서버에서 온 사용자 연결 해제 이벤트 처리
   */
  async handleRemoteUserDisconnect(event: ChatEvent): Promise<void> {
    try {
      this.logger.log(`Remote user disconnect handled: ${event.userId}`);
    } catch (error) {
      this.logger.error(`Failed to handle remote user disconnect:`, error);
    }
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
    try {
      const userKey = `user:${userId}:data`;
      await this.chattingRepository.del(userKey);
      this.logger.log(`사용자 데이터 삭제: userId=${userId}`);
    } catch (error) {
      this.logger.error(`사용자 데이터 삭제 실패: ${error.message}`);
    }
  }

  /**
   * 룸 정보 저장 (JWT 기반 사용자 정보 포함)
   */
  private async _saveRoomInfo(
    roomId: string,
    roomData: any,
    creatorUserId?: number,
  ): Promise<void> {
    try {
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
      this.logger.log(
        `룸 정보 저장: roomId=${roomId}, creatorUserId=${creatorUserId}`,
      );
    } catch (error) {
      this.logger.error(`룸 정보 저장 실패: ${error.message}`);
    }
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
    try {
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
      this.logger.log(
        `Saved user to room (Redis-JSON): roomId=${roomId}, userId=${userId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to save room user: ${error.message}`);
    }
  }
}
