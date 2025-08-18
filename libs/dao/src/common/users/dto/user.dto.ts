import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRoles } from '@libs/common/constants/role.constants';

@EntitySerializeImpl()
export class UserDto extends ExcludeBaseTimeDto<UserDto> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  recommendCode: string;

  @ApiProperty()
  email?: string;

  @Exclude()
  password?: string;

  @ApiProperty()
  platformId?: string;

  @ApiProperty()
  roles: UserRoles;

  @ApiProperty()
  activatedAt: Date;

  @ApiProperty()
  image: string;

  @ApiProperty()
  userDbId: number;

  @ApiProperty()
  provider?: string;
}
