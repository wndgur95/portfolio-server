import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { UserDetailsDbRepositories } from '@libs/dao/game/user-details/repositories/user-details-db.repository';
import { UserDetailsRepository } from '@libs/dao/game/user-details/interfaces/user-details-repository.interface';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { PASSWORD_POLICY } from '@libs/common/constants/jwt.constants';
import joiPasswordComplexity from 'joi-password-complexity';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import { GetUserOutDto } from './dto/get-user-out.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersDbRepository,
    @Inject(UserDetailsRepository)
    private readonly userDetailsRepositories: UserDetailsDbRepositories,
  ) {}
  async getUser(): Promise<GetUserOutDto> {
    const session = ContextProvider.getSession();

    const { userId, database } = session;

    const user = await this.usersRepository.findById(userId);
    const userDetail =
      await this.userDetailsRepositories[database].findByUserId(userId);

    return GetUserOutDto.of({
      user,
      userDetail,
      session,
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return null;

    if (!(await user.checkPassword(password))) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.USER_MISMATCHED_PASSWORD,
      );
    }

    return user;
  }

  /**
   * 회원가입
   */
  async signup(email: string, password: string): Promise<User> {
    await this._isDuplicated(email);
    this._isPasswordComplexity(password);

    const userEntity = UserEntity.create({
      email,
      password,
      nid: randomUUID(),
    });

    return await this.usersRepository.save(userEntity);
  }

  async getUserIfRefreshTokenMatches(
    id: number,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    return refreshToken === user.refreshToken ? user : null;
  }

  @Transactional(DB_NAME.COMMON)
  async googleSignIn(
    googleId: string,
    email: string,
    provider: string,
  ): Promise<User> {
    let user = await this.usersRepository.findOneBy({
      platformId: googleId,
    });

    if (!user) {
      user = await this.usersRepository.save(
        UserEntity.create({
          nid: randomUUID(),
          platformId: googleId,
          email: email,
          provider: provider,
        }),
      );
    }

    return user;
  }

  async findById(id: number): Promise<UserDto> {
    const findUser = await this.usersRepository.findById(id);
    if (!findUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    return UserDto.fromEntity(findUser);
  }

  @Transactional(DB_NAME.COMMON)
  async createUserDetail(user: User): Promise<UserDetail> {
    const database = ContextProvider.getGameDatabase();

    return await this.userDetailsRepositories[database].save(
      UserDetailEntity.create({ userId: user.id }),
    );
  }

  private async _isDuplicated(email: string): Promise<void> {
    const isExistEmail = await this.usersRepository.existByEmail(email);

    if (isExistEmail) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_CONFLICT_EMAIL);
    }
  }

  private _isPasswordComplexity(password: string): void {
    const complexityOptions = {
      min: PASSWORD_POLICY.MIN_LENGTH,
      max: PASSWORD_POLICY.MAX_LENGTH,
      lowerCase: PASSWORD_POLICY.LOWER_CASE,
      upperCase: PASSWORD_POLICY.UPPER_CASE,
      numeric: PASSWORD_POLICY.NUMERIC,
      symbol: PASSWORD_POLICY.SYMBOL,
      requirementCount: PASSWORD_POLICY.REQUIREMENT_COUNT,
    };

    const complexityResult =
      joiPasswordComplexity(complexityOptions).validate(password);

    if (undefined !== complexityResult.error) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.USER_NOT_SATISFY_PASSWORD_POLICY,
      );
    }
  }
}
