import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { AmountType } from '@libs/common/constants/expenditure.constats';

@EntitySerializeImpl()
export class ExpenditureDto extends ExcludeBaseTimeDto<ExpenditureDto> {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  groupId: number;

  @ApiProperty()
  @IsNumber()
  groupMemberId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  emoji?: string;

  @ApiProperty()
  amountType: AmountType;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  desc: string;

  @ApiProperty()
  expenditureAt: Date;
}
