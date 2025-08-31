import { Module } from '@nestjs/common';
import { UserDetailsModule } from '@libs/dao/game/user-details/user-details.module';
import { CharactersModule } from '@libs/dao/game/characters/characters.module';

@Module({
  exports: [UserDetailsModule, CharactersModule],
  imports: [UserDetailsModule, CharactersModule],
})
export class GameModule {}
