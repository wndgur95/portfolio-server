import { getTestModule } from '../test-module/test.module';
import { TestingModule } from '@nestjs/testing';
import { TestTransactionUtils } from '@libs/common/utils/test/test-transaction.utils';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { TestDataSourceUtils } from '@libs/common/utils/test/test-data-source.utils';
import { TestRedisDataSourceUtils } from '@libs/common/utils/test/test-redis-data-source.utils';
import { TestContextUtils } from '@libs/common/utils/test/test-context.utils';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { AuthService } from '../../src/auth/auth.service';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestUserUtils } from '../utils/test-user.utils';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';

describe('LoginService', () => {
  let module: TestingModule;

  let authService: AuthService;
  let usersRepository: UsersDbRepository;

  const userId = 1;
  const nid = 'testNid';

  beforeAll(async () => {
    module = await getTestModule;

    // service
    authService = module.get(AuthService);
    usersRepository = module.get(UsersDbRepository);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([DB_NAME.COMMON]);

    await TestUserUtils.createUser(
      UserEntity.create({
        id: userId,
        nid: nid,
        gameDbId: 100,
      }),
    );
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

  describe('login', () => {
    it('정상 로그인 - 기존 유저', async () => {
      const loginUser = await authService.register({
        email: 'test@example.com',
        password: 'Qwer1234!!',
      });

      const user = await usersRepository.findById(loginUser.id);

      expect(loginUser.id).toEqual(user.id);
    });

    it('비밀번호 형태가 아닐 때 에러', async () => {
      try {
        await authService.register({
          email: 'test@example.com',
          password: '1234',
        });
        fail('USER_MISMATCHED_PASSWORD not thrown');
      } catch (e) {
        expect(e.response).toEqual(
          INTERNAL_ERROR_CODE.USER_MISMATCHED_PASSWORD,
        );
      }
    });
  });
});
