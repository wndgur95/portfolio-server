import { Inject, Injectable } from '@nestjs/common';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { PageMetaDto } from '@libs/common/pagination/dto/page-meta.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { CreateDeveloperNoteInDto } from './dto/create-developer-note.dto';
import { USER_ROLES } from '@libs/common/constants/role.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { UpdateDeveloperNoteInDto } from './dto/update-developer-note.dto';
import { DeveloperNotesRepository } from '@libs/dao/common/developer-notes/interfaces/developer-notes-repository.interface';
import { DeveloperNoteDto } from '@libs/dao/common/developer-notes/dto/developer-note.dto';
import { DeveloperNote } from '@libs/dao/common/developer-notes/interfaces/developer-note.interface';
import { DeveloperNoteEntity } from '@libs/dao/common/developer-notes/entities/developer-note.entity';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class DeveloperNoteService {
  private developerNotes = null;

  constructor(
    @Inject(DeveloperNotesRepository)
    private readonly developerNotesRepository: DeveloperNotesRepository,
  ) {}

  async getDeveloperNote(
    pageOptionsDto: PageOptionsDto,
  ): Promise<[DeveloperNoteDto[], PageMetaDto]> {
    if (!this.developerNotes) {
      this.developerNotes = await this.developerNotesRepository.find({
        order: {
          id: 'DESC',
        },
      });
    }

    const now = ContextProvider.getNow();
    const startDeveloperNote = this.developerNotes.filter((it) => {
      return it.startAt <= now;
    });

    const { take, skip } = pageOptionsDto;
    const pagedData = startDeveloperNote.slice(skip, skip + take);

    return [
      pagedData,
      new PageMetaDto({
        pageOptionsDto,
        itemCount: this.developerNotes.length,
      }),
    ];
  }

  async createDeveloperNote(
    user: User,
    createDeveloperNoteInDto: CreateDeveloperNoteInDto,
  ): Promise<DeveloperNote> {
    if (user.roles != USER_ROLES.ADMIN) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PATCH_NOTE_CUD_ONLY_ADMIN,
      );
    }

    return await this._saveDeveloperNote(
      DeveloperNoteEntity.create({
        ...createDeveloperNoteInDto,
      }),
    );
  }

  async updateDeveloperNote(
    user: User,
    developerNoteId: number,
    updateDeveloperNoteInDto: UpdateDeveloperNoteInDto,
  ): Promise<DeveloperNote> {
    if (user.roles != USER_ROLES.ADMIN) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PATCH_NOTE_CUD_ONLY_ADMIN,
      );
    }
    const {
      title,
      functionalImprovement,
      futurePlan,
      developerMessage,
      startAt,
    } = updateDeveloperNoteInDto;

    const developerNote =
      await this.developerNotesRepository.findById(developerNoteId);
    developerNote.title = title;
    developerNote.functionalImprovement = functionalImprovement;
    developerNote.futurePlan = futurePlan;
    developerNote.developerMessage = developerMessage;
    developerNote.startAt = startAt;

    return await this._saveDeveloperNote(developerNote);
  }

  async deleteDeveloperNote(
    user: User,
    developerNoteId: number,
  ): Promise<void> {
    if (user.roles != USER_ROLES.ADMIN) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.PATCH_NOTE_CUD_ONLY_ADMIN,
      );
    }

    await this._deleteDeveloperNote(developerNoteId);
  }

  @Transactional()
  private async _saveDeveloperNote(
    developerNote: DeveloperNote,
  ): Promise<DeveloperNote> {
    return await this.developerNotesRepository.save(developerNote);
  }

  @Transactional()
  private async _deleteDeveloperNote(developerNoteId: number): Promise<void> {
    await this.developerNotesRepository.softDelete(developerNoteId);
  }
}
