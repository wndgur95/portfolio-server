import { ApiProperty } from '@nestjs/swagger';

export class UpdateKnowHowInDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;
}
