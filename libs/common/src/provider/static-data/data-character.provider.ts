import { Injectable } from '@nestjs/common';
import { DataCharacter } from '@libs/dao/static/data-character/data-character.entity';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import { CHARACTER_TIER_TYPE } from '@libs/dao/static/common.constants';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { CharacterStatDto } from '@libs/dao/redis/solo-battle/dto/player.dto';

@Injectable()
export class DataCharacterProvider {
  constructor(
    private readonly dataCharacterRepository: DataCharacterRepository,
    private readonly dataBalanceRepository: DataBalanceRepository,
  ) {}

  /**
   * 단일 캐릭터 데이터 조회
   */
  getDataCharacter(id: number): DataCharacter {
    const dataCharacter = this.dataCharacterRepository.findById(id);

    if (!dataCharacter) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `${id}는 캐릭터 데이터에 존재하지 않은 아이디 입니다.`,
      ]);
    }

    return dataCharacter;
  }

  /**
   * 다중 캐릭터 데이터 조회
   */
  getDataCharacters(ids: number[]): DataCharacter[] {
    const dataCharacters = this.dataCharacterRepository.findByIdIn(ids);

    if (ids.length !== dataCharacters.length) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `요청된 ID 중 누락된 캐릭터 데이터가 있습니다. 요청된 ID: ${ids.join(', ')}, 조회된 데이터 수: ${dataCharacters.length}`,
      ]);
    }

    return dataCharacters;
  }

  /**
   * 모든 캐릭터 데이터 조회
   */
  getAllDataCharacters(): DataCharacter[] {
    return this.dataCharacterRepository.values();
  }

  /**
   * 최대 티어
   */
  getMaxTier(): number {
    return CHARACTER_TIER_TYPE.S_S_R;
  }

  /**
   * 영웅 스텟 정보 가져오기
   */
  getStats(dataCharacterId: number, level: number): CharacterStatDto {
    const { ATTACK, DEFENCE, MOVE_SPEED, ATTACK_SPEED, WEAPON_COUNT, HP } =
      this.dataCharacterRepository.findById(dataCharacterId);

    return CharacterStatDto.create({
      attack: ATTACK * level* 100,
      defence: DEFENCE * level* 100,
      moveSpeed: MOVE_SPEED * level* 100,
      attackSpeed: ATTACK_SPEED * level* 100,
      weaponCount: WEAPON_COUNT * level* 100,
      hp: HP * level* 100,
    });
  }
}
