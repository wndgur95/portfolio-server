import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { UserDetailsDbRepositories } from '@libs/dao/game/user-details/repositories/user-details-db.repository';
import { UserDetailsRepository } from '@libs/dao/game/user-details/interfaces/user-details-repository.interface';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import { TransactionInDto } from './dto/transaction-in.dto';
import { GetUserOutDto } from '../user/dto/get-user-out.dto';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersDbRepository,
    @Inject(UserDetailsRepository)
    private readonly userDetailsRepositories: UserDetailsDbRepositories,
  ) {}

  @Transactional(DB_NAME.COMMON)
  async testTransaction(transactionInDto: TransactionInDto): Promise<void> {
    const { role, gold, errorPoint } = transactionInDto;
    const { id, database } = ContextProvider.getJwt();

    await this.usersRepository.updateById(id, { roles: role });

    if (errorPoint == 1) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DB_TRANSACTION_TEST_ERROR,
        [errorPoint],
      );
    }

    await this.userDetailsRepositories[database].updateGold(id, gold);

    if (errorPoint == 2) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DB_TRANSACTION_TEST_ERROR,
        [errorPoint],
      );
    }
  }
}
