import { ApiProperty } from '@nestjs/swagger';

export class CreateKnowHowInDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;
}
