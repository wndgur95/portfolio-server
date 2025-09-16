import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { CharacterService } from './character.service';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { CharacterLevelUpInDto } from './dto/character-level-up-in.dto';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

@Controller('game/character')
@ApiTags('Character')
@Auth()
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post('get')
  @ApiResponseEntity({
    type: CharacterDto,
    isArray: true,
    summary: '캐릭터 정보',
  })
  async getCharacters(): Promise<ResponseEntity<CharacterDto[]>> {
    const characterDto = await this.characterService.getCharacters();

    return ResponseEntity.ok().body(characterDto);
  }

  @Post('level-up')
  @ApiResponseEntity({
    type: CharacterDto,
    summary: '캐릭터 레벨 업',
  })
  async levelUpCharacter(
    @Body() characterLevelUpInDto: CharacterLevelUpInDto,
  ): Promise<ResponseEntity<Character>> {
    const characterDto = await this.characterService.levelUpCharacter(
      characterLevelUpInDto,
    );

    return ResponseEntity.ok().body(characterDto);
  }
}
