import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { CommonModule } from '@libs/dao/common/common.module';
import { GameModule } from '@libs/dao/game/game.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { AdminServerConfig } from '../../admin/src/config/admin.server.config';
import { AuthModule } from '../../admin/src/auth/auth.module';
import { UserController } from '../../admin/src/user/user.controller';
import { UserService } from '../../admin/src/user/user.service';
import { ConsumptionProvider } from '@libs/common/provider/goods/consumption.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { RewardProvider } from '@libs/common/provider/goods/reward.provider';
import { CharacterProvider } from '@libs/common/provider/contents/character.provider';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MissionAchievementProvider } from '@libs/common/provider/achievement/mission-achievement.provider';
import { MissionProvider } from '@libs/common/provider/contents/mission.provider';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { UserDetailService } from '../../admin/src/user-detail/user-detail.service';
import { UserDetailController } from '../../admin/src/user-detail/user-detail.controller';
import { AdminService } from '../../admin/src/default/admin.service';
import { AdminController } from '../../admin/src/default/admin.controller';
import { CharacterController } from '../../admin/src/character/character.controller';
import { CharacterService } from '../../admin/src/character/character.service';
import { MissionController } from '../../admin/src/mission/mission.controller';
import { MissionService } from '../../admin/src/mission/mission.service';
import { ArenaController } from '../../admin/src/arena/arena.controller';
import { ArenaService } from '../../admin/src/arena/arena.service';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { ArenaModule } from '@libs/dao/arena/arena.module';
import { LogServerProvider } from '@libs/common/http/log-server.provider';
import { HttpModule } from '@nestjs/axios';
import { MongoLogController } from '../../admin/src/mongo-log/mongo-log.controller';
import { MongoLogService } from '../../admin/src/mongo-log/mongo-log.service';

@Module({
  imports: [
    AdminServerConfig,
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ...[CommonDatabaseConfig, ArenaDatabaseConfig].map((it) => {
      return TypeOrmExModule.forRootAsync({
        name: it().name,
        inject: [it.KEY],
        useFactory: async (config: DataSourceOptions) => config,
      });
    }),

    ...getGameServerTypeOrmOptions().map((options) =>
      TypeOrmExModule.forRootAsync({
        name: options.name,
        inject: [GameDatabaseConfig.KEY],
        useFactory: (configs: Record<string, DataSourceOptions>) =>
          Object.values(configs).find((it) => it.name === options.name),
      }),
    ),

    RedisModule,

    AuthModule,
    CommonModule,
    GameModule,
    StaticModule,
    ArenaModule,
  ],
  controllers: [
    AdminController,
    UserController,
    UserDetailController,
    CharacterController,
    MissionController,
    ArenaController,
    MongoLogController,
  ],
  providers: [
    AdminService,
    UserService,
    UserDetailService,
    CharacterService,
    MissionService,
    ArenaService,
    MongoLogService,

    ConsumptionProvider,
    GoodsProvider,
    RewardProvider,
    CharacterProvider,

    UserDetailProvider,

    LogServerProvider,

    DataCharacterProvider,
    DataGoodsProvider,

    AchievementProvider,
    MissionAchievementProvider,
    MissionProvider,
    DataMissionProvider,
  ],
})
export class AdminElementModule {}
