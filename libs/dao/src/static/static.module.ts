import { Module } from '@nestjs/common';
import { StaticRepository } from '@libs/dao/static/static.repository';
import { DataVersionRepository } from '@libs/dao/static/data-version/data-version.repository';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { DataCostRepository } from '@libs/dao/static/data-cost/data-cost.repository';
import { DataCurrencyRepository } from '@libs/dao/static/data-currency/data-currency.repository';
import { DataGachaRepository } from '@libs/dao/static/data-gacha/data-gacha.repository';
import { DataLocalization_korRepository } from '@libs/dao/static/data-localization_kor/data-localization_kor.repository';
import { DataMissionRepository } from '@libs/dao/static/data-mission/data-mission.repository';
import { DataRewardRepository } from '@libs/dao/static/data-reward/data-reward.repository';

@Module({
  providers: [
    StaticRepository,
    DataVersionRepository,
    DataBalanceRepository,
    DataCharacterRepository,
    DataCostRepository,
    DataCurrencyRepository,
    DataGachaRepository,
    DataLocalization_korRepository,
    DataMissionRepository,
    DataRewardRepository,
  ],
  exports: [
    StaticRepository,
    DataVersionRepository,
    DataBalanceRepository,
    DataCharacterRepository,
    DataCostRepository,
    DataCurrencyRepository,
    DataGachaRepository,
    DataLocalization_korRepository,
    DataMissionRepository,
    DataRewardRepository,
  ],
})
export class StaticModule {}
