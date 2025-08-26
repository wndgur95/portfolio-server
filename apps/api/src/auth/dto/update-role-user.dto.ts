import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@libs/common/constants/role.constants';

export class UpdateRoleUserDto {
  @ApiProperty()
  roles: UserRoles;
}
