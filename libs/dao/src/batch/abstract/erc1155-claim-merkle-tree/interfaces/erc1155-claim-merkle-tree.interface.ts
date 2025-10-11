import { Domain } from '@libs/common/domain/domain';
import { LogStatus } from '@libs/common/constants/contract.contstants';

export interface Erc1155ClaimMerkleTree extends Domain {
  title: string;
  treeRoot: string;
  status: LogStatus;
}
