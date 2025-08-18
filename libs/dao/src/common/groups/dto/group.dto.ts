import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

@EntitySerializeImpl()
export class GroupDto extends ExcludeBaseTimeDto<GroupDto> {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  image?: string;

  @ApiProperty()
  @IsNumber()
  memberCount: number;

  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  desc: string;

  @ApiProperty()
  groupDbId: number;

  @ApiProperty()
  createdAt: Date;
}
