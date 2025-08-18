import { ApiProperty } from '@nestjs/swagger';
import { AmountType } from '@libs/common/constants/expenditure.constats';
import { Expenditure } from '@libs/dao/group/expenditures/interfaces/expenditure.interface';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class CreateExpenditureInDto {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  emoji: string;

  @ApiProperty()
  amountType: AmountType;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  expenditureAt: Date;
}

export class CreateExpenditureOutDto extends BaseOutDto {
  @ApiProperty()
  expenditure: Expenditure;
}
