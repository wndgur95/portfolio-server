import { IsString } from 'class-validator';
import { BattleInfoDto } from '@libs/dao/redis/solo-battle/dto/battle-info.dto';
import { PlayStatus } from '@libs/dao/static/common.constants';

export namespace SoloBattleDto {
  export class JoinBattleDto {
    @IsString()
    battleId: string;

    @IsString()
    userId: string;
  }

  export class LeaveBattleDto {
    @IsString()
    battleId: string;

    @IsString()
    playStatus: PlayStatus;
  }

  // 응답 DTO들
  export class BattleJoinedResponse {
    battleInfo: BattleInfoDto;
    status: 'success' | 'error';
    message?: string;
  }
}

