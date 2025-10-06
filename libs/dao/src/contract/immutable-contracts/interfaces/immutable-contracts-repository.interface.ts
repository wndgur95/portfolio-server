import { ImmutableContractEntity } from '@libs/dao/contract/immutable-contracts/entities/immutable-contract.entity';
import { BaseWeb3ContractRepositoryInterface } from '@libs/dao/base/base-web3-contract-repository.interface';

export type ImmutableContractsRepository =
  BaseWeb3ContractRepositoryInterface<ImmutableContractEntity>;

export const ImmutableContractsRepository = Symbol(
  'ImmutableContractsRepository',
);
