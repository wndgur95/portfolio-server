import { BaseTimeEntity } from '@libs/dao/base/time/base-time.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('saju_results')
export class SajuResultEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  shareKey: string;

  @Index()
  @Column({ type: 'varchar', length: 32 })
  category: string; // 'fruit' | 'dessert' | 'drink' 등

  @Column({ type: 'varchar', length: 64 })
  userName: string;

  @Column({ type: 'int' })
  solarYear: number;

  @Column({ type: 'int' })
  solarMonth: number;

  @Column({ type: 'int' })
  solarDay: number;

  @Column({ type: 'int', default: -1 })
  hourIndex: number;

  @Column({ type: 'varchar', length: 16 })
  gender: string;

  @Column({ type: 'varchar', length: 16 })
  dominantElement: string;

  @Column({ type: 'varchar', length: 255 })
  resultTitle: string;

  @Column({ type: 'varchar', length: 32 })
  resultEmoji: string;

  @Column({ type: 'json' })
  resultData: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  viewCount: number;
}
