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
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { UpdateActivateUserDto } from './dto/update-activate-user.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/role/role.decorator';
import { USER_ROLES } from '@libs/common/constants/role.constants';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { AuthSignUserInDto } from '../auth/dto/auth-sign-user-in.dto';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiResponseEntity({
    type: UserDto,
    isPagination: true,
    summary: '전체 관리자 정보 - pagination',
  })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseEntity<UserDto[]>> {
    const [usersDto, pageMetaDto] =
      await this.userService.findAll(pageOptionsDto);
    return ResponseEntity.ok().body(usersDto).setPageMeta(pageMetaDto);
  }

  @Get('/:id')
  @ApiResponseEntity({ type: UserDto, summary: '관리자 정보' })
  async findOne(@Param('id') id: number): Promise<ResponseEntity<UserDto>> {
    const userDto = await this.userService.findById(id);
    return ResponseEntity.ok().body(userDto);
  }

  @Put('/role')
  @ApiResponseEntity({ type: UserDto, summary: '관리자 권한 변경' })
  @Roles(USER_ROLES.ADMIN)
  async updateRole(
    @Body() updateRoleAdminUserDto: UpdateRoleUserDto,
  ): Promise<ResponseEntity<UserDto>> {
    const userDto = await this.userService.updateRole(updateRoleAdminUserDto);
    return ResponseEntity.ok().body(userDto);
  }

  @Post('/change/password')
  @ApiResponseEntity({ type: UserDto, summary: '어드민 비밀번호 변경' })
  @Roles(USER_ROLES.GUEST)
  async changePassword(
    @Body() userInDto: AuthSignUserInDto,
    @CurrentUser() user: UserDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.userService.changePassword(userInDto, user.email);
    return ResponseEntity.ok().build();
  }

  @Delete('/:id')
  @ApiResponseEntity({ summary: '어드민 유저 삭제' })
  @Roles(USER_ROLES.ADMIN)
  async removeAdminUser(
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.userService.removeUser(id);

    return ResponseEntity.ok().build();
  }
}
