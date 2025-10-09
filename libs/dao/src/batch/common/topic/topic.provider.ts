import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { PortfolioTopicsRepository } from '@libs/dao/batch/portfolio/topics/interfaces/portfolio-topics-repository.interface';
import { PortfolioTopicsDbRepository } from '@libs/dao/batch/portfolio/topics/repositories/portfolio-topics-db.repository';

@Injectable()
export class TopicProvider extends BaseBatchTableProvider<
  PortfolioTopicsDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioTopicsRepository)
    protected readonly portfolioTopicsRepository: PortfolioTopicsDbRepository,
  ) {
    super(portfolioTopicsRepository);
  }
}
