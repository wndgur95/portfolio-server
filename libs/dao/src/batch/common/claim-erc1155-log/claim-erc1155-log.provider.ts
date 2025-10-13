import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { PortfolioClaimErc1155LogsRepository } from '@libs/dao/batch/portfolio/claim-erc1155-logs/interfaces/portfolio-claim-erc1155-logs-repository.interface';
import { PortfolioClaimErc1155LogEntity } from '@libs/dao/batch/portfolio/claim-erc1155-logs/entities/portfolio-claim-erc1155-log.entity';
import {
  PortfolioClaimErc1155LogsDbRepository
} from '@libs/dao/batch/portfolio/claim-erc1155-logs/repositories/portfolio-claim-erc1155-logs-db.repository';

@Injectable()
export class ClaimErc1155LogProvider extends BaseBatchTableProvider<
  PortfolioClaimErc1155LogsDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioClaimErc1155LogsRepository)
    protected readonly portfolioClaimErc1155LogsRepository: PortfolioClaimErc1155LogsDbRepository,
  ) {
    super(portfolioClaimErc1155LogsRepository);
  }

  createEntity(dto): PortfolioClaimErc1155LogEntity {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.PORTFOLIO: {
        return new PortfolioClaimErc1155LogEntity(dto);
      }
    }
  }
}
