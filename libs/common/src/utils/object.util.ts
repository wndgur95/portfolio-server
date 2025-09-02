import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

export class ObjectUtil {
  static removeEmptyProperties<T>(obj: T): Partial<T> {
    const result = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (value === null || value === undefined) {
        continue;
      }

      if (Array.isArray(value) && value.isEmpty()) {
        continue;
      }

      result[key] = value;
    }

    return result;
  }

  static getKey<T>(obj: T, value: number | string): string | undefined {
    return Object.keys(obj).find((key) => obj[key as keyof T] === value);
  }

  static isEmpty<T>(obj: T | null | undefined): boolean {
    if (!this.isPlainObject(obj)) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_NOT_OBJECT);
    }

    return Object.keys(obj).isEmpty();
  }

  static isNotEmpty<T>(obj: T | null | undefined): boolean {
    if (!this.isPlainObject(obj)) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_NOT_OBJECT);
    }

    return Object.keys(obj).isNotEmpty();
  }

  static isPlainObject(obj: any): boolean {
    return !!obj && typeof obj === 'object';
  }
}
