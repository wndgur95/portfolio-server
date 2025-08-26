import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleOauthLoginInDto {
  @ApiProperty()
  @IsString()
  code: string;
}
