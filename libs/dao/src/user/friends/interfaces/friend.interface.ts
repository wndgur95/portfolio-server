import { Domain } from '@libs/common/domain/domain';
import { FriendRequestType } from '@libs/common/constants/friend.constants';

export interface Friend extends Domain {
  userId: number;
  friendUserId: number;
  status: FriendRequestType;
}
