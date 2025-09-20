import { JwtPayload } from '@libs/common/constants/jwt.constants';

export interface JoinRoomDto {
  roomId: string;
  username?: string;
  password: string;
}

export interface LeaveRoomDto {
  roomId: string;
}

// 클라이언트에서 서버로 전송할 입력 DTO
export interface ChatMessageDto {
  message: string;
  username?: string;
}

export interface GetRoomUsersDto {
  roomId: string;
}

export interface UserInfo {
  userId: string;
  username: string;
}

export interface RoomUsersResponse {
  roomId: string;
  users: UserInfo[];
}

// 서버가 브로드캐스트하는 출력 DTO
export interface OutgoingChatMessageDto {
  id: number;
  userId: string;
  username: string;
  roomId: string;
  message: string;
  timestamp: string;
}

// 내부 저장용 모델들
export interface UserSessionData extends JwtPayload {
  socketId: string;
  connectedAt: string;
}

// 내부 저장용 모델들
export interface UserData {
  userId: string;
  username: string;
  joinedAt: string;
}

export interface RoomInfo {
  roomId: string;
  password: string;
  createdBy: number | string;
  createdByEmail?: string;
  createdAt: string;
  userCount: number;
}

export interface UserJoinedEvent {
  userId: string;
  username: string;
  roomId: string;
  message: string;
}

export interface UserLeftEvent {
  userId: string;
  username: string;
  roomId: string;
  message: string;
}

export interface RoomJoinedEvent {
  roomId: string;
  username: string;
  message: string;
}

export interface RoomLeftEvent {
  roomId: string;
  message: string;
}

export interface ErrorEvent {
  message: string;
}
