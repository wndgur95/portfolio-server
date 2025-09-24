import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';

export class ConsumeCurrencyCollection extends BaseMongoLogCollection {
  @ApiProperty()
  userDetail: UserDetail;

  constructor(partial?: Partial<ConsumeCurrencyCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
