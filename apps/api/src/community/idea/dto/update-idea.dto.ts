import { ApiProperty } from '@nestjs/swagger';

export class UpdateIdeaInDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;
}
