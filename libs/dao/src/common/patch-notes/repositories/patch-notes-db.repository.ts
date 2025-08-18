import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { PatchNoteEntity } from '@libs/dao/common/patch-notes/entities/patch-note.entity';
import { PatchNotesRepository } from '@libs/dao/common/patch-notes/interfaces/patch-notes-repository.interface';

@EntityRepository(PatchNoteEntity)
export class PatchNotesDbRepository
  extends AbstractRepository<PatchNoteEntity>
  implements PatchNotesRepository
{
  async findByStartAt(startAt: Date): Promise<PatchNoteEntity[]> {
    return await this.queryBuilder
      .where(`${this.alias}.startAt <= :startAt`, { startAt })
      .getMany();
  }
}
