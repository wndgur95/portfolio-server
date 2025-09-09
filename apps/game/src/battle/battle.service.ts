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
import { GetSoloRankingOutDto } from './dto/get-solo-ranking-out.dto';
import { SoloBattleProvider } from '@libs/common/provider/contents/solo-battle.provider';
import { SoloScoresDbRepository } from '@libs/dao/arena/solo-scores/repositories/solo-scores-db.repository';
import { SoloScoresRepository } from '@libs/dao/arena/solo-scores/interfaces/solo-scores-repository.interface';
import { SoloScoreHistoriesDbRepository } from '@libs/dao/arena/solo-score-histories/repositories/solo-score-histories-db.repository';
import { SoloScoreHistoriesRepository } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-histories-repository.interface';
import { SoloScoreEntity } from '@libs/dao/arena/solo-scores/entities/solo-score.entity';
import { Battle } from '@libs/dao/game/battles/interfaces/battle.interface';
import { SoloScoreHistoryEntity } from '@libs/dao/arena/solo-score-histories/entities/solo-score-history.entity';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';
import { SOLO_RANKING_KEY } from '@libs/common/constants/redis.constants';
import { GetSoloRankingInDto } from './dto/get-solo-ranking-in.dto';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MISSION_CONDITION_TYPE } from '@libs/dao/static/common.constants';

@Injectable()
export class BattleService {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersRepositories: CharactersDbRepositories,

    @Inject(BattlesRepository)
    private readonly battlesRepositories: BattlesDbRepositories,

    @Inject(SoloScoresRepository)
    private readonly soloScoresRepository: SoloScoresDbRepository,
    @Inject(SoloScoreHistoriesRepository)
    private readonly soloScoreHistoriesRepository: SoloScoreHistoriesDbRepository,

    private readonly goodsProvider: GoodsProvider,
    private readonly battleProvider: BattleProvider,
    private readonly soloBattleProvider: SoloBattleProvider,
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

    const { dataCharacterId, level } = battleEnterInDto;

    const battle =
      (await this.battlesRepositories[database].findByUserId(userId)) ??
      BattleEntity.create({
        userId,
      });

    battle.dataCharacterId = dataCharacterId;
    battle.level = level;
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

    const battle = await this._checkFinishBattle(battleUid);

    const [rewards, score] = this.battleProvider.getBattleResultReward(
      time,
      kill,
    );

    const goodsOutDto = await this.goodsProvider.payImmediately(rewards);

    await this._processBattleResult(battle, score);

    AchievementProvider.achieve(MISSION_CONDITION_TYPE.BATTLE, [], 1);
    AchievementProvider.achieve(MISSION_CONDITION_TYPE.KILL_ENEMY, [], kill);

    return BattleFinishOutDto.of({
      goods: goodsOutDto,
    });
  }

  /**
   * 전투 결과 처리 공통 메서드
   * @param battle 전투 정보
   * @param score 점수
   * @returns 변경된 유저 본인의 soloScore 와 랭킹
   */
  private async _processBattleResult(
    battle: Battle,
    score: number,
  ): Promise<void> {
    const now = ContextProvider.getNow();
    const { userId } = ContextProvider.getSession();
    const { dataCharacterId, level } = battle;

    const soloScore =
      (await this.soloScoresRepository.findByUserId(userId)) ??
      SoloScoreEntity.create({
        userId,
        gameCount: 0,
        score: 0,
        dataCharacterId: 0,
        level: 0,
      });

    const isNewRecord = soloScore.score <= score;

    // 점수 업데이트
    soloScore.gameCount += 1;
    soloScore.score = isNewRecord ? score : soloScore.score;
    soloScore.dataCharacterId = isNewRecord
      ? dataCharacterId
      : soloScore.dataCharacterId;
    soloScore.level = isNewRecord ? level : soloScore.level;
    soloScore.lastBattleAt = now;

    const history = SoloScoreHistoryEntity.create({
      userId,
      score,
      dataCharacterId,
      level,
      battleEndAt: now,
    });

    // Redis 랭킹 업데이트 (본인과 상대 모두 한 번에)
    await this.soloBattleProvider.updateSoloRanking(soloScore, history);
  }

  async getSoloRanking(
    getSoloRankingInDto: GetSoloRankingInDto,
  ): Promise<GetSoloRankingOutDto> {
    const { startRank, count } = getSoloRankingInDto;

    // 전체 인원, 내 랭킹, 랭킹 리스트 조회
    const [totalCount, myRanking, ranking] =
      await this.soloBattleProvider.getTotalUserCountAndRankAndScoreMemberByRank(
        startRank,
        count,
        SOLO_RANKING_KEY,
      );

    return GetSoloRankingOutDto.of({
      totalCount,
      myRanking,
      ranking,
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

  private async _checkFinishBattle(battleUid: string): Promise<Battle> {
    const { database, userId } = ContextProvider.getSession();

    const battle =
      await this.battlesRepositories[database].findByUserId(userId);

    if (battle.battleUid != battleUid) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.BATTLE_NOT_VALID);
    }

    await this.battlesRepositories[database].updateById(battle.id, {
      battleUid: null,
    });

    return battle;
  }
}
