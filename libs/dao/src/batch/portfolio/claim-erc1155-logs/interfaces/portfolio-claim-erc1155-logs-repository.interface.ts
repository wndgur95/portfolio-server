import { PortfolioClaimErc1155LogEntity } from '@libs/dao/batch/portfolio/claim-erc1155-logs/entities/portfolio-claim-erc1155-log.entity';
import { ClaimErc1155LogsRepository } from '@libs/dao/batch/abstract/claim-erc1155-logs/interfaces/claim-erc1155-logs-repository.interface';

export type PortfolioClaimErc1155LogsRepository = ClaimErc1155LogsRepository<PortfolioClaimErc1155LogEntity>

export const PortfolioClaimErc1155LogsRepository = Symbol(
  'PortfolioClaimErc1155LogsRepository',
);
