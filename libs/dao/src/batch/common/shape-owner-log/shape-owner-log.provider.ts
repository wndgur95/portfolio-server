import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { PortfolioShapeOwnerLogsDbRepository } from '@libs/dao/batch/portfolio/shape-owner-logs/repositories/portfolio-shape-owner-logs-db.repository';
import { PortfolioShapeOwnerLogsRepository } from '@libs/dao/batch/portfolio/shape-owner-logs/interfaces/portfolio-shape-owner-logs-repository.interface';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { PortfolioShapeOwnerLogEntity } from '@libs/dao/batch/portfolio/shape-owner-logs/entities/portfolio-shape-owner-log.entity';

@Injectable()
export class ShapeOwnerLogProvider extends BaseBatchTableProvider<
  PortfolioShapeOwnerLogsDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioShapeOwnerLogsRepository)
    protected readonly portfolioShapeOwnerLogsRepository: PortfolioShapeOwnerLogsDbRepository,
  ) {
    super(portfolioShapeOwnerLogsRepository);
  }

  createEntity(dto): PortfolioShapeOwnerLogEntity {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.PORTFOLIO: {
        return new PortfolioShapeOwnerLogEntity(dto);
      }
    }
  }
}
