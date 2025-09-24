import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';
import { ApiProperty } from '@nestjs/swagger';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

export class CharacterLevelUpCollection extends BaseMongoLogCollection {
  @ApiProperty()
  character: Character;

  constructor(partial?: Partial<CharacterLevelUpCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
