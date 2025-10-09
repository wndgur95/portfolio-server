import { Column, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { ShapeEventLog } from '@libs/dao/batch/abstract/shape-event-logs/interfaces/shape-event-log.interface';
import { LOG_STATUS } from '@libs/common/constants/contract.contstants';

@BaseTimeEntity()
export abstract class ShapeEventLogEntity
  extends AbstractEntity
  implements ShapeEventLog
{
  @Index('IDX_ADDRESS')
  @Column()
  address: string;

  @Index('IDX_SECOND_TOPIC')
  @Column()
  secondTopic: string;

  @Index('IDX_THIRD_TOPIC')
  @Column()
  thirdTopic: string;

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

  constructor(partial: Partial<ShapeEventLog>) {
    super();
    Object.assign(this, partial);
  }
}
