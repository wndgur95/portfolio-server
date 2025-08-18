import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

@EntitySerializeImpl()
export class GroupInviteDto extends ExcludeBaseTimeDto<GroupInviteDto> {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  groupId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
