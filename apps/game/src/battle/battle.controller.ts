import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { BattleEnterOutDto } from './dto/battle-enter-out.dto';
import { BattleEnterInDto } from './dto/battle-enter-in.dto';
import { BattleService } from './battle.service';
import { BattleFinishInDto } from './dto/battle-finish-in.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { BattleFinishOutDto } from './dto/battle-finish-out.dto';
import { GetSoloRankingOutDto } from './dto/get-solo-ranking-out.dto';
import { GetSoloRankingInDto } from './dto/get-solo-ranking-in.dto';

@Controller('game/socket')
@ApiTags('Battle')
@Auth()
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post('solo/enter')
  @ApiResponseEntity({
    type: BattleEnterOutDto,
    summary: '전투 입장',
  })
  @UserLevelLock()
  async enterBattle(
    @Body() battleEnterInDto: BattleEnterInDto,
  ): Promise<ResponseEntity<BattleEnterOutDto>> {
    const battleEnterOutDto =
      await this.battleService.enterBattle(battleEnterInDto);

    return ResponseEntity.ok().body(battleEnterOutDto);
  }

  @Post('solo/finish')
  @ApiResponseEntity({
    type: BattleFinishOutDto,
    summary: '전투 종료',
  })
  @UserLevelLock()
  async finishBattle(
    @Body() battleFinishInDto: BattleFinishInDto,
  ): Promise<ResponseEntity<BattleFinishOutDto>> {
    const battleFinishOutDto =
      await this.battleService.finishBattle(battleFinishInDto);

    return ResponseEntity.ok().body(battleFinishOutDto);
  }

  @Post('solo/ranking/get')
  @ApiResponseEntity({
    type: GetSoloRankingOutDto,
    summary: '솔로 랭킹',
  })
  async getSoloRanking(
    @Body() getSoloRankingInDto: GetSoloRankingInDto,
  ): Promise<ResponseEntity<GetSoloRankingOutDto>> {
    const getSoloRankingOutDto =
      await this.battleService.getSoloRanking(getSoloRankingInDto);

    return ResponseEntity.ok().body(getSoloRankingOutDto);
  }

  @Post('multi/ranking/get')
  @ApiResponseEntity({
    type: GetSoloRankingOutDto,
    summary: '솔로 랭킹',
  })
  async getMultiRanking(
    @Body() getSoloRankingInDto: GetSoloRankingInDto,
  ): Promise<ResponseEntity<GetSoloRankingOutDto>> {
    return ResponseEntity.ok().body(GetSoloRankingOutDto.of({
      totalCount: 0,
      myRanking: null,
      ranking: [],
    }));
  }
}
