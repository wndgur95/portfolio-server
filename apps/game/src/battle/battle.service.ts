import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { BattleEnterInDto } from './dto/battle-enter-in.dto';
import { BattleEnterOutDto } from './dto/battle-enter-out.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { randomUUID } from 'crypto';
import { BattleEntity } from '@libs/dao/game/battles/entities/battle.entity';
import { BattlesDbRepositories } from '@libs/dao/game/battles/repositories/battles-db.repository';
import { BattlesRepository } from '@libs/dao/game/battles/interfaces/battles-repository.interface';
import { BattleFinishInDto } from './dto/battle-finish-in.dto';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { BattleFinishOutDto } from './dto/battle-finish-out.dto';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { BattleProvider } from '@libs/common/provider/contents/battle.provider';

@Injectable()
export class BattleService {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersRepositories: CharactersDbRepositories,

    @Inject(BattlesRepository)
    private readonly battlesRepositories: BattlesDbRepositories,

    private readonly goodsProvider: GoodsProvider,
    private readonly battleProvider: BattleProvider,
  ) {}

  /**
   * 캐릭터 정보 받기
   */
  @Transactional()
  async enterBattle(
    battleEnterInDto: BattleEnterInDto,
  ): Promise<BattleEnterOutDto> {
    const { database, userId } = ContextProvider.getSession();

    await this._checkEnterBattle(battleEnterInDto);

    const { dataCharacterId } = battleEnterInDto;

    const battle =
      (await this.battlesRepositories[database].findByUserId(userId)) ??
      BattleEntity.create({
        userId,
      });

    battle.dataCharacterId = dataCharacterId;
    battle.battleUid = randomUUID();

    await this.battlesRepositories[database].save(battle, { reload: false });

    return BattleEnterOutDto.of({
      battleUid: battle.battleUid,
    });
  }

  @Transactional()
  async finishBattle(
    battleFinishInDto: BattleFinishInDto,
  ): Promise<BattleFinishOutDto> {
    const { battleUid, time, kill } = battleFinishInDto;

    await this._checkFinishBattle(battleUid);

    const rewards = this.battleProvider.getBattleResultReward(time, kill);

    const goodsOutDto = await this.goodsProvider.payImmediately(rewards);

    return BattleFinishOutDto.of({
      goods: goodsOutDto,
    });
  }

  private async _checkEnterBattle(
    battleEnterInDto: BattleEnterInDto,
  ): Promise<void> {
    const { database, userId } = ContextProvider.getSession();
    const { dataCharacterId, level } = battleEnterInDto;

    const character = await this.charactersRepositories[
      database
    ].findByUserIdAndDataCharacterId(userId, dataCharacterId);

    if (!character) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.CHARACTER_NOT_FOUND);
    }

    if (character.level != level) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.CHARACTER_NOT_FOUND);
    }
  }

  private async _checkFinishBattle(battleUid: string): Promise<void> {
    const { database, userId } = ContextProvider.getSession();

    const battle =
      await this.battlesRepositories[database].findByUserId(userId);

    if (battle.battleUid != battleUid) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.BATTLE_NOT_VALID);
    }

    await this.battlesRepositories[database].updateById(battle.id, {
      battleUid: null,
    });
  }
}
