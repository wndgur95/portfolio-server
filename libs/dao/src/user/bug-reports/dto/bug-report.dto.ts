import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BugStatus, BugType } from '@libs/common/constants/community.constants';

@EntitySerializeImpl()
export class BugReportDto extends ExcludeBaseTimeDto<BugReportDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  type: BugType;

  @ApiProperty()
  status: BugStatus;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;
}
