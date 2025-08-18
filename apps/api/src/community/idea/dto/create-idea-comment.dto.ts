import { ApiProperty } from '@nestjs/swagger';

export class CreateIdeaCommentInDto {
  @ApiProperty()
  ideaId: number;

  @ApiProperty()
  commenter: string;

  @ApiProperty()
  comment: string;
}
