// Kafka 이벤트 타입 정의
export const BATCH_MESSAGE_TYPE = {
  USER_DISCONNECT: 'user-disconnect',
  AIRDROP_COIN: 'airdrop-coin',
  ERC1155_CLAIM: 'erc1155-claim',
};
export type BatchMessageType =
  (typeof BATCH_MESSAGE_TYPE)[keyof typeof BATCH_MESSAGE_TYPE];

export type MessageEventType = BatchMessageEvent | AirdropMessageEvent | Erc1155ClaimMessageEvent;

// Kafka 이벤트 인터페이스 정의
export interface BatchMessageEvent {
  type: BatchMessageType;
  userId?: string | number;
  address?: string;
  message?: string;
  socketId?: string;
  timestamp: string;
  serverId: string;
}

// Kafka 이벤트 인터페이스 정의
export interface AirdropMessageEvent {
  type: BatchMessageType;
  socketIds?: string[];
  message?: string;
  timestamp: string;
  serverId: string;
}

export interface Erc1155ClaimMessageEvent {
  type: BatchMessageType;
  socketIds?: string[];
  message?: string;
  timestamp: string;
  serverId: string;
}
