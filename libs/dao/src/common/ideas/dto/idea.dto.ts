import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class IdeaDto extends ExcludeBaseTimeDto<IdeaDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;
}
