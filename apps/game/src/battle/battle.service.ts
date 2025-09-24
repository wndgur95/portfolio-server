import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { BattleEnterInDto } from './dto/battle-enter-in.dto';
import { BattleEnterOutDto } from './dto/battle-enter-out.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { randomUUID } from 'crypto';
import { BattleFinishInDto } from './dto/battle-finish-in.dto';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { BattleFinishOutDto } from './dto/battle-finish-out.dto';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { BattleProvider } from '@libs/common/provider/contents/battle.provider';
import { GetSoloRankingOutDto } from './dto/get-solo-ranking-out.dto';
import { SoloBattleProvider } from '@libs/common/provider/contents/solo-battle.provider';
import { SoloScoresDbRepository } from '@libs/dao/arena/solo-scores/repositories/solo-scores-db.repository';
import { SoloScoresRepository } from '@libs/dao/arena/solo-scores/interfaces/solo-scores-repository.interface';
import { SoloScoreEntity } from '@libs/dao/arena/solo-scores/entities/solo-score.entity';
import { SoloScoreHistoryEntity } from '@libs/dao/arena/solo-score-histories/entities/solo-score-history.entity';
import { SOLO_RANKING_KEY } from '@libs/common/constants/redis.constants';
import { GetSoloRankingInDto } from './dto/get-solo-ranking-in.dto';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MISSION_CONDITION_TYPE } from '@libs/dao/static/common.constants';
import { BattleInfoDto } from '@libs/dao/redis/solo-battle/dto/battle-info.dto';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { MongoLogProvider } from '@libs/common/provider/mongo-log/mongo-log.provider';
import { EnterBattleCollection } from '@libs/dao/mongo/mongo-log/collection/battle/enter-battle.collection';
import { FinishBattleCollection } from '@libs/dao/mongo/mongo-log/collection/battle/finish-battle.collection';

@Injectable()
export class BattleService {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersRepositories: CharactersDbRepositories,

    @Inject(SoloScoresRepository)
    private readonly soloScoresRepository: SoloScoresDbRepository,

    private readonly goodsProvider: GoodsProvider,
    private readonly battleProvider: BattleProvider,
    private readonly soloBattleProvider: SoloBattleProvider,

    private readonly soloBattleRedisRepository: SoloBattleRedisRepository,
  ) {}

  /**
   * 캐릭터 정보 받기
   */
  async enterBattle(
    battleEnterInDto: BattleEnterInDto,
  ): Promise<BattleEnterOutDto> {
    const { userId } = ContextProvider.getSession();

    await this._checkEnterBattle(battleEnterInDto);

    const { dataCharacterId, level } = battleEnterInDto;

    const battleUid = randomUUID();

    const battleInfo = BattleInfoDto.create({
      userId,
      dataCharacterId,
      level,
      battleUid: battleUid,
    });

    await this.soloBattleRedisRepository.setBattleInfo(userId, battleInfo);

    MongoLogProvider.setMongoLog(
      'solo-battle',
      new EnterBattleCollection({ battleInfo, reason: 'enter-battle' }),
    );

    return BattleEnterOutDto.of({
      battleUid: battleUid,
    });
  }

  @Transactional()
  async finishBattle(
    battleFinishInDto: BattleFinishInDto,
  ): Promise<BattleFinishOutDto> {
    const { battleUid, time, kill } = battleFinishInDto;

    const battleInfo = await this._checkFinishBattle(battleUid);

    const [rewards, score] = this.battleProvider.getBattleResultReward(
      time,
      kill,
    );

    const goodsOutDto = await this.goodsProvider.payImmediately(rewards);

    await this._processBattleResult(battleInfo, score);

    AchievementProvider.achieve(MISSION_CONDITION_TYPE.BATTLE, [], 1);
    AchievementProvider.achieve(MISSION_CONDITION_TYPE.KILL_ENEMY, [], kill);

    MongoLogProvider.setMongoLog(
      'solo-battle',
      new FinishBattleCollection({
        battleInfo,
        goods: goodsOutDto,
        reason: 'finish-battle'
      }),
    );

    return BattleFinishOutDto.of({
      goods: goodsOutDto,
    });
  }

  /**
   * 전투 결과 처리 공통 메서드
   * @param battleInfo 전투 정보
   * @param score 점수
   * @returns 변경된 유저 본인의 soloScore 와 랭킹
   */
  private async _processBattleResult(
    battleInfo: BattleInfoDto,
    score: number,
  ): Promise<void> {
    const now = ContextProvider.getNow();
    const { userId } = ContextProvider.getSession();
    const { dataCharacterId, level } = battleInfo;

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
      throw new ServerErrorException(INTERNAL_ERROR_CODE.CHARACTER_NOT_FOUND, [
        dataCharacterId,
      ]);
    }

    if (character.level != level) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.CHARACTER_LEVEL_NOT_MATCH,
        [dataCharacterId],
      );
    }
  }

  private async _checkFinishBattle(battleUid: string): Promise<BattleInfoDto> {
    const { userId } = ContextProvider.getSession();

    const battleInfo =
      await this.soloBattleRedisRepository.getBattleInfo(userId);

    if (battleInfo.battleUid != battleUid) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.BATTLE_NOT_VALID);
    }

    this.soloBattleRedisRepository.delBattleInfoMulti(userId);

    return battleInfo;
  }
}
