import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleFirebaseLoginInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
