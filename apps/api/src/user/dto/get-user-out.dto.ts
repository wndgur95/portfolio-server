import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { Session } from '@libs/dao/redis/session/session.entity';

export class GetUserOutDto extends BaseOutDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  userDetail: UserDetail;

  @ApiProperty()
  session: Session;
}
