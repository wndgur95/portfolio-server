import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

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
}
