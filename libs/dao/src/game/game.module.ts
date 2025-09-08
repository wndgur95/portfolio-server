import { Module } from '@nestjs/common';
import { UserDetailsModule } from '@libs/dao/game/user-details/user-details.module';
import { CharactersModule } from '@libs/dao/game/characters/characters.module';
import { BattlesModule } from '@libs/dao/game/battles/battles.module';
import { MissionsModule } from '@libs/dao/game/missions/missions.module';

@Module({
  exports: [UserDetailsModule, CharactersModule, BattlesModule, MissionsModule],
  imports: [UserDetailsModule, CharactersModule, BattlesModule, MissionsModule],
})
export class GameModule {}
