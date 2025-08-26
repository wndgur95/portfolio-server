import { Inject, Injectable } from '@nestjs/common';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { PageMetaDto } from '@libs/common/pagination/dto/page-meta.dto';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { AuthSignUserInDto } from '../auth/dto/auth-sign-user-in.dto';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { UserDetail } from '@libs/dao/user/user-details/interfaces/user-detail.interface';
import { UserDetailsDbRepositories } from '@libs/dao/user/user-details/repositories/user-details-db.repository';
import { UserDetailsRepository } from '@libs/dao/user/user-details/interfaces/user-details-repository.interface';
import { UserDetailEntity } from '@libs/dao/user/user-details/entities/user-detail.entity';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { PASSWORD_POLICY } from '@libs/common/constants/jwt.constants';
import joiPasswordComplexity from 'joi-password-complexity';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(UserDetailsRepository)
    private readonly userDetailsRepositories: UserDetailsDbRepositories,
  ) {}
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

    const userEntity = AuthSignUserInDto.toEntity({ email, password });

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

  async changePassword(
    signUserInDto: AuthSignUserInDto,
    executor: string,
  ): Promise<void> {
    // const user = await this.usersRepository.findByEmail(
    //   signUserInDto.email,
    // );
    this._isPasswordComplexity(signUserInDto.password);
    if (executor != signUserInDto.email) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.USER_MISMATCHED_CURRENT_USER,
      );
    }

    if (signUserInDto.email != signUserInDto.email) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.USER_MISMATCHED_EMAIL,
      );
    }

    const entity = AuthSignUserInDto.toEntity(signUserInDto);
    await entity.hashPassword();
    await this.usersRepository.update(
      { email: signUserInDto.email },
      { password: entity.password },
    );
  }

  @Transactional(DB_NAME.COMMON)
  async googleSignIn(
    googleId: string,
    email: string,
    name: string,
    provider: string,
  ): Promise<User> {
    let user = await this.usersRepository.findOneBy({
      platformId: googleId,
    });

    if (!user) {
      user = await this.usersRepository.save(
        UserEntity.create({
          platformId: googleId,
          email: email,
          provider: provider,
        }),
      );
    }

    return user;
  }

  async updateRole(updateRoleUserDto: UpdateRoleUserDto): Promise<UserDto> {
    const { userId, roles } = updateRoleUserDto;
    const updateResult = await this.usersRepository.update(
      { id: userId },
      { roles: roles },
    );

    if (!updateResult.affected) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.USER_UPDATE_FAILED,
      );
    }

    return await this.findById(userId);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<[UserDto[], PageMetaDto]> {
    const { order, page, take } = pageOptionsDto;
    const skip = (page - 1) * take;
    const [users, itemCount] = await this.usersRepository.findAllAndCount(
      take,
      skip,
      order,
    );
    const usersDto = users.map((it) => UserDto.fromEntity(it));
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return [usersDto, pageMetaDto];
  }

  async findById(id: number): Promise<UserDto> {
    const findUser = await this.usersRepository.findById(id);
    if (!findUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    return UserDto.fromEntity(findUser);
  }

  async findByEmail(email: string): Promise<User> {
    const findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    return findUser;
  }

  async removeUser(id: number): Promise<void> {
    const findUser = await this.usersRepository.findById(id);
    if (!findUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_FOUND);
    }

    await this.usersRepository.softDelete(id);
  }

  @Transactional(DB_NAME.COMMON)
  async createUserDetail(user: User): Promise<UserDetail> {
    const database = ContextProvider.getUserDatabase();

    return await this.userDetailsRepositories[database].save(
      UserDetailEntity.create({ userId: user.id }),
    );
  }

  private async _isDuplicated(email: string): Promise<void> {
    const isExistEmail = await this.usersRepository.existByEmail(email);

    if (isExistEmail) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.USER_CONFLICT_EMAIL,
      );
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
