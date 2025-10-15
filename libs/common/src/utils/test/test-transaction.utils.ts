import { ContextProvider } from '@libs/common/provider/context.provider';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';

export class TestTransactionUtils {
  static async executeWithTransaction<T>(
    supplier: () => Promise<T>,
    databaseNames?: string[],
  ): Promise<T> {
    try {
      const userInfo = ContextProvider.getUserInfo();

      const databases = userInfo
        ? [userInfo.database, ...(databaseNames || [])]
        : databaseNames;

      await TypeOrmHelper.Transactional(databases);

      return await supplier();
    } finally {
      await TestTransactionUtils.rollback();
    }
  }

  static async rollback(): Promise<void> {
    await TypeOrmHelper.rollbackTransactions();
    await TypeOrmHelper.releases();

    TypeOrmHelper.releaseQueryRunner();
  }
}
