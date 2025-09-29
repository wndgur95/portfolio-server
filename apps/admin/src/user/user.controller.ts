import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/role/role.decorator';
import { USER_ROLES } from '@libs/common/constants/role.constants';
import { GetUserOutDto } from './dto/get-user-out.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@ApiTags('user')
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('get')
  @ApiResponseEntity({
    type: GetUserOutDto,
    summary: '유저 정보 가져오기',
  })
  @Auth()
  async getUser(): Promise<ResponseEntity<GetUserOutDto>> {
    const getUserOutDto = await this.userService.getUser();

    return ResponseEntity.ok().body(getUserOutDto);
  }

  @Post('rbac/admin')
  @ApiResponseEntity({
    summary: 'admin 권한 확인',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USER_ROLES.ADMIN)
  async rbacAdmin(): Promise<ResponseEntity<string>> {
    return ResponseEntity.ok().body('admin 권한 확인');
  }
}
