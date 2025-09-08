import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataLocalization_kor } from '@libs/dao/static/data-localization_kor/data-localization_kor.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataLocalization_korQuery } from '@libs/dao/static/data-localization_kor/data-localization_kor-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataLocalization_korRepository extends StaticBaseRepository<DataLocalization_kor> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/Localization_kor.json', 'utf-8');
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
        const instance = plainToInstance(DataLocalization_kor, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(
    query: DataLocalization_korQuery,
    func?: (data: any) => void,
  ): DataLocalization_kor[] {
    return super.query(query, func);
  }
}
