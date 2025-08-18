import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { Type } from 'class-transformer';

export class GetExpenditureCalendarInDto {
  @ApiProperty()
  @Type(() => Number)
  groupId: number;

  @ApiProperty()
  @Type(() => Number)
  groupMemberId: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  year: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  month: number;
}

export class AmountDto extends BaseOutDto {
  @ApiProperty()
  addAmount = 0;

  @ApiProperty()
  subAmount = 0;
}

export class GetExpenditureCalendarOutDto extends BaseOutDto {
  @ApiProperty()
  amountByDay: Record<string, AmountDto>;

  @ApiProperty()
  totalAmount: number;
}
