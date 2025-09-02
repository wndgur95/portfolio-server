import { Module } from '@nestjs/common';
import { StaticRepository } from '@libs/dao/static/static.repository';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { DataVersionRepository } from '@libs/dao/static/data-version/data-version.repository';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';

@Module({
  providers: [
    StaticRepository,
    DataVersionRepository,
    DataCharacterRepository,
    DataBalanceRepository,
  ],
  exports: [
    StaticRepository,
    DataVersionRepository,
    DataCharacterRepository,
    DataBalanceRepository,
  ],
})
export class StaticModule {}
