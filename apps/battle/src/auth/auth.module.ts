import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { BasicStrategy } from './strategy/basic.strategy';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { WebSocketAuthGuard } from './guard/websocket-auth.guard';

@Module({
  imports: [PassportModule],
  providers: [BasicStrategy, AuthService, WebSocketAuthGuard, SessionRepository],
  exports: [AuthService, WebSocketAuthGuard],
})
export class AuthModule {}
