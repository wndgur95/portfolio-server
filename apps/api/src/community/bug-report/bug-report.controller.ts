import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { BugReportService } from './bug-report.service';
import { GetBugReportOutDto } from './dto/get-bug-report.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import {
  CreateBugReportInDto,
  CreateBugReportOutDto,
} from './dto/create-bug-report.dto';
import {
  UpdateBugReportInDto,
  UpdateBugReportOutDto,
} from './dto/update-bug-report.dto';
import { GetBugReportCommentDto } from './dto/get-bug-report-comment.dto';
import {
  CreateBugReportCommentInDto,
  CreateBugReportCommentOutDto,
} from './dto/create-bug-report-comment.dto';
import {
  UpdateBugReportCommentInDto,
  UpdateBugReportCommentOutDto,
} from './dto/update-bug-report-comment.dto';

@ApiTags('bug-report')
@Controller('bug-report')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class BugReportController {
  constructor(private readonly bugReportService: BugReportService) {}

  @Get()
  @ApiResponseEntity({
    type: UserDto,
    summary: '내 버그 리포트',
  })
  async getBugReport(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<GetBugReportOutDto[]>> {
    const getBugReportOutDto = await this.bugReportService.getBugReport(
      user.id,
    );

    return ResponseEntity.ok().body(getBugReportOutDto);
  }

  @Get('comment/:bugReportId')
  @ApiResponseEntity({
    type: UserDto,
    summary: '내 버그 리포트 댓글',
  })
  async getBugReportComment(
    @CurrentUser() user: User,
    @Param('bugReportId') bugReportId: number,
  ): Promise<ResponseEntity<GetBugReportCommentDto[]>> {
    const getBugReportCommentDto =
      await this.bugReportService.getBugReportComment(user, bugReportId);

    return ResponseEntity.ok().body(getBugReportCommentDto);
  }

  @Post('create')
  @ApiResponseEntity({
    type: CreateBugReportOutDto,
    summary: '버그 생성',
  })
  @UserLevelLock()
  async createBugReport(
    @CurrentUser() user: User,
    @Body() createBugReportInDto: CreateBugReportInDto,
  ): Promise<ResponseEntity<CreateBugReportOutDto>> {
    const createBugReportOutDto = await this.bugReportService.createBugReport(
      user,
      createBugReportInDto,
    );

    return ResponseEntity.ok().body(createBugReportOutDto);
  }

  @Post('comment/create')
  @ApiResponseEntity({
    type: CreateBugReportOutDto,
    summary: '버그 댓글 생성',
  })
  @UserLevelLock()
  async createBugReportComment(
    @CurrentUser() user: User,
    @Body() createBugReportCommentInDto: CreateBugReportCommentInDto,
  ): Promise<ResponseEntity<CreateBugReportCommentOutDto>> {
    const createBugReportCommentOutDto =
      await this.bugReportService.createBugReportComment(
        user,
        createBugReportCommentInDto,
      );

    return ResponseEntity.ok().body(createBugReportCommentOutDto);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: UpdateBugReportOutDto,
    summary: '버그 수정',
  })
  @UserLevelLock()
  async updateBugReport(
    @CurrentUser() user: User,
    @Body() updateBugReportInDto: UpdateBugReportInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<UpdateBugReportOutDto>> {
    const updateGroupOutDto = await this.bugReportService.updateBugReport(
      user,
      Number(id),
      updateBugReportInDto,
    );

    return ResponseEntity.ok().body(updateGroupOutDto);
  }

  @Put('comment/update/:id')
  @ApiResponseEntity({
    type: UpdateBugReportCommentOutDto,
    summary: '버그 댓글 수정',
  })
  @UserLevelLock()
  async updateBugReportComment(
    @CurrentUser() user: User,
    @Body() updateBugReportCommentInDto: UpdateBugReportCommentInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<UpdateBugReportCommentOutDto>> {
    const updateBugReportCommentOutDto =
      await this.bugReportService.updateBugReportComment(
        user,
        Number(id),
        updateBugReportCommentInDto,
      );

    return ResponseEntity.ok().body(updateBugReportCommentOutDto);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '버그 삭제',
  })
  @UserLevelLock()
  async deleteBugReport(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.bugReportService.deleteBugReport(user, Number(id));

    return ResponseEntity.ok().build();
  }

  @Delete('comment/delete/:id')
  @ApiResponseEntity({
    summary: '버그 댓글 삭제',
  })
  @UserLevelLock()
  async deleteBugReportComment(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.bugReportService.deleteBugReportComment(user, Number(id));

    return ResponseEntity.ok().build();
  }
}
