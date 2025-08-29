import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RowLevelLockInDto {
  @ApiProperty({ description: 'id' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'common 디비의 test-table 정보의 count 변경' })
  @IsNumber()
  @IsNotEmpty()
  addCount: number;
}
