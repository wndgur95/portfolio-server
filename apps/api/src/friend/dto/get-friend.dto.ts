import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestType } from '@libs/common/constants/friend.constants';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetFriendOutDto extends BaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: FriendRequestType;

  @ApiProperty()
  image?: string;
}
