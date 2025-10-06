import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Web3VerifyInDto {
  @ApiProperty()
  @IsString()
  challenge: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  signature: string;
}
