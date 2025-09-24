import { Module } from '@nestjs/common';
import { GameServerConfig } from '../../game/src/config/game.server.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { AuthModule as GameAuthModule } from '../../game/src/auth/auth.module';
import { CommonModule } from '@libs/dao/common/common.module';
import { GameModule as GameDbModule } from '@libs/dao/game/game.module';
import { StaticModule } from '@libs/dao/static/static.module';
import { ArenaModule } from '@libs/dao/arena/arena.module';
import { GameController } from '../../game/src/default/game.controller';
import { UserController as GameUserController } from '../../game/src/user/user.controller';
import { CharacterController } from '../../game/src/character/character.controller';
import { BattleController } from '../../game/src/battle/battle.controller';
import { MissionController } from '../../game/src/mission/mission.controller';
import { ShopController } from '../../game/src/shop/shop.controller';
import { GameService } from '../../game/src/default/game.service';
import { UserService as GameUserService } from '../../game/src/user/user.service';
import { CharacterService } from '../../game/src/character/character.service';
import { BattleService } from '../../game/src/battle/battle.service';
import { MissionService } from '../../game/src/mission/mission.service';
import { ShopService } from '../../game/src/shop/shop.service';
import { ConsumptionProvider } from '@libs/common/provider/goods/consumption.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { RewardProvider } from '@libs/common/provider/goods/reward.provider';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { BattleProvider } from '@libs/common/provider/contents/battle.provider';
import { MissionProvider } from '@libs/common/provider/contents/mission.provider';
import { GachaProvider } from '@libs/common/provider/gacha/gacha.provider';
import { CharacterProvider } from '@libs/common/provider/contents/character.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';
import { MissionAchievementProvider } from '@libs/common/provider/achievement/mission-achievement.provider';
import { SoloBattleProvider } from '@libs/common/provider/contents/solo-battle.provider';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { LogServerProvider } from '@libs/common/http/log-server.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    GameServerConfig,
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'), // dist/apps/api/public
      serveRoot: '/public', // → http://localhost:3000/public/privacy_policy.html
    }),

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

    GameAuthModule,
    CommonModule,
    GameDbModule,
    StaticModule,

    ArenaModule,
  ],
  controllers: [
    GameController,
    GameUserController,
    CharacterController,
    BattleController,
    MissionController,
    ShopController,
  ],
  providers: [
    //----Service
    GameService,
    GameUserService,
    CharacterService,
    BattleService,
    MissionService,
    ShopService,
    //Service----

    //----Provider
    ConsumptionProvider,
    GoodsProvider,
    RewardProvider,
    UserDetailProvider,
    BattleProvider,
    MissionProvider,
    GachaProvider,
    CharacterProvider,

    AchievementProvider,
    MissionAchievementProvider,
    SoloBattleProvider,
    LogServerProvider,
    //Provider----

    //----DataProvider
    DataCharacterProvider,
    DataGoodsProvider,
    DataMissionProvider,
    //DataProvider----
  ],
})
export class GameElementModule {}