import { Domain } from '@libs/common/domain/domain';
import { ClaimType } from '@libs/common/constants/token.constants';
import { ClaimStatus } from '@libs/common/constants/contract.contstants';

export interface Erc1155Claim extends Domain {
  address: string;
  claimType: ClaimType;
  tokenId: number;
  amount: number;
  treeRound: number;
  treeProof: string;
  status: ClaimStatus;
}