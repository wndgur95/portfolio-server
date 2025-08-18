import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { DeveloperNoteEntity } from "@libs/dao/common/developer-notes/entities/developer-note.entity";

export interface DeveloperNotesRepository extends AbstractRepositoryInterface<DeveloperNoteEntity> {}

export const DeveloperNotesRepository = Symbol('DeveloperNotesRepository');