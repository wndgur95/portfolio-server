import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { PortfolioShapeEventLogsDbRepository } from '@libs/dao/batch/portfolio/shape-event-logs/repositories/portfolio-shape-event-logs-db.repository';
import { PortfolioShapeEventLogsRepository } from '@libs/dao/batch/portfolio/shape-event-logs/interfaces/portfolio-shape-event-logs-repository.interface';
import { PortfolioShapeEventLogEntity } from '@libs/dao/batch/portfolio/shape-event-logs/entities/portfolio-shape-event-log.entity';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';

@Injectable()
export class ShapeEventLogProvider extends BaseBatchTableProvider<
  PortfolioShapeEventLogsDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioShapeEventLogsRepository)
    protected readonly portfolioShapeEventLogsRepository: PortfolioShapeEventLogsDbRepository,
  ) {
    super(portfolioShapeEventLogsRepository);
  }

  createEntity(dto): PortfolioShapeEventLogEntity {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.PORTFOLIO: {
        return new PortfolioShapeEventLogEntity(dto);
      }
    }
  }
}
