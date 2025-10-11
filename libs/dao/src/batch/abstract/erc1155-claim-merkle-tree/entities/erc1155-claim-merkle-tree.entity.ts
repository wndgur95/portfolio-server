import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Erc1155ClaimMerkleTree } from '@libs/dao/batch/abstract/erc1155-claim-merkle-tree/interfaces/erc1155-claim-merkle-tree.interface';
import { Column } from 'typeorm';
import {
  LOG_STATUS,
  LogStatus,
} from '@libs/common/constants/contract.contstants';

@BaseTimeEntity()
export abstract class Erc1155ClaimMerkleTreeEntity
  extends AbstractEntity
  implements Erc1155ClaimMerkleTree
{
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  treeRoot: string;

  @Column({ default: LOG_STATUS.REGISTERED })
  status: LogStatus;

  constructor(partial: Partial<Erc1155ClaimMerkleTree>) {
    super();
    Object.assign(this, partial);
  }
}
