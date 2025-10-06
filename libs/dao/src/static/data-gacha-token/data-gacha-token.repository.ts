import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataGachaToken } from '@libs/dao/static/data-gacha-token/data-gacha-token.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataGachaTokenQuery } from '@libs/dao/static/data-gacha-token/data-gacha-token-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataGachaTokenRepository extends StaticBaseRepository<DataGachaToken> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/GachaToken.json', 'utf-8');
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
        const instance = plainToInstance(DataGachaToken, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(
    query: DataGachaTokenQuery,
    func?: (data: any) => void,
  ): DataGachaToken[] {
    return super.query(query, func);
  }
}
