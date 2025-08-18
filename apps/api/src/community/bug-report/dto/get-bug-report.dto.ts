import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { BugStatus, BugType } from '@libs/common/constants/community.constants';

export class GetBugReportOutDto extends BaseOutDto {
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
