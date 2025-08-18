import { Module } from '@nestjs/common';
import { IdeasRedisRepository } from '@libs/dao/redis/ideas/ideas-redis.repository';
import { IdeasModule } from '@libs/dao/common/ideas/ideas.module';
import { DeveloperNotesRedisRepository } from '@libs/dao/redis/developer-notes/developer-notes-redis.repository';
import { DeveloperNotesModule } from '@libs/dao/common/developer-notes/developer-notes.module';
import { IdeaDoItsModule } from '@libs/dao/user/idea-do-its/idea-do-its.module';
import { KnowHowsModule } from '@libs/dao/common/know-hows/know-hows.module';
import { KnowHowRecommendsModule } from '@libs/dao/user/know-how-recommends/know-how-recommends.module';
import { KnowHowsRedisRepository } from '@libs/dao/redis/know-hows/know-hows-redis.repository';
import { RequestCountsRedisRepository } from '@libs/dao/redis/request-counts/request-counts-redis.repository';

@Module({
  imports: [
    IdeasModule,
    DeveloperNotesModule,
    IdeaDoItsModule,
    KnowHowsModule,
    KnowHowRecommendsModule,
  ],
  providers: [
    IdeasRedisRepository,
    DeveloperNotesRedisRepository,
    KnowHowsRedisRepository,
    RequestCountsRedisRepository,
  ],
  exports: [
    IdeasRedisRepository,
    DeveloperNotesRedisRepository,
    KnowHowsRedisRepository,
    RequestCountsRedisRepository,
  ],
})
export class RedisModule {}
