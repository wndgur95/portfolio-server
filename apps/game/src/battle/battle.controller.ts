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

@Controller('game/battle')
@ApiTags('Battle')
@Auth()
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post('enter')
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

  @Post('finish')
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
}
