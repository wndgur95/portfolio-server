import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { DeveloperNote } from '@libs/dao/common/developer-notes/interfaces/developer-note.interface';

@Entity('developer_note')
@BaseTimeEntity()
export class DeveloperNoteEntity
  extends AbstractEntity
  implements DeveloperNote
{
  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  functionalImprovement?: string;

  @Column({ type: 'text', nullable: true })
  futurePlan?: string;

  @Column({ type: 'text', nullable: true })
  developerMessage?: string;

  @Column()
  startAt: Date;
}
