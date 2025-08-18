import { ApiProperty } from '@nestjs/swagger';

export class InviteGroupMemberInDto {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  friendId: number;
}
