import { Injectable } from '@nestjs/common';
import { Reward } from '@libs/common/interface/goods.interface';
import { DataGachaRepository } from '@libs/dao/static/data-gacha/data-gacha.repository';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { RandomUtil } from '@libs/common/utils/random.util';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { GOODS_TYPE } from '@libs/dao/static/common.constants';

@Injectable()
export class GachaProvider {
  constructor(
    private readonly dataGachaRepository: DataGachaRepository,
    private readonly dataCharacterRepository: DataCharacterRepository,
  ) {}

  /**
   * 가챠 굿즈 보상 조회
   */
  async drawRewards(
    dataGachaId: number,
    count: number,
  ): Promise<[Reward[], number]> {
    const { COUNT, TIER_RATIO, COST } =
      this.dataGachaRepository.findById(dataGachaId);

    if (!COUNT.includes(count)) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        '가챠 진행 횟수가 잘못됬습니다.',
      ]);
    }

    const rewards = Array.from({ length: count }).map(() => {
      const selectedTier = this._getRandom(TIER_RATIO);

      const dataCharacterId = this._getRandomCharacter(selectedTier);

      return {
        goodsType: GOODS_TYPE.CHARACTER,
        dataId: dataCharacterId,
        quantity: 1,
      };
    });

    return [rewards, COST];
  }
  /**
   * 캐릭터 랜덤 티어 조회
   */
  private _getRandom(ratio: number[]): number {
    if (ratio.sum() === 0) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        '확률 셋팅이 되어 있지 않음',
      ]);
    }

    return RandomUtil.getRandomIndexInRatios(ratio) + 1;
  }

  private _getRandomCharacter(tier: number): number {
    const characterPoll = this.dataCharacterRepository
      .values()
      .filter((it) => it.TIER === tier);

    return RandomUtil.getRandomValue(characterPoll).ID;
  }
}
