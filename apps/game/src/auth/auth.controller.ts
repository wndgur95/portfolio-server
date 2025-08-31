import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignUserInDto } from './dto/auth-sign-user-in.dto';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { AuthSignUserOutDto } from './dto/auth-sign-user-out.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { GoogleFirebaseLoginInDto } from './dto/google-firebase-login-in.dto';
import { GoogleOauthLoginInDto } from './dto/google-oauth-login-in.dto';

@ApiTags('auth')
@Controller('game/auth')
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
}
