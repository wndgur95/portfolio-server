import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { USER_ROLES, UserRoles } from '@libs/common/constants/role.constants';

export class TransactionInDto {
  @ApiProperty({ description: 'common 디비의 game 정보의 role 변경' })
  @IsIn(Object.values(USER_ROLES))
  @IsNotEmpty()
  role: UserRoles;

  @ApiProperty({ description: 'game 디비의 userDetail 정보의 골드 변경' })
  @IsNumber()
  @IsNotEmpty()
  gold: number;

  @ApiProperty({ description: 'error 포인트' })
  @IsNumber()
  errorPoint?: number;
}
