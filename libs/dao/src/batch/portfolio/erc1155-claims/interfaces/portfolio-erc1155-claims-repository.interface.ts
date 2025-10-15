import {
  Erc1155ClaimsRepository
} from '@libs/dao/batch/abstract/erc1155-claims/interfaces/erc1155-claims-repository.interface';
import {
  PortfolioErc1155ClaimEntity
} from '@libs/dao/batch/portfolio/erc1155-claims/entities/portfolio-erc1155-claim.entity';

export type PortfolioErc1155ClaimsRepository = Erc1155ClaimsRepository<PortfolioErc1155ClaimEntity>

export const PortfolioErc1155ClaimsRepository = Symbol('PortfolioErc1155ClaimsRepository');