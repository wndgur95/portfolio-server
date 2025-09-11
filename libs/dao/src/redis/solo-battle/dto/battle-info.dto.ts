import { PlayerDto } from '@libs/dao/redis/solo-battle/dto/player.dto';
import { PlayStatus } from '@libs/dao/static/common.constants';

export class BattleInfoDto {
  userId: number;
  dataCharacterId: number;
  level: number;
  battleUid: string;

  status?: PlayStatus;

  clientId?: string;
  joinedAt?: number;

  player?: PlayerDto;

  enemies?: any[];

  static create(partial?: Partial<BattleInfoDto>): BattleInfoDto {
    return Object.assign(new BattleInfoDto(), partial);
  }
}
