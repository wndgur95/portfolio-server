import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetContractInDto {
  @ApiProperty()
  @IsString()
  name: string;
}
