import { Module } from '@nestjs/common';
import { UserDetailsModule } from '@libs/dao/game/user-details/user-details.module';
import { CharactersModule } from '@libs/dao/game/characters/characters.module';
import { BattlesModule } from '@libs/dao/game/battles/battles.module';

@Module({
  exports: [UserDetailsModule, CharactersModule, BattlesModule],
  imports: [UserDetailsModule, CharactersModule, BattlesModule],
})
export class GameModule {}
