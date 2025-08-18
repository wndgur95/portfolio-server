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
import { DeveloperNoteService } from './developer-note.service';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { CreateDeveloperNoteInDto } from './dto/create-developer-note.dto';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { UpdateDeveloperNoteInDto } from './dto/update-developer-note.dto';
import { DeveloperNoteDto } from '@libs/dao/common/developer-notes/dto/developer-note.dto';
import { DeveloperNote } from '@libs/dao/common/developer-notes/interfaces/developer-note.interface';

@ApiTags('developer-note')
@Controller('developer-note')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class DeveloperNoteController {
  constructor(private readonly developerNoteService: DeveloperNoteService) {}

  @Get()
  @ApiResponseEntity({
    type: DeveloperNoteDto,
    summary: '개발자 노트 가져오기',
  })
  async getDeveloperNote(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseEntity<DeveloperNoteDto[]>> {
    const [developerNotes, pageMetaDto] =
      await this.developerNoteService.getDeveloperNote(pageOptionsDto);

    return ResponseEntity.ok().body(developerNotes).setPageMeta(pageMetaDto);
  }

  @Post('create')
  @ApiResponseEntity({
    type: DeveloperNoteDto,
    summary: '개발자 노트 생성',
  })
  @UserLevelLock()
  async createDeveloperNote(
    @CurrentUser() user: User,
    @Body() createDeveloperNoteInDto: CreateDeveloperNoteInDto,
  ): Promise<ResponseEntity<DeveloperNote>> {
    const developerNote = await this.developerNoteService.createDeveloperNote(
      user,
      createDeveloperNoteInDto,
    );

    return ResponseEntity.ok().body(developerNote);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: DeveloperNoteDto,
    summary: '개발자 노트 수정',
  })
  @UserLevelLock()
  async updateDeveloperNote(
    @CurrentUser() user: User,
    @Body() updateDeveloperNoteInDto: UpdateDeveloperNoteInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<DeveloperNote>> {
    const developerNote = await this.developerNoteService.updateDeveloperNote(
      user,
      Number(id),
      updateDeveloperNoteInDto,
    );

    return ResponseEntity.ok().body(developerNote);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '개발자 노트 삭제',
  })
  @UserLevelLock()
  async deleteDeveloperNote(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.developerNoteService.deleteDeveloperNote(user, Number(id));

    return ResponseEntity.ok().build();
  }
}
