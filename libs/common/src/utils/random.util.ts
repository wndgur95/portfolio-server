import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import * as crypto from 'crypto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';

export class RandomUtil {
  static getRandomIndexInRatios(ratios: number[]): number {
    if (ratios.length === 0) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID);
    }

    const randomMaxValue = ratios.reduce((acc, cur) => acc + cur);
    if (randomMaxValue === 0) {
      return 0;
    }

    if (ratios.length === 1) {
      return 0;
    }

    const randomValue = this.rand(randomMaxValue, 1);

    let ratioSum = 0;
    for (let index = 0; index < ratios.length; ++index) {
      ratioSum += ratios[index];
      if (randomValue <= ratioSum) {
        return index;
      }
    }
  }

  static getRandomValue<T>(array: T[]): T {
    const maxIndex = array.length - 1;
    if (maxIndex === -1) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DATA_INVALID,
        ['랜덤 뽑기 리스트가 비어있음'],
      );
    }

    return array[this.rand(maxIndex)]; //  randomInt(0,0) 인 경우 Error 가 발생합니다.
  }

  static rand(max: number, min = 0): number {
    return crypto.randomInt(min, max + 1);
  }

  static randByte(size: number): string {
    return crypto.randomBytes(size).toString('hex');
  }

  static randomItems<T>(array: T[], count: number): T[] {
    if (count < 0) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID);
    }

    if (count === 0) {
      return [];
    }

    for (let i = array.length - 1; i > 0; i--) {
      const j = this.rand(i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array.slice(0, count);
  }
}
