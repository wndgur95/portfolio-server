import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class MissionDto extends ExcludeBaseTimeDto<MissionDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  dataMissionId: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  rewardAt: Date;
}
