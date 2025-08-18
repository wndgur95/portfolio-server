import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class DeveloperNoteDto extends ExcludeBaseTimeDto<DeveloperNoteDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  functionalImprovement?: string;

  @ApiProperty()
  futurePlan?: string;

  @ApiProperty()
  developerMessage?: string;

  @ApiProperty()
  startAt: Date;
}
