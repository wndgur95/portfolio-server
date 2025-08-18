// src/auth/strategies/google-token.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(
  Strategy,
  'google-token',
) {
  private _client: OAuth2Client;
  private _clientIds: string[];

  constructor() {
    super();
    this._clientIds = [
      process.env.GOOGLE_IOS_CLIENT_ID,
      process.env.GOOGLE_AOS_CLIENT_ID,
      process.env.GOOGLE_WEB_CLIENT_ID,
    ];
    this._client = new OAuth2Client(); // 환경변수에 저장해두기
  }
  async validate(req: Request): Promise<any> {
    const token = req.body.idToken;
    if (!token) {
      throw new UnauthorizedException('Google ID Token not found');
    }

    let payload;
    try {
      const ticket = await this._client.verifyIdToken({
        idToken: token,
        audience: this._clientIds,
      });
      payload = ticket.getPayload();
    } catch (err) {
      throw new UnauthorizedException('Invalid Google ID Token');
    }

    if (!payload) {
      throw new UnauthorizedException('No payload in Google token');
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
      provider: 'google',
    };
  }
}
