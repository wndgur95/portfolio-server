import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataCost } from '@libs/dao/static/data-cost/data-cost.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataCostQuery } from '@libs/dao/static/data-cost/data-cost-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataCostRepository extends StaticBaseRepository<DataCost> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/Cost.json', 'utf-8');
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
        const instance = plainToInstance(DataCost, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(query: DataCostQuery): DataCost[] {
    return super.query(query);
  }
}
