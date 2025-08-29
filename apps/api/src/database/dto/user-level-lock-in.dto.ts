import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserLevelLockInDto {
  @ApiProperty({ description: 'game 디비의 userDetail 정보의 role 변경' })
  @IsNumber()
  @IsNotEmpty()
  addGold: number;
}
