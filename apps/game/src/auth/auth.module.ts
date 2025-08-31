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

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_OPTIONS.expiresIn },
    }),
    UsersModule,
    UserDetailsModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    BasicStrategy,
    AuthService,
    UserService,
    GoogleOAuthProvider,
    FirebaseAdminProvider,
  ],
})
export class AuthModule {}
