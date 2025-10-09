// Kafka 이벤트 타입 정의
export const CHAT_EVENT_TYPE = {
  ROOM_JOIN: 'room-join',
  ROOM_LEAVE: 'room-leave',
  MESSAGE_SEND: 'message-send',
  USER_DISCONNECT: 'user-disconnect',
};
export type ChatEventType =
  (typeof CHAT_EVENT_TYPE)[keyof typeof CHAT_EVENT_TYPE];

// Kafka 이벤트 인터페이스 정의
export interface ChatEvent {
  type: ChatEventType;
  roomId?: string;
  userId?: string;
  username?: string;
  messageData?: any;
  socketId?: string;
  timestamp: string;
  serverId: string;
}
