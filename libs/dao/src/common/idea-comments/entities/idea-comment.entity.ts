import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { IdeaComment } from '@libs/dao/common/idea-comments/interfaces/idea-comment.interface';

@Entity('idea_comment')
@BaseTimeEntity()
export class IdeaCommentEntity extends AbstractEntity implements IdeaComment {
  @Index()
  @Column()
  ideaId: number;

  @Column()
  userId: number;

  @Column({ length: 50 })
  commenter: string;

  @Column()
  comment: string;
}
