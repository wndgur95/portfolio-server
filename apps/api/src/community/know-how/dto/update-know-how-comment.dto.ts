import { ApiProperty } from '@nestjs/swagger';

export class UpdateKnowHowCommentInDto {
  @ApiProperty()
  commenter: string;

  @ApiProperty()
  comment: string;
}
