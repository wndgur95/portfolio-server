import { ApiProperty } from '@nestjs/swagger';

export class UpdateIdeaCommentInDto {
  @ApiProperty()
  commenter: string;

  @ApiProperty()
  comment: string;
}
