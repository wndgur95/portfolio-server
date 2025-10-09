import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ImportLogTypeInDto {
  @ApiProperty()
  @IsNumber()
  toBlockNumber: number;

  @ApiProperty()
  @IsNumber()
  topicType: number;
}
