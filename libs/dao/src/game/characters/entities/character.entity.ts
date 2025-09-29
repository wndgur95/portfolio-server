import { Column, Entity, Index, JoinColumn, ManyToOne, Relation } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';

@Entity('character')
@BaseTimeEntity()
@Index(['userId', 'dataCharacterId'], { unique: true })
export class CharacterEntity extends AbstractEntity implements Character {
  @Index()
  @Column({ comment: '유저 id', unsigned: true })
  userId: number;

  @Column({ comment: '데이터 캐릭터 아이디', default: 0, unsigned: true })
  dataCharacterId: number;

  @Column({ comment: '레벨', default: 0, unsigned: true })
  level: number;

  @Column({ comment: '갯수', default: 0, unsigned: true })
  count: number;

  @ManyToOne(() => UserDetailEntity, (userDetail) => userDetail.characters, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userDetail: Relation<Promise<UserDetail>>;
}
