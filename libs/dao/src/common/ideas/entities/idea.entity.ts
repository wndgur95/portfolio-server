import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Idea } from '@libs/dao/common/ideas/interfaces/idea.interface';

@Entity('ideas')
@BaseTimeEntity()
export class IdeaEntity extends AbstractEntity implements Idea {
  @Column()
  userId: number;

  @Column({ length: 30 })
  nickname: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  contexts: string;
}
