import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestType } from '@libs/common/constants/friend.constants';

export class RequestResultFriendInDto {
  @ApiProperty()
  friendId: number;

  @ApiProperty()
  status: FriendRequestType;
}
