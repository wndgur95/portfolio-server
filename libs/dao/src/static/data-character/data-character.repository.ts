import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { readFileSync } from 'fs';
import { DataCharacter } from '@libs/dao/static/data-character/data-character.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataCharacterQuery } from '@libs/dao/static/data-character/data-character-query.interface';
import { deepFreeze } from '@libs/common/utils/freeze.util';
import { StaticBase } from '@libs/dao/static/static-base.entity';

@Injectable()
export class DataCharacterRepository extends StaticBaseRepository<DataCharacter> {
  constructor() {
    super();
    this.load();
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./data/Character.json', 'utf-8');
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
        const instance = plainToInstance(DataCharacter, it);
        deepFreeze(instance);
        return [it.ID, instance];
      }),
    );

    Object.freeze(this.items);
    this.invalidateCache();
  }

  query(query: DataCharacterQuery): DataCharacter[] {
    return super.query(query);
  }

  invalidateCache(): void {
    this.cache.clear();
  }
}
