import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { KnowHowRecommend } from '@libs/dao/user/know-how-recommends/interfaces/know-how-recommend.interface';

@Entity('know_how_recommend')
@BaseTimeEntity()
@Index(['knowHowId', 'userId'], { unique: true })
@Index(['knowHowId', 'recommend'])
@Index(['userId', 'recommend'])
export class KnowHowRecommendEntity
  extends AbstractEntity
  implements KnowHowRecommend
{
  @Column()
  knowHowId: number;

  @Column()
  userId: number;

  @Index()
  @Column({ type: 'tinyint', default: 0 })
  recommend: boolean;
}
