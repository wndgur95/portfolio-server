import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class NfTokenStrategy extends PassportStrategy(Strategy, 'nfToken') {
  constructor(private authService: AuthService) {
    super({ header: 'nfToken', prefix: '' }, true, (nfToken, done) => {
      return this.validate(nfToken, done);
    });
  }

  validate(
    nfToken: string,
    done: (error: Error, data: any) => NonNullable<unknown>,
  ): void {
    if (this.authService.validateNfToken(nfToken)) {
      done(null, true);
    }

    done(new UnauthorizedException(), null);
  }
}
