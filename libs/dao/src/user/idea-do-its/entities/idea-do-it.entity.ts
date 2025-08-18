import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { IdeaDoIt } from '@libs/dao/user/idea-do-its/interfaces/idea-do-it.interface';

@Entity('idea_do_it')
@BaseTimeEntity()
@Index(['ideaId', 'userId'], { unique: true })
@Index(['ideaId', 'doIt'])
@Index(['userId', 'doIt'])
export class IdeaDoItEntity extends AbstractEntity implements IdeaDoIt {
  @Column()
  ideaId: number;

  @Column()
  userId: number;

  @Index()
  @Column({ type: 'tinyint', default: 0 })
  doIt: boolean;
}
