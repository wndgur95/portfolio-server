import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetApiKeyOutDto extends BaseOutDto {
  @ApiProperty()
  apiKey: string;
}
