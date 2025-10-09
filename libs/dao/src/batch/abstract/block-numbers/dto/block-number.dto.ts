import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export abstract class BlockNumberDto<T> extends ExcludeBaseTimeDto<T> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  blockNumber: number;

  @ApiProperty()
  topicType: number;

  protected constructor(partial: Partial<T>) {
    super();
    Object.assign(this, partial);
  }
}
