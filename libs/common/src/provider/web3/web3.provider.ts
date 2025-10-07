import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { ImmutableContractsDbRepository } from '@libs/dao/contract/immutable-contracts/repositories/immutable-contracts-db.repository';
import { PolygonContractsDbRepository } from '@libs/dao/contract/polygon-contracts/repositories/polygon-contracts-db.repository';
import { ImmutableContractsRepository } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contracts-repository.interface';
import { PolygonContractsRepository } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contracts-repository.interface';
import { PolygonProvider } from '@libs/common/provider/web3/polygon/polygon.provider';
import { ImmutableProvider } from '@libs/common/provider/web3/immutable/immutable.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { ImmutableContract } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contract.interface';
import { PolygonContract } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contract.interface';
import { PolygonContractDto } from '@libs/dao/contract/polygon-contracts/dto/polygon-contract.dto';
import { ImmutableContractDto } from '@libs/dao/contract/immutable-contracts/dto/immutable-contract.dto';
import { PortfolioContractsDbRepository } from '@libs/dao/contract/portfolio-contracts/repositories/portfolio-contracts-db.repository';
import { PortfolioContractsRepository } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contracts-repository.interface';
import { PortfolioProvider } from '@libs/common/provider/web3/portfolio/portfolio.provider';
import { PortfolioContract } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contract.interface';
import { PortfolioContractDto } from '@libs/dao/contract/portfolio-contracts/dto/portfolio-contract.dto';

@Injectable()
export class Web3Provider {
  constructor(
    @Inject(ImmutableContractsRepository)
    private readonly immutableContractsRepository: ImmutableContractsDbRepository,
    @Inject(PolygonContractsRepository)
    private readonly polygonContractsRepository: PolygonContractsDbRepository,
    @Inject(PortfolioContractsRepository)
    private readonly portfolioContractsRepository: PortfolioContractsDbRepository,

    private readonly polygonProvider: PolygonProvider,
    private readonly immutableProvider: ImmutableProvider,
    private readonly portfolioProvider: PortfolioProvider,
  ) {}

  get network(): string {
    return ContextProvider.getNetwork();
  }

  get provider(): PolygonProvider | ImmutableProvider | PortfolioProvider {
    switch (this.network) {
      case NETWORK.POLYGON: {
        return this.polygonProvider;
      }
      case NETWORK.IMMUTABLE: {
        return this.immutableProvider;
      }
      default: {
        return this.portfolioProvider;
      }
    }
  }

  getProvider(network: string): PolygonProvider | ImmutableProvider | PortfolioProvider {
    switch (network) {
      case NETWORK.POLYGON: {
        return this.polygonProvider;
      }
      case NETWORK.IMMUTABLE: {
        return this.immutableProvider;
      }
      default: {
        return this.portfolioProvider;
      }
    }
  }

  get repository(): PolygonContractsRepository | ImmutableContractsRepository | PortfolioContractsRepository {
    switch (this.network) {
      case NETWORK.POLYGON: {
        return this.polygonContractsRepository;
      }
      case NETWORK.IMMUTABLE: {
        return this.immutableContractsRepository;
      }
      default: {
        return this.portfolioContractsRepository;
      }
    }
  }

  getRepository(
    network: string,
  ): PolygonContractsRepository | ImmutableContractsRepository | PortfolioContractsRepository {
    switch (network) {
      case NETWORK.POLYGON: {
        return this.polygonContractsRepository;
      }
      case NETWORK.IMMUTABLE: {
        return this.immutableContractsRepository;
      }
      default: {
        return this.portfolioContractsRepository;
      }
    }
  }

  fromEntity(
    contract: ImmutableContract | PolygonContract | PortfolioContract,
  ): ImmutableContractDto | PolygonContractDto | PortfolioContractDto {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.POLYGON: {
        return PolygonContractDto.fromEntity(contract as PolygonContract);
      }
      case NETWORK.IMMUTABLE: {
        return ImmutableContractDto.fromEntity(contract as ImmutableContract);
      }
      default: {
        return PortfolioContractDto.fromEntity(contract as PortfolioContract);
      }
    }
  }
}
