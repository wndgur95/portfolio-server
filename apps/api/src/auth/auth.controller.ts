import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignUserInDto } from './dto/auth-sign-user-in.dto';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { AuthSignUserOutDto } from './dto/auth-sign-user-out.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { BasicAuthGuard } from './guard/basic-auth.guard';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RoleGuard } from './guard/role.guard';
import { Roles } from './role/role.decorator';
import { USER_ROLES } from '@libs/common/constants/role.constants';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { getDatabaseByUserDbId } from '@libs/dao/config/user/user-database-config.util';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiResponseEntity({ type: UserDto, summary: '어드민 유저 가입' })
  async signup(
    @Body() adminUserInDto: AuthSignUserInDto,
  ): Promise<ResponseEntity<UserDto>> {
    const newUser = await this.userService.signup(adminUserInDto);
    return ResponseEntity.ok().body(newUser);
  }

  @Post('/login')
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @ApiResponseEntity({
    type: AuthSignUserOutDto,
    summary: '어드민 유저 로그인',
  })
  async login(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const result = await this.handleLogin(user);
    return ResponseEntity.ok().body(result);
  }

  @Post('kakao/login')
  @ApiResponseEntity({
    type: AuthSignUserOutDto,
    summary: '카카오 유저 로그인',
  })
  @ApiBearerAuth('kakao-token')
  @UseGuards(AuthGuard('kakao-token'))
  async kakaoLogin(@Req() req): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const { kakaoId, name, profileImage, provider } = req.user;
    const user = await this.authService.kakaoLogin(
      kakaoId.toString(),
      name,
      provider,
      profileImage,
    );
    const result = await this.handleLogin(user);
    return ResponseEntity.ok().body(result);
  }

  @Post('google/login')
  @ApiResponseEntity({ type: AuthSignUserOutDto, summary: '구글 유저 로그인' })
  @ApiBearerAuth('google-token')
  @UseGuards(AuthGuard('google-token'))
  async googleLogin(@Req() req): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const { email, name, picture, googleId, provider } = req.user;
    const user = await this.authService.googleLogin(
      googleId.toString(),
      email,
      name,
      provider,
      picture,
    );
    const result = await this.handleLogin(user);
    return ResponseEntity.ok().body(result);
  }

  // ✅ 중복 제거: 로그인 후 공통 처리 메서드
  private async handleLogin(user: User): Promise<AuthSignUserOutDto> {
    if (!user.userDbId) {
      await this.userService.createUserDetail(user);
    }

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      recommendCode: user.recommendCode,
      email: user.email ?? '',
      roles: user.roles,
      activatedAt: user.activatedAt,
      image: user.image ?? '',
      userDbId: user.userDbId || 0,
      database: user.userDbId ? getDatabaseByUserDbId(user.userDbId) : '',
    };

    return AuthSignUserOutDto.of(user).setAuthToken(
      this.authService.makeAuthToken(payload),
    );
  }
}
