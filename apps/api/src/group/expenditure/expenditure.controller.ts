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
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { ExpenditureService } from './expenditure.service';
import {
  GetExpenditureInDto,
  GetExpenditureOutDto,
} from './dto/get-expenditure.dto';
import {
  CreateExpenditureInDto,
  CreateExpenditureOutDto,
} from './dto/create-expenditure.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import {
  UpdateExpenditureInDto,
  UpdateExpenditureOutDto,
} from './dto/update-expenditure.dto';
import { InviteGroupMemberInDto } from './dto/invite-group-member.dto';
import { GroupMember } from '@libs/dao/common/group-members/interfaces/group-member.interface';
import {
  GetExpenditureCalendarInDto,
  GetExpenditureCalendarOutDto,
} from './dto/get-expenditure-calendar.dto';

@ApiTags('expenditure')
@Controller('expenditure')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class ExpenditureController {
  constructor(private readonly expenditureService: ExpenditureService) {}

  @Get()
  @ApiResponseEntity({
    type: GetExpenditureOutDto,
    summary: '그룹 내역 정보',
  })
  async getExpenditure(
    @CurrentUser() user: User,
    @Query() getExpenditureInDto: GetExpenditureInDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseEntity<GetExpenditureOutDto>> {
    const [getGroupOutDto, pageMetaDto] =
      await this.expenditureService.getExpenditure(
        user,
        getExpenditureInDto,
        pageOptionsDto,
      );

    return ResponseEntity.ok().body(getGroupOutDto).setPageMeta(pageMetaDto);
  }

  @Get('calendar')
  @ApiResponseEntity({
    type: GetExpenditureCalendarOutDto,
    summary: '그룹 캘린더 정보',
  })
  async getExpenditureCalendar(
    @CurrentUser() user: User,
    @Query() getExpenditureCalendarInDto: GetExpenditureCalendarInDto,
  ): Promise<ResponseEntity<GetExpenditureCalendarOutDto>> {
    const getExpenditureCalendarOutDto =
      await this.expenditureService.getExpenditureCalendar(
        user,
        getExpenditureCalendarInDto,
      );

    return ResponseEntity.ok().body(getExpenditureCalendarOutDto);
  }

  @Post('create')
  @ApiResponseEntity({
    type: CreateExpenditureOutDto,
    summary: '내역 생성',
  })
  @UserLevelLock()
  async createExpenditure(
    @CurrentUser() user: User,
    @Body() createExpenditureInDto: CreateExpenditureInDto,
  ): Promise<ResponseEntity<CreateExpenditureOutDto>> {
    const createExpenditureOutDto =
      await this.expenditureService.createExpenditure(
        user,
        createExpenditureInDto,
      );

    return ResponseEntity.ok().body(createExpenditureOutDto);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: UpdateExpenditureOutDto,
    summary: '그룹 수정',
  })
  @UserLevelLock()
  async updateExpenditure(
    @CurrentUser() user: User,
    @Body() updateExpenditureInDto: UpdateExpenditureInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<UpdateExpenditureOutDto>> {
    const updateExpenditureOutDto =
      await this.expenditureService.updateExpenditure(
        user,
        Number(id),
        updateExpenditureInDto,
      );

    return ResponseEntity.ok().body(updateExpenditureOutDto);
  }

  @Delete('delete/:groupId/:id')
  @ApiResponseEntity({
    summary: '내역 삭제',
  })
  @UserLevelLock()
  async deleteExpenditure(
    @CurrentUser() user: User,
    @Param('groupId') groupId: number,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.expenditureService.deleteExpenditure(
      user,
      Number(groupId),
      Number(id),
    );

    return ResponseEntity.ok().build();
  }

  @Post('invite')
  @ApiResponseEntity({
    summary: '멤버 초대',
  })
  @UserLevelLock()
  async inviteGroupMember(
    @CurrentUser() user: User,
    @Body() inviteGroupMemberInDto: InviteGroupMemberInDto,
  ): Promise<ResponseEntity<GroupMember>> {
    const groupMember = await this.expenditureService.inviteGroupMember(
      user,
      inviteGroupMemberInDto,
    );

    return ResponseEntity.ok().body(groupMember);
  }
}
