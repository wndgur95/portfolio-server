import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataGacha } from '@libs/dao/static/data-gacha/data-gacha.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataGachaQuery } from '@libs/dao/static/data-gacha/data-gacha-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataGachaRepository extends StaticBaseRepository<DataGacha> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/Gacha.json', 'utf-8');
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
        const instance = plainToInstance(DataGacha, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(query: DataGachaQuery, func?: (data: any) => void): DataGacha[] {
    return super.query(query, func);
  }
}
