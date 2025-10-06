import { PolygonContractEntity } from '@libs/dao/contract/polygon-contracts/entities/polygon-contract.entity';
import { BaseWeb3ContractRepositoryInterface } from '@libs/dao/base/base-web3-contract-repository.interface';

export type PolygonContractsRepository =
  BaseWeb3ContractRepositoryInterface<PolygonContractEntity>;

export const PolygonContractsRepository = Symbol(
  'PolygonContractsRepository',
);
