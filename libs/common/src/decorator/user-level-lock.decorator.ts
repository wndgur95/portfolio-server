import { ContextProvider } from '@libs/common/provider/context.provider';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import { EnvProvider } from '@libs/common/provider/env.provider';

export function UserLevelLock(): MethodDecorator {
  return (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originMethod = descriptor.value;

    const overrideMethod = async function (
      ...originMethodArgs: unknown[]
    ): Promise<unknown> {
      const { id } = ContextProvider.getJwt();

      const database = ContextProvider.getGameDatabase();

      const queryRunners = TypeOrmHelper.getQueryRunners();

      const queryRunner =
        queryRunners?.[database] ??
        (await TypeOrmHelper.createQueryRunner(database));

      TypeOrmHelper.addQueryRunner(database, queryRunner);

      const USER_LEVEL_LOCK_TIME =
        Number(process.env.USER_LEVEL_LOCK_TIME) || 10;

      if (ContextProvider.isUserLevelLockActive()) {
        // 이미 걸려있음
        return await originMethod.apply(this, originMethodArgs);
      }

      const lockName = EnvProvider.isProd() ? `${id}` : `${NODE_ENV}_${id}`;

      // lock
      const [result] = await queryRunner.query(
        `SELECT GET_LOCK('${lockName}', ${USER_LEVEL_LOCK_TIME});`,
      );

      // check result
      if (Number(Object.values(result)[0]) !== 1) {
        throw new ServerErrorException(
          INTERNAL_ERROR_CODE.DB_USER_LEVEL_LOCK_NOT_RELEASE,
        );
      }

      ContextProvider.setIsUserLevelLockActive(true);
      TypeOrmHelper.addQueryRunner(database, queryRunner);

      return await originMethod.apply(this, originMethodArgs);
    };

    // 함수 자체의 property name 을 유지해야 한다.
    Object.defineProperty(overrideMethod, 'name', {
      value: propertyKey,
    });

    // 메타데이터 유지를 위해
    Object.setPrototypeOf(overrideMethod, originMethod);

    descriptor.value = overrideMethod;

    return descriptor;
  };
}
