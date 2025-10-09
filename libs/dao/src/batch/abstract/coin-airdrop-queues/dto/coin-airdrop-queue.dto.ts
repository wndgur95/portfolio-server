import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LogStatus } from '@libs/common/constants/contract.contstants';

@EntitySerializeImpl()
export abstract class CoinAirdropQueueDto<T> extends ExcludeBaseTimeDto<T> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  status: LogStatus;

  @ApiProperty()
  receivedAt: Date;
}
