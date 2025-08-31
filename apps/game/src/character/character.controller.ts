import { ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { CharacterService } from './character.service';
import { CharacterDto } from '@libs/dao/game/characters/dto/character.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('game/character')
@ApiTags('Character')
@Auth()
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post('get')
  @ApiResponseEntity({ type: CharacterDto, isArray: true, summary: '캐릭터 정보' })
  async getCharacter(): Promise<ResponseEntity<CharacterDto[]>> {
    const characterDto = await this.characterService.getCharacter();

    return ResponseEntity.ok().body(characterDto);
  }
}
