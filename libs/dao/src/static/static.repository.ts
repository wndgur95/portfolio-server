import { Injectable } from '@nestjs/common';
import { StaticBase } from '@libs/dao/static/static-base.entity';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';
import { DataVersionRepository } from '@libs/dao/static/data-version/data-version.repository';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { DataCostRepository } from '@libs/dao/static/data-cost/data-cost.repository';
import { DataCurrencyRepository } from '@libs/dao/static/data-currency/data-currency.repository';
import { DataGachaRepository } from '@libs/dao/static/data-gacha/data-gacha.repository';
import { DataLocalization_korRepository } from '@libs/dao/static/data-localization_kor/data-localization_kor.repository';
import { DataMissionRepository } from '@libs/dao/static/data-mission/data-mission.repository';
import { DataRewardRepository } from '@libs/dao/static/data-reward/data-reward.repository';

@Injectable()
export class StaticRepository {
  items: Record<string, StaticBaseRepository<StaticBase>> = {};

  constructor(
    private readonly dataVersionRepository: DataVersionRepository,
    private readonly dataBalanceRepository: DataBalanceRepository,
    private readonly dataCharacterRepository: DataCharacterRepository,
    private readonly dataCostRepository: DataCostRepository,
    private readonly dataCurrencyRepository: DataCurrencyRepository,
    private readonly dataGachaRepository: DataGachaRepository,
    private readonly dataLocalization_korRepository: DataLocalization_korRepository,
    private readonly dataMissionRepository: DataMissionRepository,
    private readonly dataRewardRepository: DataRewardRepository,
  ) {
    this.items['DataBalanceRepository'] = this.dataBalanceRepository;
    this.items['DataCharacterRepository'] = this.dataCharacterRepository;
    this.items['DataCostRepository'] = this.dataCostRepository;
    this.items['DataCurrencyRepository'] = this.dataCurrencyRepository;
    this.items['DataGachaRepository'] = this.dataGachaRepository;
    this.items['DataLocalization_korRepository'] =
      this.dataLocalization_korRepository;
    this.items['DataMissionRepository'] = this.dataMissionRepository;
    this.items['DataRewardRepository'] = this.dataRewardRepository;
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
