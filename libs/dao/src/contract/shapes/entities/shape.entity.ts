import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Shape } from '@libs/dao/contract/shapes/interfaces/shape.interface';

@Entity('shape')
@BaseTimeEntity()
export class ShapeEntity extends AbstractEntity implements Shape {
  @Index()
  @Column({ comment: '토큰 주인' })
  owner: string;

  @Index()
  @Column()
  userId: number;

  @Index()
  @Column({ comment: '도형 id', unsigned: true })
  shapeId: number;

  @Column({ comment: '도형 경험치', default: 0, unsigned: true })
  exp: number;

  @Column({ comment: '도형 레벨', default: 0, unsigned: true })
  level: number;

  @Column({ comment: '도형 색', default: '', })
  color: string;

  @Index()
  @Column({
    type: 'bigint',
    comment: '토큰 id',
    unsigned: true,
  })
  tokenId: number;

  @Column({ comment: '상태값' })
  status: string;
}
