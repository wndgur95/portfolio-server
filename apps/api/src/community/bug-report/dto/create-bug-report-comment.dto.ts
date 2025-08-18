import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { BugCommenter } from '@libs/common/constants/community.constants';

export class CreateBugReportCommentInDto {
  @ApiProperty()
  bugReportId: number;

  @ApiProperty()
  comment: string;
}

export class CreateBugReportCommentOutDto extends BaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bugReportId: number;

  @ApiProperty()
  commenter: BugCommenter;

  @ApiProperty()
  comment: string;
}
