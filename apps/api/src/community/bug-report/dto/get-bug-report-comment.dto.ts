import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { BugCommenter } from '@libs/common/constants/community.constants';

export class GetBugReportCommentDto extends BaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bugReportId: number;

  @ApiProperty()
  commenter: BugCommenter;

  @ApiProperty()
  comment: string;
}
