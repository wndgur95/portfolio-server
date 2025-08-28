import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiKeyStrategy } from './strategy/api-key.strategy';
import { UserService } from '../user/user.service';
import { BasicStrategy } from './strategy/basic.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from '@libs/common/constants/jwt.constants';
import { UsersModule } from '@libs/dao/common/users/users.module';
import { AuthController } from './auth.controller';
import { UserDetailsModule } from '@libs/dao/game/user-details/user-details.module';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { GoogleOAuthProvider, FirebaseAdminProvider } from '@libs/common/http';
import { SqlInjectionsModule } from '@libs/dao/common/sql-injections/sql-injections.module';
import { RedisModule } from '@libs/dao/redis/redis.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_OPTIONS.expiresIn },
    }),
    UsersModule,
    UserDetailsModule,
    SqlInjectionsModule,
    RedisModule,
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
  ],
})
export class AuthModule {}
