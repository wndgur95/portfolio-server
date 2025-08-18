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
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { IdeaService } from './idea.service';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { CreateIdeaInDto } from './dto/create-idea.dto';
import { GetIdeaOutDto } from './dto/get-idea.dto';
import { UpdateIdeaInDto } from './dto/update-idea.dto';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { GetIdeaCommentDto } from './dto/get-idea-comment.dto';
import { UpdateIdeaCommentInDto } from './dto/update-idea-comment.dto';
import { CreateIdeaCommentInDto } from './dto/create-idea-comment.dto';

@ApiTags('idea')
@Controller('idea')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  @ApiResponseEntity({
    type: GetIdeaOutDto,
    summary: '아이디어 리스트 가져오기',
  })
  async getIdea(
    @CurrentUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseEntity<GetIdeaOutDto[]>> {
    const [ideas, pageMetaDto] = await this.ideaService.getIdea(pageOptionsDto);

    return ResponseEntity.ok().body(ideas).setPageMeta(pageMetaDto);
  }

  @Get('my-idea')
  @ApiResponseEntity({
    type: GetIdeaOutDto,
    summary: '아이디어 리스트 가져오기',
  })
  async getMyIdea(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<GetIdeaOutDto[]>> {
    const ideas = await this.ideaService.getMyIdea(user);

    return ResponseEntity.ok().body(ideas);
  }

  @Get('comment/:ideaId')
  @ApiResponseEntity({
    type: UserDto,
    summary: '아이디어 댓글',
  })
  async getIdeaComment(
    @Param('ideaId') ideaId: number,
  ): Promise<ResponseEntity<GetIdeaCommentDto[]>> {
    const ideaComment = await this.ideaService.getIdeaComment(ideaId);

    return ResponseEntity.ok().body(ideaComment);
  }

  @Post('create')
  @ApiResponseEntity({
    type: GetIdeaOutDto,
    summary: '아이디어 생성',
  })
  @UserLevelLock()
  async createIdea(
    @CurrentUser() user: User,
    @Body() createIdeaInDto: CreateIdeaInDto,
  ): Promise<ResponseEntity<GetIdeaOutDto>> {
    const idea = await this.ideaService.createIdea(user, createIdeaInDto);

    return ResponseEntity.ok().body(idea);
  }

  @Post('comment/create')
  @ApiResponseEntity({
    type: GetIdeaCommentDto,
    summary: '아이디어 댓글 생성',
  })
  @UserLevelLock()
  async createIdeaComment(
    @CurrentUser() user: User,
    @Body() createIdeaCommentInDto: CreateIdeaCommentInDto,
  ): Promise<ResponseEntity<GetIdeaCommentDto>> {
    const getIdeaCommentDto = await this.ideaService.createIdeaComment(
      user,
      createIdeaCommentInDto,
    );

    return ResponseEntity.ok().body(getIdeaCommentDto);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: GetIdeaOutDto,
    summary: '아이디어 수정',
  })
  @UserLevelLock()
  async updateIdea(
    @CurrentUser() user: User,
    @Body() updateIdeaInDto: UpdateIdeaInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<GetIdeaOutDto>> {
    const idea = await this.ideaService.updateIdea(
      user,
      Number(id),
      updateIdeaInDto,
    );

    return ResponseEntity.ok().body(idea);
  }

  @Put('comment/update/:id')
  @ApiResponseEntity({
    type: GetIdeaCommentDto,
    summary: '아이디어 댓글 수정',
  })
  @UserLevelLock()
  async updateIdeaComment(
    @CurrentUser() user: User,
    @Body() updateIdeaCommentInDto: UpdateIdeaCommentInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<GetIdeaCommentDto>> {
    const ideaComment = await this.ideaService.updateIdeaComment(
      user,
      Number(id),
      updateIdeaCommentInDto,
    );

    return ResponseEntity.ok().body(ideaComment);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '아이디어 삭제',
  })
  @UserLevelLock()
  async deleteIdea(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.ideaService.deleteIdea(user, Number(id));

    return ResponseEntity.ok().build();
  }

  @Delete('comment/delete/:id')
  @ApiResponseEntity({
    summary: '아이디어 댓글 삭제',
  })
  @UserLevelLock()
  async deleteIdeaComment(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.ideaService.deleteIdeaComment(user, Number(id));

    return ResponseEntity.ok().build();
  }

  @Put('count-do-it/:id')
  @ApiResponseEntity({
    summary: '해줘 포인트',
  })
  @UserLevelLock()
  async countDoIt(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<boolean>> {
    return ResponseEntity.ok().body(await this.ideaService.countDoIt(user, id));
  }
}
