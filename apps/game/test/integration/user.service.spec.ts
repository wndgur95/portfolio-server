import { getTestModule } from '../test-module/test.module';
import { TestingModule } from '@nestjs/testing';
import { TestTransactionUtils } from '@libs/common/utils/test/test-transaction.utils';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { TestDataSourceUtils } from '@libs/common/utils/test/test-data-source.utils';
import { TestRedisDataSourceUtils } from '@libs/common/utils/test/test-redis-data-source.utils';
import { TestContextUtils } from '@libs/common/utils/test/test-context.utils';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestUserUtils } from '../utils/test-user.utils';
import { UserService } from '../../src/user/user.service';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';

describe('UserService', () => {
  let module: TestingModule;

  let userService: UserService;
  let goodsProvider: GoodsProvider;

  const userId = 1;
  const gameDbId = 100;

  beforeAll(async () => {
    module = await getTestModule;

    // service
    userService = module.get(UserService);
    goodsProvider = module.get(GoodsProvider);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([DB_NAME.COMMON]);

    await TestUserUtils.login(userId, gameDbId);

    const { database } = ContextProvider.getSession();
    await TypeOrmHelper.Transactional([database]);
    await TestUserUtils.createUserDetail(goodsProvider);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
    TestContextUtils.releaseContexts();
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      TestRedisDataSourceUtils.clearRedisDataSource(module),
    ]);
  });

  describe('getUser', () => {
    it('유저 정보 받기', async () => {
      const getUserOutDto = await userService.getUser();

      expect(getUserOutDto.user.id).toEqual(userId);
      expect(getUserOutDto.userDetail.userId).toEqual(userId);
    });
  });
});
