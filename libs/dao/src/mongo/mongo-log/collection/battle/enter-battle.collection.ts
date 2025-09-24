import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { BattleInfoDto } from '@libs/dao/redis/solo-battle/dto/battle-info.dto';

export class EnterBattleCollection extends BaseMongoLogCollection {
  @ApiProperty()
  battleInfo: BattleInfoDto;

  constructor(partial?: Partial<EnterBattleCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
