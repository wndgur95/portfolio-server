import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { PortfolioShapeMintLogsDbRepository } from '@libs/dao/batch/portfolio/shape-mint-logs/repositories/portfolio-shape-mint-logs-db.repository';
import { PortfolioShapeMintLogsRepository } from '@libs/dao/batch/portfolio/shape-mint-logs/interfaces/portfolio-shape-mint-logs-repository.interface';
import {
  PortfolioShapeEventLogEntity
} from '@libs/dao/batch/portfolio/shape-event-logs/entities/portfolio-shape-event-log.entity';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import {
  PortfolioShapeMintLogEntity
} from '@libs/dao/batch/portfolio/shape-mint-logs/entities/portfolio-shape-mint-log.entity';

@Injectable()
export class ShapeMintLogProvider extends BaseBatchTableProvider<
  PortfolioShapeMintLogsDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioShapeMintLogsRepository)
    protected readonly portfolioShapeMintLogsRepository: PortfolioShapeMintLogsDbRepository,
  ) {
    super(portfolioShapeMintLogsRepository);
  }

  createEntity(dto): PortfolioShapeMintLogEntity {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.PORTFOLIO: {
        return new PortfolioShapeMintLogEntity(dto);
      }
    }
  }
}
