import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestType } from '@libs/common/constants/friend.constants';

@EntitySerializeImpl()
export class FriendDto extends ExcludeBaseTimeDto<FriendDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  friendUserId: number;

  @ApiProperty()
  status: FriendRequestType;
}
