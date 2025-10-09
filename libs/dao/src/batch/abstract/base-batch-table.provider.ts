import { Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';

@Injectable()
export abstract class BaseBatchTableProvider<
  PortfolioRepository,
  ImmutableRepository,
  PolygonRepository,
> {
  protected constructor(
    protected readonly portfolioRepository: PortfolioRepository,
    protected readonly immutableRepository?: ImmutableRepository,
    protected readonly polygonRepository?: PolygonRepository,
  ) {}

  get repository():
    | ImmutableRepository
    | PolygonRepository
    | PortfolioRepository {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.POLYGON: {
        return this.polygonRepository;
      }
      case NETWORK.IMMUTABLE: {
        return this.immutableRepository;
      }
      default: {
        return this.portfolioRepository;
      }
    }
  }
}
