import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

export class AchieveCollection extends BaseMongoLogCollection {
  @ApiProperty()
  mission: Mission;

  constructor(partial?: Partial<AchieveCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
