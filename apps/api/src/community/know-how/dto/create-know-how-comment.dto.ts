import { ApiProperty } from '@nestjs/swagger';

export class CreateKnowHowCommentInDto {
  @ApiProperty()
  knowHowId: number;

  @ApiProperty()
  commenter: string;

  @ApiProperty()
  comment: string;
}
