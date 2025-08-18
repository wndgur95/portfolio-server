import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class RouletteDto extends ExcludeBaseTimeDto<RouletteDto> {
  @ApiProperty()
  bride: number;

  @ApiProperty()
  groom: number;

  @ApiProperty()
  pool: string;

  @ApiProperty()
  exception: string;
}
