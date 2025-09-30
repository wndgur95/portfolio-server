import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CharacterFilterDto } from './dto/character-filter.dto';
import { QueryFilter } from '../decorator/query-filter.decorator';
import { PaginationInDto } from '@libs/common/dto/pagination-in.dto';
import { CharacterService } from './character.service';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

@ApiTags('Character')
@Controller('admin/character')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@ApiSecurity('selected-user-id')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('')
  @ApiOperation({
    summary: '유저 캐릭터 조회',
    description: '유저 캐릭터 정보를 반환합니다.',
  })
  @ApiQuery({ name: 'filter', type: CharacterFilterDto, required: false })
  async getCharacters(
    @QueryFilter() paginationDto: PaginationInDto<CharacterFilterDto>,
  ): Promise<ResponseEntity<Character[]>> {
    const [characters, paginationOutDto] =
      await this.characterService.getCharacters(paginationDto);

    return ResponseEntity.ok().pagination(paginationOutDto).body(characters);
  }
}
