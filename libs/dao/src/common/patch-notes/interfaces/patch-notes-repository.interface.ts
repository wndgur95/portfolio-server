import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { PatchNoteEntity } from '@libs/dao/common/patch-notes/entities/patch-note.entity';
import { PatchNote } from '@libs/dao/common/patch-notes/interfaces/patch-note.interface';

export interface PatchNotesRepository
  extends AbstractRepositoryInterface<PatchNoteEntity> {
  findByStartAt(startAt: Date): Promise<PatchNote[]>;
}

export const PatchNotesRepository = Symbol('PatchNotesRepository');
