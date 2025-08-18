import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseDto<T> {
  public static fromEntity<T, V>(this: ClassConstructor<T>, entity: V): T {
    return plainToInstance(this, instanceToPlain(entity));
  }
  public static fromEntities<T, V>(
    this: ClassConstructor<T>,
    entities: V[],
  ): T[] {
    return plainToInstance(this, instanceToPlain(entities) as V[]);
  }
}
