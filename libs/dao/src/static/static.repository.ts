import { Injectable } from '@nestjs/common';
import { StaticBase } from '@libs/dao/static/static-base.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataVersionRepository } from '@libs/dao/static/data-version/data-version.repository';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';

@Injectable()
export class StaticRepository {
  items: Record<string, StaticBaseRepository<StaticBase>> = {};

  constructor(
    private readonly dataVersionRepository: DataVersionRepository,
    private readonly dataCharacterRepository: DataCharacterRepository,
  ) {
    this.items['DataCharacterRepository'] = this.dataCharacterRepository;
  }

  reload(names: string[]): void {
    for (const name of names) {
      const key = `Data${name}Repository`;
      this.items[key]?.load();
    }

    this.dataVersionRepository.load();
  }

  reloadAll(): void {
    Object.values(this.items).forEach((it) => it.load());

    this.dataVersionRepository.load();
  }
}
