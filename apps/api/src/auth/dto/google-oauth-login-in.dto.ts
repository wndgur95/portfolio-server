import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleOauthLoginInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
