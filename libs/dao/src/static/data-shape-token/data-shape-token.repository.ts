import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataShapeToken } from '@libs/dao/static/data-shape-token/data-shape-token.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataShapeTokenQuery } from '@libs/dao/static/data-shape-token/data-shape-token-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataShapeTokenRepository extends StaticBaseRepository<DataShapeToken> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/ShapeToken.json', 'utf-8');
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
        const instance = plainToInstance(DataShapeToken, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(
    query: DataShapeTokenQuery,
    func?: (data: any) => void,
  ): DataShapeToken[] {
    return super.query(query, func);
  }
}
