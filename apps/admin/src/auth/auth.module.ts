import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { BasicStrategy } from './strategy/basic.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from '@libs/common/constants/jwt.constants';
import { UsersModule } from '@libs/dao/common/users/users.module';
import { AuthController } from './auth.controller';
import { UserDetailsModule } from '@libs/dao/game/user-details/user-details.module';
import { GoogleOAuthProvider, FirebaseAdminProvider } from '@libs/common/http';
import { RedisModule } from '@libs/dao/redis/redis.module';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { StaticModule } from '@libs/dao/static/static.module';
import { ConsumptionProvider } from '@libs/common/provider/goods/consumption.provider';
import { RewardProvider } from '@libs/common/provider/goods/reward.provider';
import { DataGoodsProvider } from '@libs/common/provider/static-data/data-goods.provider';
import { UserDetailProvider } from '@libs/common/provider/contents/user-detail.provider';
import { GameModule } from '@libs/dao/game/game.module';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { getGameServerTypeOrmOptions } from '@libs/dao/config/game/game-database-config.util';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import GameDatabaseConfig from '@libs/dao/config/game/game-database.config';
import { DataSourceOptions } from 'typeorm';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { ApiKeyStrategy } from './strategy/api-key.strategy';
import { CharacterProvider } from '@libs/common/provider/contents/character.provider';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_OPTIONS.expiresIn },
    }),
    ...getGameServerTypeOrmOptions().map((options) =>
      TypeOrmExModule.forRootAsync({
        name: options.name,
        inject: [GameDatabaseConfig.KEY],
        useFactory: (configs: Record<string, DataSourceOptions>) =>
          Object.values(configs).find((it) => it.name === options.name),
      }),
    ),
    UsersModule,
    UserDetailsModule,
    RedisModule,
    StaticModule,
    GameModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    ApiKeyStrategy,
    BasicStrategy,
    AuthService,
    UserService,
    GoogleOAuthProvider,
    FirebaseAdminProvider,
    GoodsProvider,
    ConsumptionProvider,
    RewardProvider,
    DataGoodsProvider,
    UserDetailProvider,
    DataCharacterProvider,
    CharacterProvider,
  ],
})
export class AuthModule {}
