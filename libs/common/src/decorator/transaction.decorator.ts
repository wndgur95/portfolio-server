import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { DB_NAME, DbName } from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';

/**
 * 게임 데이터 베이스 포함
 * With Shard Database
 */
export function Transactional(...databaseNames: DbName[]): MethodDecorator {
  return (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originMethod = descriptor.value;

    const overrideMethod = async function (
      ...originMethodArgs: any[]
    ): Promise<unknown> {
      const databases = [
        ...new Set([
          ContextProvider.getUserInfo().database,
        ]),
      ].filter(Boolean);

      const validateDatabase = databaseNames.filter((name) =>
        Object.values(DB_NAME)
          .filter((name) => !!name)
          .includes(name),
      );

      await TypeOrmHelper.Transactional([...validateDatabase, ...databases]);

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

/**
 * 게임 데이터 베이스 비 포함
 * Without Shard Database
 */
export function TransactionalEx(...databaseNames: DbName[]): MethodDecorator {
  return (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originMethod = descriptor.value;

    const overrideMethod = async function (
      ...originMethodArgs: any[]
    ): Promise<unknown> {
      const validateDatabase = databaseNames.filter((name) =>
        Object.values(DB_NAME)
          .filter((name) => !!name)
          .includes(name),
      );

      await TypeOrmHelper.Transactional(validateDatabase);

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
