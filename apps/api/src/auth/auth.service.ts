import { Inject, Injectable } from '@nestjs/common';
import {
  JWT_OPTIONS,
  JWT_REFRESH_OPTIONS,
  JwtPayload,
} from '@libs/common/constants/jwt.constants';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { AuthSignUserOutDto } from './dto/auth-sign-user-out.dto';
import {
  getDatabaseByGameDbId,
  getGameShardDatabases,
} from '@libs/dao/config/game/game-database-config.util';
import { AuthSignUserInDto } from './dto/auth-sign-user-in.dto';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { ConfigService } from '@nestjs/config';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { SqlInjectionInDto } from './dto/sql-injection-in.dto';
import { SqlInjectionResultDto } from './dto/sql-injection-result.dto';
import { GetApiKeyOutDto } from './dto/get-api-key-out.dto';
import { EncryptUtil } from '@libs/common/utils/encrypt.util';
import {
  AUTH_TOKEN_SECRET_KEY,
  AUTH_TOKEN_TTL,
  AuthToken,
} from '@libs/common/constants/token.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GoogleOAuthProvider, FirebaseAdminProvider } from '@libs/common/http';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import { Session } from '@libs/dao/redis/session/session.entity';
import {
  ENVIRONMENT,
  NODE_ENV,
} from '@libs/common/constants/environment.constants';
import { SESSION_EXPIRED_TIME } from '@libs/common/constants/redis.constants';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { TimeUtil } from '@libs/common/utils/time.util';
import { TestTablesDbRepository } from '@libs/dao/common/test-tables/repositories/test-tables-db.repository';
import { TestTablesRepository } from '@libs/dao/common/test-tables/interfaces/test-tables-repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersDbRepository,

    @Inject(TestTablesRepository)
    private readonly testTablesRepository: TestTablesDbRepository,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly googleOAuthProvider: GoogleOAuthProvider,
    private readonly firebaseAdminProvider: FirebaseAdminProvider,
    private readonly sessionRepository: SessionRepository,
  ) {}

  private apiKeys: string[] = [process.env.AUTH_KEY];

  private readonly externalApiKeys = [
    'vNA3sRMjTwgmE72v9cGDySKGK/wOIdfQVF0HMPM3lE72Upug3VLhOkYq+89D45gQZ7oHpatzRDdxuog8iFQgHw==',
  ];

  async validateSession(userId: number, sessionId: string): Promise<boolean> {
    if (!userId || !sessionId) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.SESSION_NOT_EXIST_ACCOUNT_KEY_IN_HEADER,
      );
    }

    const session = await this.sessionRepository.getSession(userId);

    if (!session) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_NOT_FOUND, [
        `userId: ${userId} `,
      ]);
    } else if (session.id !== sessionId) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_RE_LOGIN);
    } else if (session.block) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_BLOCK);
    }

    ContextProvider.setSession(session);

    const timeOffset = session.timeOffset;

    if (!timeOffset) {
      return true;
    }

    const absOffset = Math.abs(timeOffset);
    const now = ContextProvider.getNow();
    const adjustedNow =
      timeOffset < 0
        ? TimeUtil.subSeconds(now, absOffset)
        : TimeUtil.addSeconds(now, absOffset);

    ContextProvider.setNow(adjustedNow);

    return true;
  }

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
    ContextProvider.setJwt(payload);
    if (payload.gameDbId) ContextProvider.setGameDatabase(payload.database);
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

    return await this._handleLogin(user);
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
      gameDbId: user.gameDbId || 0,
      database: user.gameDbId ? getDatabaseByGameDbId(user.gameDbId) : '',
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
      'google',
    );

    return await this._handleLogin(user);
  }

  async sqlInjection(
    sqlInjectionInDto: SqlInjectionInDto,
  ): Promise<SqlInjectionResultDto> {
    try {
      // Repository를 통한 안전한 쿼리 실행
      await this.testTablesRepository.findByContentsSafe(
        sqlInjectionInDto.contents,
      );

      return {
        inputContents: sqlInjectionInDto.contents,
        executedQuery: `SELECT \`sql_injection\`.\`id\`, \`sql_injection\`.\`contents\`, \`sql_injection\`.\`created_at\`, \`sql_injection\`.\`updated_at\`, \`sql_injection\`.\`deleted_at\` FROM \`sql_injection\` WHERE \`sql_injection\`.\`contents\` = ?`,
        parameter: sqlInjectionInDto.contents,
        defenseMessage:
          'SQL 인젝션 공격이 TypeORM에 의해 성공적으로 방어되었습니다.',
        securityEffect:
          'TypeORM Query Builder가 파라미터화된 쿼리를 사용하여 악성 SQL 코드를 단순한 문자열 데이터로 처리했습니다.',
      };
    } catch (error) {
      return {
        inputContents: sqlInjectionInDto.contents,
        executedQuery: 'Query execution failed',
        parameter: sqlInjectionInDto.contents,
        defenseMessage:
          '쿼리 실행 중 오류가 발생했지만, SQL 인젝션은 방어되었습니다.',
        securityEffect: `TypeORM이 안전하게 처리했습니다: ${error.message}`,
      };
    }
  }

  private async _exchangeCodeForUserInfo(code: string): Promise<any> {
    return await this.googleOAuthProvider.exchangeCodeForUserInfo(code);
  }

  private async _verifyFirebaseIdToken(idToken: string): Promise<any> {
    return await this.firebaseAdminProvider.verifyIdToken(idToken);
  }

  /**
   * 로그인 후 공통 처리 메서드
   */
  @TransactionalEx(DB_NAME.COMMON)
  private async _handleLogin(user: User): Promise<AuthSignUserOutDto> {
    if (!user.gameDbId) {
      const gameDbId = 100 + (user.id % getGameShardDatabases.length);

      user.gameDbId = gameDbId;

      await this.usersRepository.updateById(user.id, {
        gameDbId,
      });

      const database = getDatabaseByGameDbId(gameDbId);
      ContextProvider.setGameDatabase(database);
      ContextProvider.setUserId(user.id);

      await this.userService.createUserDetail(user);
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email ?? '',
      roles: user.roles,
      gameDbId: user.gameDbId || 0,
      database: user.gameDbId ? getDatabaseByGameDbId(user.gameDbId) : '',
    };

    const accessToken = this._getAuthToken(payload);
    const refreshToken = this._getRefreshToken(payload);

    const session = await this._createSession(user);

    await this.usersRepository.updateById(user.id, {
      refreshToken: refreshToken,
    });

    return AuthSignUserOutDto.of(user)
      .setAuthToken(accessToken)
      .setRefreshToken(refreshToken)
      .setSessionId(session.id);
  }

  @TransactionalEx(DB_NAME.COMMON)
  async updateRole(
    updateRoleUserDto: UpdateRoleUserDto,
  ): Promise<AuthSignUserOutDto> {
    const { roles } = updateRoleUserDto;

    const { id } = ContextProvider.getJwt();

    await this.usersRepository.updateById(id, {
      roles: roles,
    });

    const user = await this.usersRepository.findById(id);

    return await this._handleLogin(user);
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

  /**
   * 세션 생성
   */
  private async _createSession(user: User): Promise<Session> {
    const session = Session.create({
      userId: user.id,
      nid: user.nid,
      gameDbId: user.gameDbId,
    });

    await this.sessionRepository.setSession(
      user.id,
      session,
      ['', ENVIRONMENT.TEST].includes(NODE_ENV) ? 0 : SESSION_EXPIRED_TIME,
    );

    return session;
  }
}
