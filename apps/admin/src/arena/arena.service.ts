import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import {
  NumberFilter,
  PaginationInDto,
} from '@libs/common/dto/pagination-in.dto';
import { PaginationOutDto } from '@libs/common/dto/pagination-out.dto';
import { SoloScoresRepository } from '@libs/dao/arena/solo-scores/interfaces/solo-scores-repository.interface';
import { SoloScoresDbRepository } from '@libs/dao/arena/solo-scores/repositories/solo-scores-db.repository';
import { SoloScoreHistoriesRepository } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-histories-repository.interface';
import { SoloScoreHistoriesDbRepository } from '@libs/dao/arena/solo-score-histories/repositories/solo-score-histories-db.repository';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';
import { SoloBattleHistoryFilterDto } from './dto/solo-battle-history-filter.dto';
import { SoloScoreHistory } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-history.interface';

@Injectable()
export class ArenaService {
  constructor(
    @Inject(SoloScoresRepository)
    private readonly soloScoresRepository: SoloScoresDbRepository,

    @Inject(SoloScoreHistoriesRepository)
    private readonly soloScoreHistoriesRepository: SoloScoreHistoriesDbRepository,
  ) {}

  async getSoloBattleScore(): Promise<SoloScore> {
    const { userId } = ContextProvider.getSelectedUser();

    return await this.soloScoresRepository.findByUserId(userId);
  }

  async getSoloBattleHistory(
    pagination: PaginationInDto<SoloBattleHistoryFilterDto>,
  ): Promise<[SoloScoreHistory[], PaginationOutDto]> {
    const { userId } = ContextProvider.getSelectedUser();

    const take = pagination.size ?? 20;
    const page = pagination.page ?? 1;
    const skip = (page - 1) * take;
    const order = pagination.order ?? 'DESC';

    const mergedFilter = {
      ...pagination.filter,
      userId: { type: 'eq', value: userId } as NumberFilter,
    };

    const [histories, total] =
      await this.soloScoreHistoriesRepository.findAllWithFilterAndCount(
        take,
        skip,
        order,
        mergedFilter,
      );

    return [
      histories,
      PaginationOutDto.of({
        total,
        page,
        size: take,
        order,
        filter: pagination.filter,
      }),
    ];
  }
}
