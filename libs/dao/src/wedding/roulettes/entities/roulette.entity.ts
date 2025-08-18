import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Roulette } from '@libs/dao/wedding/roulettes/interfaces/roulette.interface';

@Entity('roulette')
@BaseTimeEntity()
export class RouletteEntity extends AbstractEntity implements Roulette {
  @Column()
  bride: number;

  @Column()
  groom: number;

  @Column({
    comment: '범위',
    type: 'longtext',
    transformer: {
      to(value: string[]): string {
        return JSON.stringify(value);
      },
      from(value: string): string[] {
        return JSON.parse(value);
      },
    },
  })
  pool: string;

  @Column({
    comment: '제외',
    type: 'longtext',
    transformer: {
      to(value: string[]): string {
        return JSON.stringify(value);
      },
      from(value: string): string[] {
        return JSON.parse(value);
      },
    },
  })
  exception: string;
}
