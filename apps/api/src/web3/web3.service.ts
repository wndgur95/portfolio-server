import { Injectable } from '@nestjs/common';
import { PolygonService } from './polygon/polygon.service';
import { ImmutableService } from './immutable/immutable.service';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { PortfolioService } from './portfolio/portfolio.service';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class Web3Service {
  constructor(
    private readonly polygonService: PolygonService,
    private readonly immutableService: ImmutableService,
    private readonly portfolioService: PortfolioService,
  ) {}

  get network(): string {
    return ContextProvider.getNetwork();
  }

  get web3Service(): PolygonService | ImmutableService {
    switch (this.network) {
      case NETWORK.POLYGON: {
        return this.polygonService;
      }
      case NETWORK.IMMUTABLE: {
        return this.immutableService;
      }
      default: {
        return this.portfolioService;
      }
    }
  }
}
