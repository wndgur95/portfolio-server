import { BaseMongoLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-mongo-log.collection';

export class LoginCollection extends BaseMongoLogCollection {
  constructor(partial?: Partial<LoginCollection>) {
    super(partial);
    Object.assign(this, partial);
  }
}
