import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty, Length } from 'class-validator';
import { BugStatus, BugType } from '@libs/common/constants/community.constants';

@EntitySerializeImpl()
export class BugReportDto extends ExcludeBaseTimeDto<BugReportDto> {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsString()
  type: BugType;

  @ApiProperty()
  @IsString()
  status: BugStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  contexts: string;
}
