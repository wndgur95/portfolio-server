import { ApiProperty } from '@nestjs/swagger';
import { GroupMember } from '@libs/dao/common/group-members/interfaces/group-member.interface';
import { Group } from '@libs/dao/common/groups/interfaces/group.interface';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetGroupOutDto extends BaseOutDto {
  @ApiProperty()
  groups: Group[];

  @ApiProperty()
  groupMembers: GroupMember[];
}
