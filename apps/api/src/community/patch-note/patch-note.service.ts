import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { PatchNotesRepository } from '@libs/dao/common/patch-notes/interfaces/patch-notes-repository.interface';
import { PatchNoteDto } from '@libs/dao/common/patch-notes/dto/patch-note.dto';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { PageMetaDto } from '@libs/common/pagination/dto/page-meta.dto';
import { PatchNote } from '@libs/dao/common/patch-notes/interfaces/patch-note.interface';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { CreatePatchNoteInDto } from './dto/create-patch-note.dto';
import { USER_ROLES } from '@libs/common/constants/role.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { PatchNoteEntity } from '@libs/dao/common/patch-notes/entities/patch-note.entity';
import { UpdatePatchNoteInDto } from './dto/update-patch-note.dto';

@Injectable()
export class PatchNoteService {
  private patchNotes = null;

  constructor(
    @Inject(PatchNotesRepository)
    private readonly patchNotesRepository: PatchNotesRepository,
  ) {}

  async getPatchNote(
    pageOptionsDto: PageOptionsDto,
  ): Promise<[PatchNoteDto[], PageMetaDto]> {
    if (!this.patchNotes) {
      this.patchNotes = await this.patchNotesRepository.find({
        order: {
          id: 'DESC',
        },
      });
    }

    const now = ContextProvider.getNow();
    const startPatchNote = this.patchNotes.filter((it) => {
      return it.startAt <= now;
    });

    const { take, skip } = pageOptionsDto;
    const pagedData = startPatchNote.slice(skip, skip + take);

    return [
      pagedData,
      new PageMetaDto({
        pageOptionsDto,
        itemCount: startPatchNote.length,
      }),
    ];
  }

  async createPatchNote(
    user: User,
    createPatchNoteInDto: CreatePatchNoteInDto,
  ): Promise<PatchNote> {
    if (user.roles != USER_ROLES.ADMIN) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PATCH_NOTE_CUD_ONLY_ADMIN,
      );
    }

    return await this._savePatchNote(
      PatchNoteEntity.create({
        ...createPatchNoteInDto,
      }),
    );
  }

  async updatePatchNote(
    user: User,
    patchNoteId: number,
    updatePatchNoteInDto: UpdatePatchNoteInDto,
  ): Promise<PatchNote> {
    if (user.roles != USER_ROLES.ADMIN) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PATCH_NOTE_CUD_ONLY_ADMIN,
      );
    }
    const { title, contexts, startAt } = updatePatchNoteInDto;

    const patchNote = await this.patchNotesRepository.findById(patchNoteId);
    patchNote.title = title;
    patchNote.contexts = contexts;
    patchNote.startAt = startAt;

    return await this._savePatchNote(patchNote);
  }

  async deletePatchNote(user: User, patchNoteId: number): Promise<void> {
    if (user.roles != USER_ROLES.ADMIN) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PATCH_NOTE_CUD_ONLY_ADMIN,
      );
    }

    await this._deletePatchNote(patchNoteId);
  }

  @Transactional()
  private async _savePatchNote(patchNote: PatchNote): Promise<PatchNote> {
    return await this.patchNotesRepository.save(patchNote);
  }

  @Transactional()
  private async _deletePatchNote(patchNoteId: number): Promise<void> {
    await this.patchNotesRepository.softDelete(patchNoteId);
  }
}
