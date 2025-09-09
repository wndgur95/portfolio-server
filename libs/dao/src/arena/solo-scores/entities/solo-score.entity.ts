import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity, BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';

@Entity('solo_score')
@BaseTimeEntity()
export class SoloScoreEntity extends AbstractEntity implements SoloScore {
  @Column({ comment: '유저 아이디', unsigned: true, unique: true })
  userId: number;

  @Column({ comment: '점수', unsigned: true, default: 0 })
  score: number;

  @Column({ comment: '경기 횟수', unsigned: true, default: 0 })
  gameCount: number;

  @Column({ comment: '사용 캐릭터 id', unsigned: true, default: 0 })
  dataCharacterId: number;

  @Column({ comment: '레벨', unsigned: true, default: 0 })
  level: number;

  @Column({ comment: '마지막 전투 시간' })
  lastBattleAt: Date;
}