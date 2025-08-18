import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PatchNoteService } from './patch-note.service';
import { PatchNoteDto } from '@libs/dao/common/patch-notes/dto/patch-note.dto';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { CreatePatchNoteInDto } from './dto/create-patch-note.dto';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { PatchNote } from '@libs/dao/common/patch-notes/interfaces/patch-note.interface';
import { UpdatePatchNoteInDto } from './dto/update-patch-note.dto';

@ApiTags('patch-note')
@Controller('patch-note')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class PatchNoteController {
  constructor(private readonly patchNoteService: PatchNoteService) {}

  @Get()
  @ApiResponseEntity({
    type: PatchNoteDto,
    summary: '패치노트 가져오기',
  })
  async getPatchNote(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseEntity<PatchNoteDto[]>> {
    const [patchNotes, pageMetaDto] =
      await this.patchNoteService.getPatchNote(pageOptionsDto);

    return ResponseEntity.ok().body(patchNotes).setPageMeta(pageMetaDto);
  }

  @Post('create')
  @ApiResponseEntity({
    type: PatchNoteDto,
    summary: '패치 노트 생성',
  })
  @UserLevelLock()
  async createPatchNote(
    @CurrentUser() user: User,
    @Body() createPatchNoteInDto: CreatePatchNoteInDto,
  ): Promise<ResponseEntity<PatchNote>> {
    const patchNote = await this.patchNoteService.createPatchNote(
      user,
      createPatchNoteInDto,
    );

    return ResponseEntity.ok().body(patchNote);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: PatchNoteDto,
    summary: '패치 노트 수정',
  })
  @UserLevelLock()
  async updatePatchNote(
    @CurrentUser() user: User,
    @Body() updatePatchNoteInDto: UpdatePatchNoteInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<PatchNote>> {
    const patchNote = await this.patchNoteService.updatePatchNote(
      user,
      Number(id),
      updatePatchNoteInDto,
    );

    return ResponseEntity.ok().body(patchNote);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '패치 노트 삭제',
  })
  @UserLevelLock()
  async deletePatchNote(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.patchNoteService.deletePatchNote(user, Number(id));

    return ResponseEntity.ok().build();
  }
}
