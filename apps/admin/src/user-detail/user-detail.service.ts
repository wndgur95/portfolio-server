import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { UserDetailsDbRepositories } from '@libs/dao/game/user-details/repositories/user-details-db.repository';
import { UserDetailsRepository } from '@libs/dao/game/user-details/interfaces/user-details-repository.interface';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { GetUserDetailOutDto } from './dto/get-user-detail-out.dto';

@Injectable()
export class UserDetailService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,

    @Inject(UserDetailsRepository)
    private readonly userDetailsDbRepositories: UserDetailsDbRepositories,
  ) {}

  async getUserDetail(): Promise<GetUserDetailOutDto> {
    const { userId, database } = ContextProvider.getSelectedUser();

    const user = await this.usersRepository.findById(userId);
    const userDetail =
      await this.userDetailsDbRepositories[database].findByUserId(userId);

    return GetUserDetailOutDto.of({ user, userDetail });
  }
}
