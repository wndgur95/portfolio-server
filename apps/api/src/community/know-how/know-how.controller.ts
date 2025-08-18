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
import { KnowHowService } from './know-how.service';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { GetKnowHowCommentDto } from './dto/get-know-how-comment.dto';
import { GetKnowHowDto } from './dto/get-know-how.dto';
import { CreateKnowHowInDto } from './dto/create-know-how.dto';
import { CreateKnowHowCommentInDto } from './dto/create-know-how-comment.dto';
import { UpdateKnowHowInDto } from './dto/update-know-how.dto';
import { UpdateKnowHowCommentInDto } from './dto/update-know-how-comment.dto';

@ApiTags('know-how')
@Controller('know-how')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class KnowHowController {
  constructor(private readonly knowHowService: KnowHowService) {}

  @Get()
  @ApiResponseEntity({
    type: GetKnowHowDto,
    summary: '노하우 리스트 가져오기',
  })
  async getKnowHow(
    @CurrentUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseEntity<GetKnowHowDto[]>> {
    const [ideas, pageMetaDto] =
      await this.knowHowService.getKnowHow(pageOptionsDto);

    return ResponseEntity.ok().body(ideas).setPageMeta(pageMetaDto);
  }

  @Get('my-know-how')
  @ApiResponseEntity({
    type: GetKnowHowDto,
    summary: '내 노하우 리스트 가져오기',
  })
  async getMyKnowHow(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<GetKnowHowDto[]>> {
    const knowHows = await this.knowHowService.getMyKnowHow(user);

    return ResponseEntity.ok().body(knowHows);
  }

  @Get('comment/:knowHowId')
  @ApiResponseEntity({
    type: UserDto,
    summary: '노하우 댓글',
  })
  async getKnowHowComment(
    @Param('knowHowId') knowHowId: number,
  ): Promise<ResponseEntity<GetKnowHowCommentDto[]>> {
    const knowHows = await this.knowHowService.getKnowHowComment(knowHowId);

    return ResponseEntity.ok().body(knowHows);
  }

  @Post('create')
  @ApiResponseEntity({
    type: GetKnowHowDto,
    summary: '노하우 생성',
  })
  @UserLevelLock()
  async createKnowHow(
    @CurrentUser() user: User,
    @Body() createKnowHowInDto: CreateKnowHowInDto,
  ): Promise<ResponseEntity<GetKnowHowDto>> {
    const knowHow = await this.knowHowService.createKnowHow(
      user,
      createKnowHowInDto,
    );

    return ResponseEntity.ok().body(knowHow);
  }

  @Post('comment/create')
  @ApiResponseEntity({
    type: GetKnowHowCommentDto,
    summary: '노하우 댓글 생성',
  })
  @UserLevelLock()
  async createKnowHowComment(
    @CurrentUser() user: User,
    @Body() createKnowHowCommentInDto: CreateKnowHowCommentInDto,
  ): Promise<ResponseEntity<GetKnowHowCommentDto>> {
    const knowHowComment = await this.knowHowService.createKnowHowComment(
      user,
      createKnowHowCommentInDto,
    );

    return ResponseEntity.ok().body(knowHowComment);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: GetKnowHowDto,
    summary: '노하우 수정',
  })
  @UserLevelLock()
  async updateKnowHow(
    @CurrentUser() user: User,
    @Body() updateKnowHowInDto: UpdateKnowHowInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<GetKnowHowDto>> {
    const knowHow = await this.knowHowService.updateKnowHow(
      user,
      Number(id),
      updateKnowHowInDto,
    );

    return ResponseEntity.ok().body(knowHow);
  }

  @Put('comment/update/:id')
  @ApiResponseEntity({
    type: GetKnowHowCommentDto,
    summary: '노하우 댓글 수정',
  })
  @UserLevelLock()
  async updateKnowHowComment(
    @CurrentUser() user: User,
    @Body() updateKnowHowCommentInDto: UpdateKnowHowCommentInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<GetKnowHowCommentDto>> {
    const knowHowComment = await this.knowHowService.updateKnowHowComment(
      user,
      Number(id),
      updateKnowHowCommentInDto,
    );

    return ResponseEntity.ok().body(knowHowComment);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '노하우 삭제',
  })
  @UserLevelLock()
  async deleteKnowHow(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.knowHowService.deleteKnowHow(user, Number(id));

    return ResponseEntity.ok().build();
  }

  @Delete('comment/delete/:id')
  @ApiResponseEntity({
    summary: '노하우 댓글 삭제',
  })
  @UserLevelLock()
  async deleteKnowHowComment(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.knowHowService.deleteKnowHowComment(user, Number(id));

    return ResponseEntity.ok().build();
  }

  @Put('count-recommend/:id')
  @ApiResponseEntity({
    summary: '추천 포인트',
  })
  @UserLevelLock()
  async countRecommend(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<boolean>> {
    return ResponseEntity.ok().body(
      await this.knowHowService.countRecommend(user, id),
    );
  }
}
