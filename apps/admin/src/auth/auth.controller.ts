import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignUserInDto } from './dto/auth-sign-user-in.dto';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { AuthSignUserOutDto } from './dto/auth-sign-user-out.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh-auth.guard';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { GetApiKeyOutDto } from './dto/get-api-key-out.dto';
import { ApiKeyAuthGuard } from './guard/api-key-auth.guard';
import { GoogleFirebaseLoginInDto } from './dto/google-firebase-login-in.dto';
import { GoogleOauthLoginInDto } from './dto/google-oauth-login-in.dto';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ValidationInDto } from './dto/validation-in.dto';
import { SqlInjectionInDto } from './dto/sql-injection-in.dto';
import { SqlInjectionResultDto } from './dto/sql-injection-result.dto';
import { Auth } from './decorator/auth.decorator';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { Session } from '@libs/dao/redis/session/session.entity';

@ApiTags('auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   * */
  @Post('register')
  @ApiResponseEntity({
    type: AuthSignUserOutDto,
    summary: '회원가입 및 로그인',
  })
  async register(
    @Body() authSignUserInDto: AuthSignUserInDto,
  ): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const authSignUserOutDto =
      await this.authService.register(authSignUserInDto);

    return ResponseEntity.ok().body(authSignUserOutDto);
  }

  @Post('refresh')
  @ApiResponseEntity({ type: AuthSignUserOutDto, summary: '토큰 갱신' })
  @ApiBearerAuth('jwt-refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const authSignUserOutDto = await this.authService.refreshToken(user);

    return ResponseEntity.ok().body(authSignUserOutDto);
  }

  /**
   * OAUTH 인증 - Firebase 방식
   * */
  @Post('google/firebase/login')
  @ApiResponseEntity({
    type: AuthSignUserOutDto,
    summary: 'Firebase Google 로그인',
  })
  async googleFirebaseLogin(
    @Body() googleFirebaseLoginInDto: GoogleFirebaseLoginInDto,
  ): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const authSignUserOutDto = await this.authService.googleLoginWithIdToken(
      googleFirebaseLoginInDto.idToken,
    );

    return ResponseEntity.ok().body(authSignUserOutDto);
  }

  /**
   * OAUTH 인증 - Google OAuth 2.0 직접 구현
   * */
  @Post('google/oauth/login')
  @ApiResponseEntity({
    type: AuthSignUserOutDto,
    summary: 'Google OAuth 2.0 직접 로그인',
  })
  async googleOAuthLogin(
    @Body() googleOauthLoginInDto: GoogleOauthLoginInDto,
  ): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const authSignUserOutDto = await this.authService.googleLoginWithCode(
      googleOauthLoginInDto.code,
    );

    return ResponseEntity.ok().body(authSignUserOutDto);
  }

  /**
   * RBAC 권한 관리
   * */
  @Put('role')
  @ApiResponseEntity({ type: UserDto, summary: '관리자 권한 변경' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async updateRole(
    @Body() updateRoleUserDto: UpdateRoleUserDto,
  ): Promise<ResponseEntity<AuthSignUserOutDto>> {
    const authSignUserOutDto =
      await this.authService.updateRole(updateRoleUserDto);

    return ResponseEntity.ok().body(authSignUserOutDto);
  }
}
