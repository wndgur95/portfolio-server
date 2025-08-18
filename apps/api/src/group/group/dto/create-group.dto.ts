import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { Group } from '@libs/dao/common/groups/interfaces/group.interface';
import { GroupMember } from '@libs/dao/common/group-members/interfaces/group-member.interface';

export class CreateGroupInDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  desc: string;

  @ApiProperty()
  image?: string;
}

export class CreateGroupOutDto extends BaseOutDto {
  @ApiProperty()
  group: Group;

  @ApiProperty()
  groupMember: GroupMember;
}
