import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userId',
      passwordField: 'sessionId',
    });
  }

  public async validate(address: string, signature: string) {
    const userDto = await this.authService.validateUser(address);
    return { ...userDto, signature: signature };
  }
}
