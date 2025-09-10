import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Session } from '@libs/dao/redis/session/session.entity';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userId: number, sessionId: string): Promise<Session> {
    return await this.authService.validateSession(userId, sessionId);
  }
}
