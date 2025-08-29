import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';

interface DataVersion {
  version: number;
  dataFileVersion: DataFileVersion[];
}

interface DataFileVersion {
  fileName: string;
  version: number;
}

@Injectable()
export class DataVersionRepository {
  private _dataVersion: DataVersion;

  constructor() {
    this.load();
  }

  load(): void {
    const json = this._getJsonData();
    if (!json) return;

    this._dataVersion = JSON.parse(json);
  }

  get dataVersion(): DataVersion {
    return this._dataVersion;
  }

  private _getJsonData(): string {
    try {
      return readFileSync('./version/DataVersion.json', 'utf-8');
    } catch (e) {
      Logger.error(e.message);
    }
  }
}
