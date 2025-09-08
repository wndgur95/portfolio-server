import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataBalance } from '@libs/dao/static/data-balance/data-balance.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataBalanceQuery } from '@libs/dao/static/data-balance/data-balance-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataBalanceRepository extends StaticBaseRepository<DataBalance> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/Balance.json', 'utf-8');
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
        const instance = plainToInstance(DataBalance, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(query: DataBalanceQuery, func?: (data: any) => void): DataBalance[] {
    return super.query(query, func);
  }
}
