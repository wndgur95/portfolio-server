import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetKnowHowCommentDto extends BaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ideaId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  commenter: string;

  @ApiProperty()
  comment: string;
}
