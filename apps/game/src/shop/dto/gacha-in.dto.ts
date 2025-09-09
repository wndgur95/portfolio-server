import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { IsNumber } from 'class-validator';

export class GachaInDto extends BaseOutDto {
  @ApiProperty()
  @IsNumber()
  dataGachaId: number;

  @ApiProperty()
  @IsNumber()
  count: number;
}
