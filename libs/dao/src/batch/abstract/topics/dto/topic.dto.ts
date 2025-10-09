import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export abstract class TopicDto<T> extends ExcludeBaseTimeDto<T> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  topic: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contractId: number;

  @ApiProperty()
  topicType: number;

  @ApiProperty()
  enable: number;

  protected constructor(partial?: Partial<T>) {
    super();
    Object.assign(this, partial);
  }
}
