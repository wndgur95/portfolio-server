import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { USER_ROLES, UserRoles } from '@libs/common/constants/role.constants';

export class UpdateRoleUserDto {
  @ApiProperty()
  @IsIn(Object.values(USER_ROLES))
  @IsNotEmpty()
  roles: UserRoles;
}
