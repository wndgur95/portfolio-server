import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { Currency } from '@libs/dao/game/user-details/type/currency';
import { InitAt } from '@libs/dao/game/user-details/type/init-at';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';
import { CharacterEntity } from '@libs/dao/game/characters/entities/character.entity';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';
import { MissionEntity } from '@libs/dao/game/missions/entities/mission.entity';

@Entity('user_detail')
@BaseTimeEntity()
export class UserDetailEntity extends AbstractEntity implements UserDetail {
  @Index({ unique: true })
  @Column({ comment: '유저 id', unsigned: true })
  userId: number;

  @Column(() => Currency)
  currency: Currency;

  @Column(() => InitAt)
  initAt: InitAt;

  @OneToMany(() => CharacterEntity, (character) => character.userDetail)
  characters: Relation<Promise<Character[]>>;

  @OneToMany(() => MissionEntity, (mission) => mission.userDetail)
  missions: Relation<Promise<Mission[]>>;
}
