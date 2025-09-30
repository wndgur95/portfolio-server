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
import { ArenaService } from './arena.service';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';
import { SoloBattleHistoryFilterDto } from './dto/solo-battle-history-filter.dto';
import { QueryFilter } from '../decorator/query-filter.decorator';
import { PaginationInDto } from '@libs/common/dto/pagination-in.dto';
import { SoloScoreHistory } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-history.interface';

@ApiTags('Arena')
@Controller('admin/arena')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@ApiSecurity('selected-user-id')
export class ArenaController {
  constructor(private readonly arenaService: ArenaService) {}

  @Get('')
  @ApiOperation({
    summary: '유저 최고 점수 조회',
    description: '유저 최고 점수 정보를 반환합니다.',
  })
  async getSoloBattleScore(): Promise<ResponseEntity<SoloScore>> {
    const soloScore = await this.arenaService.getSoloBattleScore();

    return ResponseEntity.ok().body(soloScore);
  }

  @Get('history')
  @ApiOperation({
    summary: '유저 점수 히스토리 조회',
    description: '유저 점수 히스토리 반환합니다.',
  })
  @ApiQuery({
    name: 'filter',
    type: SoloBattleHistoryFilterDto,
    required: false,
  })
  async getSoloBattleHistory(
    @QueryFilter() paginationDto: PaginationInDto<SoloBattleHistoryFilterDto>,
  ): Promise<ResponseEntity<SoloScoreHistory[]>> {
    const [soloScoreHistories, paginationOutDto] =
      await this.arenaService.getSoloBattleHistory(paginationDto);

    return ResponseEntity.ok()
      .pagination(paginationOutDto)
      .body(soloScoreHistories);
  }
}
