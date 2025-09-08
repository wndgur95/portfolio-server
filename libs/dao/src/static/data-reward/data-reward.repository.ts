import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataReward } from '@libs/dao/static/data-reward/data-reward.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataRewardQuery } from '@libs/dao/static/data-reward/data-reward-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataRewardRepository extends StaticBaseRepository<DataReward> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/Reward.json', 'utf-8');
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
        const instance = plainToInstance(DataReward, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(query: DataRewardQuery, func?: (data: any) => void): DataReward[] {
    return super.query(query, func);
  }
}
