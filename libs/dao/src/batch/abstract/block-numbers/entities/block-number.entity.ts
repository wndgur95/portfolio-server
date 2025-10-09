import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { BlockNumber } from '@libs/dao/batch/abstract/block-numbers/interfaces/block-number.interface';
import { Column } from 'typeorm';

@BaseTimeEntity()
export abstract class BlockNumberEntity
  extends AbstractEntity
  implements BlockNumber
{
  @Column()
  blockNumber: number;

  @Column()
  topicType: number;

  protected constructor(partial: Partial<BlockNumber>) {
    super();
    Object.assign(this, partial);
  }
}
