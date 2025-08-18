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
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { GroupService } from './group.service';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { GetGroupOutDto } from './dto/get-group.dto';
import { CreateGroupInDto, CreateGroupOutDto } from './dto/create-group.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { UpdateGroupInDto, UpdateGroupOutDto } from './dto/update-group.dto';

@ApiTags('group')
@Controller('group')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiResponseEntity({
    type: GetGroupOutDto,
    summary: '내 그룹 정보',
  })
  async getGuild(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<GetGroupOutDto>> {
    const getGroupOutDto = await this.groupService.getGroup(user.id);

    return ResponseEntity.ok().body(getGroupOutDto);
  }

  @Post('create')
  @ApiResponseEntity({
    type: CreateGroupOutDto,
    summary: '그룹 생성',
  })
  @UserLevelLock()
  async createGroup(
    @CurrentUser() user: User,
    @Body() createGroupInDto: CreateGroupInDto,
  ): Promise<ResponseEntity<CreateGroupOutDto>> {
    const createGroupOutDto = await this.groupService.createGroup(
      user,
      createGroupInDto,
    );

    return ResponseEntity.ok().body(createGroupOutDto);
  }

  @Put('update/:id')
  @ApiResponseEntity({
    type: CreateGroupOutDto,
    summary: '그룹 수정',
  })
  @UserLevelLock()
  async updateGroup(
    @CurrentUser() user: User,
    @Body() updateGroupInDto: UpdateGroupInDto,
    @Param('id') id: number,
  ): Promise<ResponseEntity<UpdateGroupOutDto>> {
    const updateGroupOutDto = await this.groupService.updateGroup(
      user,
      Number(id),
      updateGroupInDto,
    );

    return ResponseEntity.ok().body(updateGroupOutDto);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '그룹 삭제',
  })
  @UserLevelLock()
  async deleteGroup(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.groupService.deleteGroup(user, Number(id));

    return ResponseEntity.ok().build();
  }
}
