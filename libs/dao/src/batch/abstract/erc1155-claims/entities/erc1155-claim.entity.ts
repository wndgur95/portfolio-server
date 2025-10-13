import { Column, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import {
  CLAIM_STATUS,
  ClaimStatus,
} from '@libs/common/constants/contract.contstants';
import { ClaimType } from '@libs/common/constants/token.constants';
import { Erc1155Claim } from '@libs/dao/batch/abstract/erc1155-claims/interfaces/erc1155-claim.interface';

@BaseTimeEntity()
export abstract class Erc1155ClaimEntity
  extends AbstractEntity
  implements Erc1155Claim
{
  @Column()
  userId: number;

  @Column()
  @Index('IDX_ADDRESS')
  address: string;

  @Column()
  claimType: ClaimType;

  @Column()
  tokenId: number;

  @Column()
  amount: number;

  @Column({ comment: '트리 라운드', nullable: true })
  @Index('IDX_TREE_ROUND')
  treeRound: number;

  @Column({ comment: '트리 경로', nullable: true, })
  treeProof: string;

  @Column({ default: CLAIM_STATUS.REGISTERED })
  @Index('IDX_STATUS')
  status: ClaimStatus;

  constructor(partial: Partial<Erc1155Claim>) {
    super();
    Object.assign(this, partial);
  }
}
