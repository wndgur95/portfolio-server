import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@libs/dao/common/users/interfaces/user.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(req, payload: any): Promise<User> {
    const refreshToken = req?.headers?.authorization.replace('Bearer ', '');
    return await this.userService.getUserIfRefreshTokenMatches(
      payload.id,
      refreshToken,
    );
  }
}
