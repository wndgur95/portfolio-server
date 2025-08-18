import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class KnowHowCommentDto extends ExcludeBaseTimeDto<KnowHowCommentDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  knowHowId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  commenter: string;

  @ApiProperty()
  comment: string;
}
