import { PortfolioContractEntity } from '@libs/dao/contract/portfolio-contracts/entities/portfolio-contract.entity';
import { BaseWeb3ContractRepositoryInterface } from '@libs/dao/base/base-web3-contract-repository.interface';

export type PortfolioContractsRepository =
  BaseWeb3ContractRepositoryInterface<PortfolioContractEntity>;

export const PortfolioContractsRepository = Symbol(
  'PortfolioContractsRepository',
);
