import { ApiProperty } from '@nestjs/swagger';
import { DateType } from '@libs/common/constants/expenditure.constats';
import { Expenditure } from '@libs/dao/group/expenditures/interfaces/expenditure.interface';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { Type } from 'class-transformer';

export class GetExpenditureInDto {
  @ApiProperty()
  @Type(() => Number)
  groupId: number;

  @ApiProperty()
  @Type(() => Number)
  groupMemberId: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  dateType?: DateType;

  @ApiProperty({ required: false })
  @Type(() => Number)
  year?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  month?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  week?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  day?: number;
}

export class GetExpenditureOutDto extends BaseOutDto {
  @ApiProperty()
  expenditures: Expenditure[];

  @ApiProperty()
  totalAmount: number;
}
