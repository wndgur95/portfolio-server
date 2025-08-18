import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { GroupMemberRoles } from '@libs/common/constants/role.constants';

@EntitySerializeImpl()
export class GroupMemberDto extends ExcludeBaseTimeDto<GroupMemberDto> {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  groupId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  role: GroupMemberRoles;

  @ApiProperty()
  @IsDate()
  signUpAt: Date;
}
