import { Domain } from '@libs/common/domain/domain';
import { ContractType } from '@libs/common/constants/contract.contstants';

export interface BaseWeb3ContractInterface extends Domain {
  name: string;
  address: string;
  type: ContractType;
  abi: any;
}
