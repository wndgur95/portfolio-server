import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity, BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

@Entity('mission')
@BaseTimeEntity()
export class MissionEntity extends AbstractEntity implements Mission {
  @Index()
  @Column({ comment: '유저 id', unsigned: true })
  userId: number;

  @Column({ comment: '미션 아이디', unsigned: true })
  dataMissionId: number;

  @Column({ comment: '횟수', unsigned: true })
  count: number;

  @Column({ comment: '보상 받은 시간', default: null })
  rewardAt: Date;
}