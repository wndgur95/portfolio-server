import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';

export class GachaCollection extends BaseMongoLogCollection {
  @ApiProperty()
  goods: GoodsOutDto;

  constructor(partial?: Partial<GachaCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
