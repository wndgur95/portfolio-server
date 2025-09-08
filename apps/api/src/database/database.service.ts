import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { UserDetailsDbRepositories } from '@libs/dao/game/user-details/repositories/user-details-db.repository';
import { UserDetailsRepository } from '@libs/dao/game/user-details/interfaces/user-details-repository.interface';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import { TransactionInDto } from './dto/transaction-in.dto';
import { ContextProvider } from '@libs/common/provider/context.provider';
import {
  Transactional,
  TransactionalEx,
} from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { RowLevelLockInDto } from './dto/row-level-lock-in.dto';
import { TestTablesDbRepository } from '@libs/dao/common/test-tables/repositories/test-tables-db.repository';
import { TestTablesRepository } from '@libs/dao/common/test-tables/interfaces/test-tables-repository.interface';
import { TestTableEntity } from '@libs/dao/common/test-tables/entities/test-table.entity';
import { TestTable } from '@libs/dao/common/test-tables/interfaces/test-table.interface';
import { JwtService } from '@nestjs/jwt';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { Reward } from '@libs/common/interface/goods.interface';
import { GOODS_TYPE } from '@libs/dao/static/common.constants';
import { DataCurrency } from '@libs/dao/static/data-currency/data-currency.entity';
import { GoodsOutDto } from '@libs/common/dto/goods-out.dto';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersDbRepository,
    @Inject(UserDetailsRepository)
    private readonly userDetailsRepositories: UserDetailsDbRepositories,
    private readonly sessionRepository: SessionRepository,

    @Inject(TestTablesRepository)
    private readonly testTablesRepository: TestTablesDbRepository,
    private readonly goodsProvider: GoodsProvider,
  ) {}

  @Transactional(DB_NAME.COMMON)
  async testTransaction(transactionInDto: TransactionInDto): Promise<void> {
    const { role, gold, errorPoint } = transactionInDto;
    const session = ContextProvider.getSession();
    const { database, userId } = session;

    await this.usersRepository.updateById(userId, { roles: role });

    if (errorPoint == 1) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DB_TRANSACTION_TEST_ERROR,
        [errorPoint],
      );
    }

    await this.goodsProvider.payImmediately([
      {
        goodsType: GOODS_TYPE.CURRENCY,
        dataId: DataCurrency.CURRENCY_GOLD,
        quantity: gold,
      } as Reward
    ]);

    // await this.userDetailsRepositories[database].updateGold(userId, gold);

    if (errorPoint == 2) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DB_TRANSACTION_TEST_ERROR,
        [errorPoint],
      );
    }

    session.sequence += 1;
    await this.sessionRepository.setSession(userId, session);

    if (errorPoint == 3) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DB_TRANSACTION_TEST_ERROR,
        [errorPoint],
      );
    }
  }

  @Transactional()
  async testUserLevelLock(addGold: number): Promise<GoodsOutDto> {
    return await this.goodsProvider.payImmediately([
      {
        goodsType: GOODS_TYPE.CURRENCY,
        dataId: DataCurrency.CURRENCY_GOLD,
        quantity: addGold,
      } as Reward
    ]);
  }

  @TransactionalEx(DB_NAME.COMMON)
  async testRowLevelLock(
    rowLevelLockInDto: RowLevelLockInDto,
  ): Promise<TestTable> {
    const { id, addCount } = rowLevelLockInDto;
    const testTable =
      (await this.testTablesRepository.findByIdRowLevelLock(id)) ??
      TestTableEntity.create({ id, count: 0 });
    testTable.count += addCount;

    return await this.testTablesRepository.save(testTable);
  }

  @TransactionalEx(DB_NAME.COMMON)
  async testRowLevelUnlock(
    rowLevelLockInDto: RowLevelLockInDto,
  ): Promise<TestTable> {
    const { id, addCount } = rowLevelLockInDto;
    const testTable =
      (await this.testTablesRepository.findById(id)) ??
      TestTableEntity.create({ id, count: 0 });

    testTable.count += addCount;

    return await this.testTablesRepository.save(testTable);
  }
}
