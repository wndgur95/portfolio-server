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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * JTW 인증
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

  @Post('jwt-validator')
  @ApiResponseEntity({ type: UserDto, summary: 'jwt 유효성 검증' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async jwtValidator(
    @CurrentUser() user: JwtPayload,
  ): Promise<ResponseEntity<JwtPayload>> {
    return ResponseEntity.ok().body(user);
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
   * API 인증
   * */
  @Post('api-key')
  @ApiResponseEntity({ type: GetApiKeyOutDto, summary: '1분 api key 발급' })
  async getApiKey(): Promise<ResponseEntity<GetApiKeyOutDto>> {
    const getApiKeyOutDto = this.authService.getApiKey();

    return ResponseEntity.ok().body(getApiKeyOutDto);
  }

  @Post('api-key-validator')
  @ApiResponseEntity({ type: GetApiKeyOutDto, summary: '1분 api key 발급' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  async apiKeyValidator(): Promise<ResponseEntity<string>> {
    return ResponseEntity.ok().body('유효한 api key 확인 완료');
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
