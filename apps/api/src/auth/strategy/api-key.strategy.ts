import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'apiKey') {
  constructor(private readonly authService: AuthService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  validate(apiKey: string, done: (error: Error, data) => {}): void {
    if (this.authService.validateApiKey(apiKey)) done(null, true);
    done(new UnauthorizedException(), null);
  }
}
