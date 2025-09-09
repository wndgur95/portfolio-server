import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class SoloScoreDto extends ExcludeBaseTimeDto<SoloScoreDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  score: number;

  @ApiProperty()
  gameCount: number;

  @ApiProperty()
  dataCharacterId: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  lastBattleAt: Date;
}
