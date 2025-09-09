import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity, BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { SoloScoreHistory } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-history.interface';

@Entity('solo_score_history')
@BaseTimeEntity()
export class SoloScoreHistoryEntity extends AbstractEntity implements SoloScoreHistory {
  @Index()
  @Column({ comment: '유저 아이디', unsigned: true })
  userId: number;

  @Column({ comment: '점수', unsigned: true, default: 0 })
  score: number;

  @Column({ comment: '사용 캐릭터 id', unsigned: true, default: 0 })
  dataCharacterId: number;

  @Column({ comment: '레벨', unsigned: true, default: 0 })
  level: number;

  @Column({ comment: '전투 시간' })
  battleEndAt: Date;
}