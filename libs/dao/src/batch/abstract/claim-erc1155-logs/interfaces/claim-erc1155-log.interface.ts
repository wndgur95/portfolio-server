import { Domain } from '@libs/common/domain/domain';

export interface ClaimErc1155Log extends Domain {
  address: string;
  claimId: number;
  tokenId: number;
  data: any;
  blockNumber: number;
  status: number;
  contractId: number;
  topicId: number;
}
