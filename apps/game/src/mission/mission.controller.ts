import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { MissionService } from './mission.service';
import { MissionDto } from '@libs/dao/game/missions/dto/mission.dto';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { ReceiveRewardInDto } from './dto/receive-reward-in.dto';
import { ReceiveRewardOutDto } from './dto/receive-reward-out.dto';
import { ENVIRONMENT, NODE_ENV } from '@libs/common/constants/environment.constants';

@Controller('game/mission')
@ApiTags('Mission')
@Auth()
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post('test')
  @ApiResponseEntity({
    summary: '테스트',
  })
  async testMission(): Promise<ResponseEntity<unknown>> {
    if (NODE_ENV != ENVIRONMENT.TEST) return ResponseEntity.ok().build();

    await this.missionService.testMission();

    return ResponseEntity.ok().build();
  }

  @Post('get')
  @ApiResponseEntity({
    type: MissionDto,
    isArray: true,
    summary: '미션 정보',
  })
  async getMissions(): Promise<ResponseEntity<Mission[]>> {
    const missions = await this.missionService.getMissions();

    return ResponseEntity.ok().body(missions);
  }

  @Post('receive-reward')
  @ApiResponseEntity({ type: ReceiveRewardOutDto, summary: '미션 보상 받기' })
  @UserLevelLock()
  async receiveReward(
    @Body() receiveRewardInDto: ReceiveRewardInDto,
  ): Promise<ResponseEntity<ReceiveRewardOutDto>> {
    const rewardMissionOutDto =
      await this.missionService.receiveReward(receiveRewardInDto);

    return ResponseEntity.ok().body(rewardMissionOutDto);
  }
}
