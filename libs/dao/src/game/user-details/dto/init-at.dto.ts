import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@libs/dao/base/base.dto';
import { InitAt } from '@libs/dao/game/user-details/type/init-at';

export class InitAtDto extends BaseDto<InitAt> {
  @ApiProperty()
  daily: Date;
}
