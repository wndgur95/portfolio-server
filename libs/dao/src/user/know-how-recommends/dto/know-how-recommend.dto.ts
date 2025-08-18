import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class KnowHowRecommendDto extends ExcludeBaseTimeDto<KnowHowRecommendDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  knowHowId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  recommend: boolean;
}
