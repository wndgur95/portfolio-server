import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { KnowHowComment } from '@libs/dao/common/know-how-comments/interfaces/know-how-comment.interface';

@Entity('know_how_comment')
@BaseTimeEntity()
export class KnowHowCommentEntity
  extends AbstractEntity
  implements KnowHowComment
{
  @Index()
  @Column()
  knowHowId: number;

  @Column()
  userId: number;

  @Column({ length: 50 })
  commenter: string;

  @Column()
  comment: string;
}
