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
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { Reward } from '@libs/common/interface/goods.interface';
import {
  GOODS_TYPE,
  MISSION_TYPE,
  MissionType,
} from '@libs/dao/static/common.constants';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import { DataBalance } from '@libs/dao/static/data-balance/data-balance.entity';
import { TimeUtil } from '@libs/common/utils/time.util';
import { MissionsDbRepositories } from '@libs/dao/game/missions/repositories/missions-db.repository';
import { MissionsRepository } from '@libs/dao/game/missions/interfaces/missions-repository.interface';
import { DataMissionRepository } from '@libs/dao/static/data-mission/data-mission.repository';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { InitAt } from '@libs/dao/game/user-details/type/init-at';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersDbRepository,
    @Inject(UserDetailsRepository)
    private readonly userDetailsRepositories: UserDetailsDbRepositories,
    @Inject(MissionsRepository)
    private readonly missionsRepositories: MissionsDbRepositories,

    private readonly goodsProvider: GoodsProvider,
    private readonly dataBalanceRepository: DataBalanceRepository,
    private readonly dataMissionRepository: DataMissionRepository,
    private readonly userDetailProvider: UserDetailProvider,
  ) {}

  async getUser(): Promise<GetUserOutDto> {
    const { userId, database } = ContextProvider.getSession();

    const user = await this.usersRepository.findById(userId);

    const userDetail =
      await this.userDetailsRepositories[database].findByUserId(userId);

    await this._initializeUser(userDetail);

    return GetUserOutDto.of({
      user,
      userDetail,
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return null;

    if (user.platformId == null && user.address == null) {
      await user.checkPassword(password);
    } else if (user.platformId != null || user.address != null) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.LOGIN_METHOD_NOT_VALID,
      );
    }

    return user;
  }

  /**
   * 지갑 로그인
   */
  async web3Login(address: string): Promise<User> {
    const user = await this.usersRepository.findByAddress(address);

    if (!user) return null;

    return user;
  }

  /**
   * 지갑 회원가입
   */
  async web3Signup(address: string): Promise<User> {
    const userEntity = UserEntity.create({
      address,
      nid: randomUUID(),
    });

    return await this.usersRepository.save(userEntity);
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
    const { database } = ContextProvider.getUserInfo();

    const userDetail = await this.userDetailsRepositories[database].save(
      UserDetailEntity.create({
        userId: user.id,
        initAt: InitAt.create(ContextProvider.getNow()),
      }),
    );

    await this._createInitCharacter();

    return userDetail;
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

  private async _createInitCharacter(): Promise<void> {
    const characterIds = this.dataBalanceRepository.findById(
      DataBalance.BALANCE_INIT_CHARACTER,
    ).INDEX;

    const rewards = characterIds.map((it) => {
      return {
        goodsType: GOODS_TYPE.CHARACTER,
        dataId: it,
        quantity: 1,
      } as Reward;
    });

    await this.goodsProvider.payImmediately(rewards);
  }

  private async _initializeUser(userDetail: UserDetail): Promise<UserDetail> {
    const now = ContextProvider.getNow();

    // daily
    if (TimeUtil.isChangeDay(userDetail.initAt.daily, now)) {
      userDetail.initAt.daily = now;

      await this._initializeMission(MISSION_TYPE.DAILY);
    }

    await this.userDetailProvider.updateUserDetail(userDetail);

    return userDetail;
  }

  private async _initializeMission(missionType: MissionType): Promise<void> {
    if (missionType !== MISSION_TYPE.DAILY) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.MISSION_CAN_NOT_INIT_TYPE,
      );
    }

    const { userId, database } = ContextProvider.getSession();

    const missionRepository = this.missionsRepositories[database];
    const missions = await missionRepository.findByUserId(userId);

    if (missions.isEmpty()) {
      return;
    }

    // update
    const dataMissionIds = this.dataMissionRepository
      .findByIdIn(missions.map((it) => it.dataMissionId))
      .filter((it) => it.MISSION_TYPE === missionType)
      .map((it) => it.ID);

    const missionIds = missions
      .filter((it) => dataMissionIds.includes(it.dataMissionId))
      .map((it) => it.id);

    if (missionIds.length) {
      await missionRepository.updateCountAndRewardAtByIdIn(missionIds);
    }
  }
}
