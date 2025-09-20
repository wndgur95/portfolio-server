// Kafka 이벤트 타입 정의
export type ChatEventType = 
  | 'room-join' 
  | 'room-leave' 
  | 'message-send' 
  | 'user-connect' 
  | 'user-disconnect';

// Kafka 이벤트 인터페이스 정의
export interface ChatEvent {
  type: ChatEventType;
  roomId?: string;
  userId: string;
  username?: string;
  messageData?: any;
  timestamp: string;
  serverId: string;
}
