import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestFriendInDto {
  @ApiProperty()
  @IsString()
  recommendCode: string;
}
