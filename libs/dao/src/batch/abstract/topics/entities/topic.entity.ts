import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity, BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Topic } from '@libs/dao/batch/abstract/topics/interfaces/topic.interface';

@BaseTimeEntity()
export abstract class TopicEntity extends AbstractEntity implements Topic {
  @Column()
  topic: string;

  @Index('IDX_NAME')
  @Column()
  name: string;

  @Column({ default: 0 })
  enable: number;

  @Column()
  contractId: number;

  @Column()
  topicType: number;

  protected constructor(partial?: Partial<Topic>) {
    super();
    Object.assign(this, partial);
  }
}