import { ApiProperty } from '@nestjs/swagger';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetUserDetailOutDto extends BaseOutDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  userDetail: UserDetail;
}
