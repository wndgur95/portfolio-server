import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/role/role.decorator';
import { USER_ROLES } from '@libs/common/constants/role.constants';
import { GetUserOutDto } from './dto/get-user-out.dto';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiResponseEntity({
    type: GetUserOutDto,
    summary: '유저 정보 가져오기',
  })
  @UseGuards(JwtAuthGuard)
  async getUser(): Promise<ResponseEntity<GetUserOutDto>> {
    const getUserOutDto = await this.userService.getUser();

    return ResponseEntity.ok().body(getUserOutDto);
  }

  @Post('rbac/admin')
  @ApiResponseEntity({
    summary: 'admin 권한 확인',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USER_ROLES.ADMIN)
  async rbacAdmin(): Promise<ResponseEntity<string>> {
    return ResponseEntity.ok().body('admin 권한 확인');
  }

  @Post('rbac/manager')
  @ApiResponseEntity({
    summary: 'manager 권한 확인',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USER_ROLES.MANAGER)
  async rbacManager(): Promise<ResponseEntity<string>> {
    return ResponseEntity.ok().body('manager 권한 확인');
  }

  @Post('rbac/developer')
  @ApiResponseEntity({
    summary: 'admin 권한 확인',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USER_ROLES.DEVELOPER)
  async rbacDeveloper(): Promise<ResponseEntity<string>> {
    return ResponseEntity.ok().body('developer 권한 확인');
  }

  @Post('rbac/guest')
  @ApiResponseEntity({
    summary: 'guest 권한 확인',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USER_ROLES.GUEST)
  async rbacGuest(): Promise<ResponseEntity<string>> {
    return ResponseEntity.ok().body('guest 권한 확인');
  }
}
