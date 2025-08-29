import { Module } from '@nestjs/common';
import { StaticRepository } from '@libs/dao/static/static.repository';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { DataVersionRepository } from '@libs/dao/static/data-version/data-version.repository';

@Module({
  providers: [
    StaticRepository,
    DataVersionRepository,
    DataCharacterRepository,
  ],
  exports: [
    StaticRepository,
    DataVersionRepository,
    DataCharacterRepository,
  ],
})
export class StaticModule {}
