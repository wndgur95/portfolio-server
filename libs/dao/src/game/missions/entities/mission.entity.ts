import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';

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

  @Column({ comment: '보상 받은 시간', default: null, nullable: true })
  rewardAt: Date;

  @ManyToOne(() => UserDetailEntity, (userDetail) => userDetail.missions, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userDetail: Relation<Promise<UserDetail>>;
}
