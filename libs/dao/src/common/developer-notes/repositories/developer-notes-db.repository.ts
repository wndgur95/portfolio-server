import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { DeveloperNoteEntity } from '@libs/dao/common/developer-notes/entities/developer-note.entity';
import { DeveloperNotesRepository } from '@libs/dao/common/developer-notes/interfaces/developer-notes-repository.interface';

@EntityRepository(DeveloperNoteEntity)
export class DeveloperNotesDbRepository
  extends AbstractRepository<DeveloperNoteEntity>
  implements DeveloperNotesRepository {}