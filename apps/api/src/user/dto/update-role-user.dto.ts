import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserRoles } from '@libs/common/constants/role.constants';

export class UpdateRoleUserDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  roles: UserRoles;
}
