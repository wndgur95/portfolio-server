import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { PortfolioErc1155ClaimsDbRepository } from '@libs/dao/batch/portfolio/erc1155-claims/repositories/portfolio-erc1155-claims-db.repository';
import { PortfolioErc1155ClaimsRepository } from '@libs/dao/batch/portfolio/erc1155-claims/interfaces/portfolio-erc1155-claims-repository.interface';
import { PortfolioErc1155ClaimEntity } from '@libs/dao/batch/portfolio/erc1155-claims/entities/portfolio-erc1155-claim.entity';

@Injectable()
export class Erc1155ClaimProvider extends BaseBatchTableProvider<
  PortfolioErc1155ClaimsDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioErc1155ClaimsRepository)
    protected readonly portfolioErc1155ClaimsRepository: PortfolioErc1155ClaimsDbRepository,
  ) {
    super(portfolioErc1155ClaimsRepository);
  }

  createEntity(dto): PortfolioErc1155ClaimEntity {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.PORTFOLIO: {
        return new PortfolioErc1155ClaimEntity(dto);
      }
    }
  }
}
