import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BugCommenter } from '@libs/common/constants/community.constants';

@EntitySerializeImpl()
export class BugReportCommentDto extends ExcludeBaseTimeDto<BugReportCommentDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bugReportId: number;

  @ApiProperty()
  commenter: BugCommenter;

  @ApiProperty()
  comment: string;
}
