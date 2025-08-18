import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { PatchNote } from '@libs/dao/common/patch-notes/interfaces/patch-note.interface';

@Entity('patch_note')
@BaseTimeEntity()
export class PatchNoteEntity extends AbstractEntity implements PatchNote {
  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  contexts: string;

  @Index()
  @Column()
  startAt: Date;
}
