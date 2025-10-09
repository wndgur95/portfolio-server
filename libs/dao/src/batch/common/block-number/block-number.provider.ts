import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { PortfolioBlockNumbersRepository } from '@libs/dao/batch/portfolio/block-numbers/interfaces/portfolio-block-numbers-repository.interface';
import { PortfolioBlockNumbersDbRepository } from '@libs/dao/batch/portfolio/block-numbers/repositories/portfolio-block-numbers-db.repository';

@Injectable()
export class BlockNumberProvider extends BaseBatchTableProvider<
  PortfolioBlockNumbersDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioBlockNumbersRepository)
    protected readonly portfolioBlockNumbersRepository: PortfolioBlockNumbersDbRepository,
  ) {
    super(portfolioBlockNumbersRepository);
  }
}
