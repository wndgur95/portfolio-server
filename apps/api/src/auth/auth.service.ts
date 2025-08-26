import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  JWT_OPTIONS,
  JWT_REFRESH_OPTIONS,
  JwtPayload,
} from '@libs/common/constants/jwt.constants';
import { UserService } from '../user/user.service';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import { JwtService } from '@nestjs/jwt';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { AuthSignUserOutDto } from './dto/auth-sign-user-out.dto';
import {
  getDatabaseByUserDbId,
  getUserShardDatabases,
} from '@libs/dao/config/user/user-database-config.util';
import { AuthSignUserInDto } from './dto/auth-sign-user-in.dto';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { ConfigService } from '@nestjs/config';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { GetApiKeyOutDto } from './dto/get-api-key-out.dto';
import { EncryptUtil } from '@libs/common/utils/encrypt.util';
import {
  AUTH_TOKEN_SECRET_KEY,
  AUTH_TOKEN_TTL,
  AuthToken,
} from '@libs/common/constants/token.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private apiKeys: string[] = [process.env.AUTH_KEY];

  private readonly externalApiKeys = [
    'vNA3sRMjTwgmE72v9cGDySKGK/wOIdfQVF0HMPM3lE72Upug3VLhOkYq+89D45gQZ7oHpatzRDdxuog8iFQgHw==',
  ];

  // api-key
  validateApiKey(apiKey: string): boolean {
    const isAuthKey = this.apiKeys.some((key) => key === apiKey);

    if (!isAuthKey) {
      const { ttl } = EncryptUtil.decode(
        apiKey,
        AUTH_TOKEN_SECRET_KEY,
      ) satisfies AuthToken;

      if (ttl < new Date().getTime()) {
        throw new ServerErrorException(INTERNAL_ERROR_CODE.API_KEY_NOT_VALID);
      }
    }

    return true;
  }

  // external-api-key
  validateExternalApiKey(apiKey: string): string {
    return this.externalApiKeys.find((key) => key === apiKey);
  }

  validateUser(payload: JwtPayload): boolean {
    // ContextProvider.setJwt(payload);
    // if (payload.userDbId) ContextProvider.setUserDatabase(payload.database);
    return !!payload;
  }

  /**
   * 회원 가입 및 로그인
   */
  @TransactionalEx(DB_NAME.COMMON)
  async register(
    authSignUserInDto: AuthSignUserInDto,
  ): Promise<AuthSignUserOutDto> {
    const { email, password } = authSignUserInDto;

    let user = await this.userService.login(email, password);

    if (!user) {
      user = await this.userService.signup(email, password);
    }

    return this._handleLogin(user);
  }

  /**
   * Refresh Token으로 Access Token 갱신
   */
  async refreshToken(user: User): Promise<AuthSignUserOutDto> {
    // 새로운 토큰 생성
    const newPayload: JwtPayload = {
      id: user.id,
      email: user.email ?? '',
      roles: user.roles,
      userDbId: user.userDbId || 0,
      database: user.userDbId ? getDatabaseByUserDbId(user.userDbId) : '',
    };

    const newAccessToken = this._getAuthToken(newPayload);
    const newRefreshToken = this._getRefreshToken(newPayload);

    // 새로운 Refresh Token을 DB에 저장 (토큰 재사용 방지)
    await this.usersRepository.update(user.id, {
      refreshToken: newRefreshToken,
    });

    return AuthSignUserOutDto.of(user)
      .setAuthToken(newAccessToken)
      .setRefreshToken(newRefreshToken);
  }

  getApiKey(): GetApiKeyOutDto {
    const apiKey = EncryptUtil.encode(
      {
        ttl: new Date().getTime() + AUTH_TOKEN_TTL,
      },
      AUTH_TOKEN_SECRET_KEY,
    );

    return GetApiKeyOutDto.of({ apiKey });
  }

  async googleLoginWithCode(code: string): Promise<AuthSignUserOutDto> {
    // Google OAuth 2.0 authorization code를 사용하여 사용자 정보 가져오기
    const userInfo = await this._exchangeCodeForUserInfo(code);

    const user = await this.userService.googleSignIn(
      userInfo.id,
      userInfo.email,
      userInfo.name,
      'google',
    );

    return await this._handleLogin(user);
  }

  async googleLoginWithIdToken(idToken: string): Promise<AuthSignUserOutDto> {
    // Firebase ID Token을 사용하여 사용자 정보 가져오기
    const userInfo = await this._verifyFirebaseIdToken(idToken);

    const user = await this.userService.googleSignIn(
      userInfo.sub,
      userInfo.email,
      userInfo.name,
      'google',
    );

    return await this._handleLogin(user);
  }

  private async _exchangeCodeForUserInfo(code: string): Promise<any> {
    const accessToken = await this._exchangeCodeForAccessToken(code);
    return await this._getGoogleUserInfo(accessToken);
  }

  private async _exchangeCodeForAccessToken(code: string): Promise<string> {
    const requestBody = new URLSearchParams({
      client_id: this.config.get('GOOGLE_WEB_CLIENT_ID'),
      client_secret: this.config.get('GOOGLE_CLIENT_SECRET'),
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.config.get('GOOGLE_REDIRECT_URI'),
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: requestBody,
    });

    if (!response.ok) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_ACTIVATED);
    }

    const { access_token } = await response.json();
    return access_token;
  }

  private async _getGoogleUserInfo(accessToken: string): Promise<any> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_ACTIVATED);
    }

    return await response.json();
  }

  private async _verifyFirebaseIdToken(idToken: string): Promise<any> {
    try {
      this._initializeFirebaseAdmin();
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      return {
        sub: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        picture: decodedToken.picture,
      };
    } catch (error) {
      console.error('Firebase ID Token verification error:', error);
      throw new UnauthorizedException('Firebase ID Token verification failed');
    }
  }

  private _initializeFirebaseAdmin(): void {
    if (!admin.apps.length) {
      const serviceAccount = {
        projectId: this.config.get('FIREBASE_PROJECT_ID'),
        privateKeyId: this.config.get('FIREBASE_PRIVATE_KEY_ID'),
        privateKey: this.config.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        clientEmail: this.config.get('FIREBASE_CLIENT_EMAIL'),
        clientId: this.config.get('FIREBASE_CLIENT_ID'),
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: this.config.get('FIREBASE_PROJECT_ID'),
      });
    }
  }

  /**
   * 로그인 후 공통 처리 메서드
   */
  private async _handleLogin(user: User): Promise<AuthSignUserOutDto> {
    if (!user.userDbId) {
      const userDbId = 200 + (user.id % getUserShardDatabases.length);

      user.userDbId = userDbId;

      await this.usersRepository.updateById(user.id, {
        userDbId,
      });

      const database = getDatabaseByUserDbId(userDbId);
      ContextProvider.setUserDatabase(database);

      await this.userService.createUserDetail(user);
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email ?? '',
      roles: user.roles,
      userDbId: user.userDbId || 0,
      database: user.userDbId ? getDatabaseByUserDbId(user.userDbId) : '',
    };

    const accessToken = this._getAuthToken(payload);
    const refreshToken = this._getRefreshToken(payload);

    await this.usersRepository.updateById(user.id, {
      refreshToken: refreshToken,
    });

    return AuthSignUserOutDto.of(user)
      .setAuthToken(accessToken)
      .setRefreshToken(refreshToken);
  }

  private _getAuthToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: JWT_OPTIONS.expiresIn,
    });
  }

  private _getRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: JWT_REFRESH_OPTIONS.expiresIn,
    });
  }
}
