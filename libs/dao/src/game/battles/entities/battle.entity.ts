import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Battle } from '@libs/dao/game/battles/interfaces/battle.interface';

@Entity('battle')
@BaseTimeEntity()
export class BattleEntity extends AbstractEntity implements Battle {
  @Index({ unique: true })
  @Column({ comment: '유저 id', unsigned: true })
  userId: number;

  @Column({ comment: '선택된 캐릭터 id', unsigned: true })
  dataCharacterId: number;

  @Column({ comment: '선택된 캐릭터 레벨', unsigned: true })
  level: number;

  @Column({ comment: 'battle uuid', nullable: true })
  battleUid: string;
}
