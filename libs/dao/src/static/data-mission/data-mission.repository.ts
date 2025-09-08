import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataMission } from '@libs/dao/static/data-mission/data-mission.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataMissionQuery } from '@libs/dao/static/data-mission/data-mission-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataMissionRepository extends StaticBaseRepository<DataMission> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/Mission.json', 'utf-8');
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
        const instance = plainToInstance(DataMission, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
  }

  query(query: DataMissionQuery, func?: (data: any) => void): DataMission[] {
    return super.query(query, func);
  }
}
