import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export abstract class ClaimErc1155LogDto<T> extends ExcludeBaseTimeDto<T> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  claimId: number;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  data: any;

  @ApiProperty()
  blockNumber: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  contractId: number;

  @ApiProperty()
  topicId: number;

  protected constructor(partial: Partial<T>) {
    super();
    Object.assign(this, partial);
  }
}
