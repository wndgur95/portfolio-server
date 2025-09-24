import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { UpdateResult } from 'typeorm';
import { UserDetailsDbRepositories } from '@libs/dao/game/user-details/repositories/user-details-db.repository';
import { UserDetailsRepository } from '@libs/dao/game/user-details/interfaces/user-details-repository.interface';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';

@Injectable()
export class UserDetailProvider {
  constructor(
    @Inject(UserDetailsRepository)
    private readonly userDetailsRepositories: UserDetailsDbRepositories,
  ) {}

  /**
   * 유저 디테일 조회
   */
  async getUserDetail(): Promise<UserDetail> {
    const { userId, database } = ContextProvider.getUserInfo();

    const userDetail =
      await this.userDetailsRepositories[database].findByUserId(userId);

    if (!userDetail) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_DETAIL_NOT_FOUND);
    }

    return userDetail;
  }

  /**
   * 유저 디테일 업데이트
   */
  async createUserDetail(
    userId: number,
    database: string,
  ): Promise<UserDetail> {
    const userDetail = UserDetailEntity.create({
      userId: userId,
    });

    await this.userDetailsRepositories[database].insert(userDetail);

    return userDetail;
  }

  /**
   * 유저 디테일 업데이트
   */
  async updateUserDetail(userDetail: UserDetail): Promise<UpdateResult> {
    const { database } = ContextProvider.getUserInfo();

    return await this.userDetailsRepositories[database].updateById(
      userDetail.id,
      userDetail,
    );
  }
}
