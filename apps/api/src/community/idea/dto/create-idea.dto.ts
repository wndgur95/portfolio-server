import { ApiProperty } from '@nestjs/swagger';

export class CreateIdeaInDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;
}
