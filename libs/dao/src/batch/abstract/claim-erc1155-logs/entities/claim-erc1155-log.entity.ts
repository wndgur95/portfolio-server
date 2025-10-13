import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Column, Index } from 'typeorm';
import { LOG_STATUS } from '@libs/common/constants/contract.contstants';
import { ClaimErc1155Log } from '@libs/dao/batch/abstract/claim-erc1155-logs/interfaces/claim-erc1155-log.interface';

@BaseTimeEntity()
export class ClaimErc1155LogEntity
  extends AbstractEntity
  implements ClaimErc1155Log
{
  @Index('IDX_ADDRESS')
  @Column()
  address: string;

  @Index('IDX_SECOND_TOPIC')
  @Column()
  claimId: number;

  @Index('IDX_THIRD_TOPIC')
  @Column()
  tokenId: number;

  @Column({
    type: 'text',
  })
  data: string;

  @Index('IDX_BLOCK_NUMBER')
  @Column({ type: 'bigint' })
  blockNumber: number;

  @Index('IDX_STATUS')
  @Column({
    type: 'tinyint',
    default: LOG_STATUS.REGISTERED,
  })
  status: number;

  @Column()
  contractId: number;

  @Index('IDX_TOPIC_ID')
  @Column()
  topicId: number;

  constructor(partial: Partial<ClaimErc1155Log>) {
    super();
    Object.assign(this, partial);
  }
}
