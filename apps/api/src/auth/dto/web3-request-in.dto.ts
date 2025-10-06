import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Web3RequestInDto {
  @ApiProperty()
  @IsString()
  address: string;
}
