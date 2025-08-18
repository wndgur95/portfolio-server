import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class IdeaDoItDto extends ExcludeBaseTimeDto<IdeaDoItDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ideaId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  doIt: boolean;
}
