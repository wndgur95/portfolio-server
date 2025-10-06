import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataNumberToken } from '@libs/dao/static/data-number-token/data-number-token.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataNumberTokenQuery } from '@libs/dao/static/data-number-token/data-number-token-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataNumberTokenRepository extends StaticBaseRepository<DataNumberToken> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/NumberToken.json', 'utf-8');
    } catch (e) {
      Logger.error(e.message);
    }
  }

  load(): void {
    const json = this._getJsonData();
    if (!json) return;

    const data = JSON.parse(json);

    this.items = Object.fromEntries(
      data.map((it: StaticBase) => {
        const instance = plainToInstance(DataNumberToken, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(
    query: DataNumberTokenQuery,
    func?: (data: any) => void,
  ): DataNumberToken[] {
    return super.query(query, func);
  }
}
