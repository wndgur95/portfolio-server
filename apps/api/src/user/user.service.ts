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
import { randomBytes } from 'crypto';
import { UserDetail } from '@libs/dao/user/user-details/interfaces/user-detail.interface';
import { UserDetailsDbRepositories } from '@libs/dao/user/user-details/repositories/user-details-db.repository';
import { UserDetailsRepository } from '@libs/dao/user/user-details/interfaces/user-details-repository.interface';
import {
  getDatabaseByUserDbId,
  getUserShardDatabases,
} from '@libs/dao/config/user/user-database-config.util';
import { UserDetailEntity } from '@libs/dao/user/user-details/entities/user-detail.entity';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(UserDetailsRepository)
    private readonly userDetailsRepositories: UserDetailsDbRepositories,
  ) {}

  async isDuplicated(userInDto: AuthSignUserInDto): Promise<void> {
    const userCount = await this.usersRepository.countByEmail(userInDto.email);
    if (userCount) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_CONFLICT_EMAIL,
      );
    }
  }

  async isPasswordComplexity(userInDto: AuthSignUserInDto): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const joiPasswordComplexity = require('joi-password-complexity');
    const complexityOptions = {
      min: 10,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    };
    const complexityResult = joiPasswordComplexity(complexityOptions).validate(
      userInDto.password,
    );
    if (undefined !== complexityResult.error) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_NOT_SATISFY_PASSWORD_POLICY,
      );
    }
  }

  async signup(signUserInDto: AuthSignUserInDto): Promise<UserDto> {
    if (signUserInDto.name.trim() == '') {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.ADMIN_USER_EMPTY_NAME);
    }
    await this.isDuplicated(signUserInDto);
    await this.isPasswordComplexity(signUserInDto);
    const entity = AuthSignUserInDto.toEntity(signUserInDto);

    entity.recommendCode = await this._getRecommendCode();
    const createdUser = await this.usersRepository.save(entity);
    return UserDto.fromEntity(createdUser);
  }

  async changePassword(
    signUserInDto: AuthSignUserInDto,
    executor: string,
  ): Promise<void> {
    // const user = await this.usersRepository.findByEmail(
    //   signUserInDto.email,
    // );
    await this.isPasswordComplexity(signUserInDto);
    if (executor != signUserInDto.email) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_MISMATCHED_CURRENT_USER,
      );
    }

    if (signUserInDto.email != signUserInDto.email) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_MISMATCHED_EMAIL,
      );
    }

    const entity = AuthSignUserInDto.toEntity(signUserInDto);
    await entity.hashPassword();
    await this.usersRepository.update(
      { email: signUserInDto.email },
      { password: entity.password },
    );
  }

  async signIn(email: string, password: string): Promise<User> {
    const findUser = await this.findByEmail(email);
    if (!(await findUser.checkPassword(password))) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_MISMATCHED_PASSWORD,
      );
    } else if (!findUser.activatedAt) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_NOT_ACTIVATED,
      );
    }

    return findUser;
  }

  @Transactional(DB_NAME.COMMON)
  async kakaoSignIn(
    kakaoId: string,
    name: string,
    provider: string,
    profileImage?: string,
  ): Promise<User> {
    let findUser = await this.usersRepository.findOneBy({
      platformId: kakaoId,
    });

    if (!findUser) {
      findUser = await this.usersRepository.save(
        UserEntity.create({
          name,
          platformId: kakaoId,
          recommendCode: await this._getRecommendCode(),
          activatedAt: ContextProvider.getNow(),
          image: profileImage ?? null,
          provider: provider,
        }),
      );
    }

    return findUser;
  }

  @Transactional(DB_NAME.COMMON)
  async googleSignIn(
    googleId: string,
    email: string,
    name: string,
    provider: string,
    profileImage?: string,
  ): Promise<User> {
    let findUser = await this.usersRepository.findOneBy({
      platformId: googleId,
    });

    if (!findUser) {
      findUser = await this.usersRepository.save(
        UserEntity.create({
          name,
          platformId: googleId,
          email: email,
          recommendCode: await this._getRecommendCode(),
          activatedAt: ContextProvider.getNow(),
          image: profileImage ?? null,
          provider: provider,
        }),
      );
    }

    return findUser;
  }

  async activate(id: number): Promise<UserDto> {
    const updateResult = await this.usersRepository.update(
      { id: id },
      { activatedAt: new Date() },
    );

    if (!updateResult.affected) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_UPDATE_FAILED,
      );
    }

    return await this.findById(id);
  }

  async deactivate(id: number): Promise<UserDto> {
    const updateResult = await this.usersRepository.update(
      { id: id },
      { activatedAt: null },
    );

    if (!updateResult.affected) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_UPDATE_FAILED,
      );
    }

    return await this.findById(id);
  }

  async updateRole(updateRoleUserDto: UpdateRoleUserDto): Promise<UserDto> {
    const { userId, roles } = updateRoleUserDto;
    const updateResult = await this.usersRepository.update(
      { id: userId },
      { roles: roles },
    );

    if (!updateResult.affected) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_UPDATE_FAILED,
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
      throw new ServerErrorException(INTERNAL_ERROR_CODE.ADMIN_USER_NOT_FOUND);
    }

    return UserDto.fromEntity(findUser);
  }

  async findByEmail(email: string): Promise<User> {
    const findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.ADMIN_USER_NOT_FOUND);
    }

    return findUser;
  }

  async removeUser(id: number): Promise<void> {
    const findUser = await this.usersRepository.findById(id);
    if (!findUser) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.ADMIN_USER_NOT_FOUND);
    }

    await this.usersRepository.softDelete(id);
  }

  @Transactional(DB_NAME.COMMON)
  async createUserDetail(user: User): Promise<UserDetail> {
    const userDbId = 200 + (user.id % getUserShardDatabases.length);

    user.userDbId = userDbId;

    await this.usersRepository.updateById(user.id, {
      userDbId,
    });

    const database = getDatabaseByUserDbId(userDbId);

    return await this.userDetailsRepositories[database].save(
      UserDetailEntity.create({ userId: user.id }),
    );
  }

  private async _getRecommendCode(): Promise<string> {
    let isUnique = false;
    let recommendCode: string;

    while (!isUnique) {
      recommendCode = randomBytes(4)
        .toString('hex') // 16진수 변환 (0-9, a-f)
        .replace(/[g-z]/gi, '') // a-f까지만 사용
        .substring(0, 6); // 6자리만 사용

      const existingUser = await this.usersRepository.findOne({
        where: { recommendCode },
      });

      if (!existingUser) {
        isUnique = true; // 중복되지 않으면 탈출
      }
    }

    return recommendCode;
  }
}
