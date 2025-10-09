import { Inject, Injectable } from '@nestjs/common';
import {
  JWT_OPTIONS,
  JWT_REFRESH_OPTIONS,
  JwtPayload,
} from '@libs/common/constants/jwt.constants';
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
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GoogleOAuthProvider, FirebaseAdminProvider } from '@libs/common/http';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import { Session } from '@libs/dao/redis/session/session.entity';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { TimeUtil } from '@libs/common/utils/time.util';
import { UserService } from '../user/user.service';
import { MongoLogProvider } from '@libs/common/provider/mongo-log/mongo-log.provider';
import { LoginCollection } from '@libs/dao/mongo/mongo-log/collection/auth/login.collection';
import { MONGO_LOG_COLLECTION } from '@libs/common/constants/mongo-log.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersDbRepository,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly googleOAuthProvider: GoogleOAuthProvider,
    private readonly firebaseAdminProvider: FirebaseAdminProvider,
    private readonly sessionRepository: SessionRepository,
  ) {}

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
    const payload: JwtPayload = {
      userId: user.id,
      nid: user.nid,
      email: user.email ?? '',
      roles: user.roles,
      gameDbId: user.gameDbId || 0,
      database: user.gameDbId ? getDatabaseByGameDbId(user.gameDbId) : null,
      address: user.address,
    };

    if (!user.gameDbId) {
      const gameDbId = 100 + (user.id % getGameShardDatabases.length);

      user.gameDbId = gameDbId;
      payload.gameDbId = gameDbId;

      await this.usersRepository.updateById(user.id, {
        gameDbId,
      });

      ContextProvider.setUserInfo(payload);
      payload.database = ContextProvider.getUserInfo().database;

      await this.userService.createUserDetail(user);
    }

    const accessToken = this._getAuthToken(payload);
    const refreshToken = this._getRefreshToken(payload);

    const session = await this._createSession(user);

    await this.usersRepository.updateById(user.id, {
      refreshToken: refreshToken,
    });

    MongoLogProvider.setMongoLog(
      MONGO_LOG_COLLECTION.LOGIN,
      new LoginCollection({ reason: 'login' }),
    );

    return AuthSignUserOutDto.of(user)
      .setAuthToken(accessToken)
      .setRefreshToken(refreshToken)
      .setSessionId(session.id);
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

    await this.sessionRepository.setSession(user.id, session);

    return session;
  }
}
