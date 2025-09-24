import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

export class PayCharacterCollection extends BaseMongoLogCollection {
  @ApiProperty()
  character: Character;

  constructor(partial?: Partial<PayCharacterCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
