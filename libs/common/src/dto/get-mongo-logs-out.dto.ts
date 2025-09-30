import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetMongoLogsOutDto extends BaseOutDto {
  @ApiProperty()
  logs: any[];

  @ApiProperty()
  totalCount: number;
}
