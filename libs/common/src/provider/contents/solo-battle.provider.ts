import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { SoloScoresDbRepository } from '@libs/dao/arena/solo-scores/repositories/solo-scores-db.repository';
import { SoloScoresRepository } from '@libs/dao/arena/solo-scores/interfaces/solo-scores-repository.interface';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';
import { SoloScoreEntity } from '@libs/dao/arena/solo-scores/entities/solo-score.entity';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { SoloScoreHistory } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-history.interface';
import { RANKING_TIMESTAMP_DECIMALS, SOLO_RANKING_KEY } from '@libs/common/constants/redis.constants';
import { ScoreMember, ScoreMemberDetail } from '@libs/dao/redis/solo-ranking/type/score-member';
import { SoloRankingRepository } from '@libs/dao/redis/solo-ranking/solo-ranking.repository';
import { SoloScoreHistoriesDbRepository } from '@libs/dao/arena/solo-score-histories/repositories/solo-score-histories-db.repository';
import { SoloScoreHistoriesRepository } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-histories-repository.interface';
import { SoloScoreDto } from '@libs/dao/arena/solo-scores/dto/solo-score.dto';

@Injectable()
export class SoloBattleProvider {
  constructor(
    @Inject(SoloScoresRepository)
    private readonly soloScoresRepository: SoloScoresDbRepository,
    @Inject(SoloScoreHistoriesRepository)
    private readonly soloScoreHistoriesRepository: SoloScoreHistoriesDbRepository,

    private readonly soloRankingRepository: SoloRankingRepository,
  ) {}

  @TransactionalEx(DB_NAME.ARENA)
  async getSoloScore(): Promise<SoloScore> {
    const userId = ContextProvider.getUserId();

    return await this.soloScoresRepository.findByUserId(userId);
  }

  @TransactionalEx(DB_NAME.ARENA)
  async createSoloScore(): Promise<SoloScore> {
    const userId = ContextProvider.getUserId();

    const soloScore = SoloScoreEntity.create({
      userId: userId,
      lastBattleAt: ContextProvider.getNow(),
    });

    await this.soloScoresRepository.insert(soloScore);

    return soloScore;
  }

  @TransactionalEx(DB_NAME.ARENA)
  async updateSoloScores(soloScores: SoloScore[]): Promise<InsertResult> {
    return await this.soloScoresRepository.upsert(soloScores, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  @TransactionalEx(DB_NAME.ARENA)
  async updateSoloScore(soloScore: SoloScore): Promise<UpdateResult> {
    return await this.soloScoresRepository.updateById(soloScore.id, soloScore);
  }

  /**
   * Redis 아레나 랭킹 업데이트
   */
  @TransactionalEx(DB_NAME.ARENA)
  async updateSoloRanking(
    soloScore: SoloScore,
    history: SoloScoreHistory,
  ): Promise<void> {
    const soloRankingKey = SOLO_RANKING_KEY;
    const soloUserInfoKey = `${SOLO_RANKING_KEY}:${soloScore.userId}`;

    const scoreMember = ScoreMember.create({
      userId: soloScore.userId,
      score: this.calculateSoloRedisScore(
        soloScore.score,
        soloScore.lastBattleAt,
      ),
    });

    this.updateSoloRedisRanking(soloRankingKey, scoreMember);
    this.updateSoloUserInfo(soloUserInfoKey, SoloScoreDto.fromEntity(soloScore));

    await this.soloScoresRepository.save(soloScore, { reload: false });
    await this.soloScoreHistoriesRepository.save(history, { reload: false });
  }

  calculateSoloRedisScore(
    score: number,
    battleAt: Date, // 경기 시작 시각
  ): number {
    const timestamp = battleAt.getTime();
    const decimals = 10 ** RANKING_TIMESTAMP_DECIMALS;
    return score * decimals + (decimals - timestamp);
  }

  /**
   * 아레나 레디스 점수 재료 만들기
   */
  getScoreMember(userId: number, score: number): ScoreMember {
    return ScoreMember.create({ userId: userId, score: score });
  }

  /**
   * 유저 레디스 점수 빼기
   */
  removeUserRedisScoreMember(scoreMembers: ScoreMember[]): ScoreMember[] {
    const { userId } = ContextProvider.getSession();

    return scoreMembers.filter((it) => it.userId !== userId);
  }

  /**
   * 아레나 배틀 총인원, 유저 랭킹, 조건에 맞는 랭킹 리스트 가져오기
   */
  async getTotalUserCountAndRankAndScoreMemberByRank(
    startRank: number,
    count: number,
    redisKey: string,
  ): Promise<[number, ScoreMemberDetail, ScoreMemberDetail[]]> {
    const startIndex = startRank - 1;

    const { userId } = ContextProvider.getSession();

    return await this.soloRankingRepository.getTotalUserCountAndRankAndScoreMemberByRank(
      redisKey,
      userId,
      startIndex,
      startIndex + count - 1,
    );
  }

  /**
   * 점수 범위로 아레나 랭킹 조회
   */
  async getArenaScoreMembersByScoreRange(
    redisKey: string,
    maxScore: number,
    minScore: number,
  ): Promise<ScoreMemberDetail[]> {
    return await this.soloRankingRepository.getScoreMemberByScore(
      redisKey,
      maxScore,
      minScore,
    );
  }

  /**
   * 아레나 랭킹 업데이트 (Redis) - 여러 유저
   */
  updateSoloRedisRanking(redisKey: string, scoreMember: ScoreMember): void {
    this.soloRankingRepository.addScore(redisKey, scoreMember);
  }

  /**
   * 아레나 랭킹 업데이트 (Redis) - 여러 유저
   */
  updateSoloUserInfo(redisKey: string, soloScore: SoloScore): void {
    this.soloRankingRepository.setSoloScore(redisKey, soloScore);
  }

  /**
   * 아레나 랭킹 조회 (Redis)
   */
  async getSoloRank(redisKey: string, userId: number): Promise<number> {
    return await this.soloRankingRepository.getRank(redisKey, userId);
  }
}
