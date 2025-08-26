import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerErrorException } from '../exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '../constants/internal-error-code.constants';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

@Injectable()
export class GoogleOAuthProvider {
  constructor(private readonly config: ConfigService) {}

  /**
   * Authorization Code를 Access Token으로 교환
   */
  async exchangeCodeForAccessToken(code: string): Promise<string> {
    const requestBody = new URLSearchParams({
      client_id: this.config.get('GOOGLE_WEB_CLIENT_ID'),
      client_secret: this.config.get('GOOGLE_CLIENT_SECRET'),
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.config.get('GOOGLE_REDIRECT_URI'),
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: requestBody,
    });

    if (!response.ok) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_ACTIVATED);
    }

    const { access_token } = await response.json();
    return access_token;
  }

  /**
   * Google API로 사용자 정보 조회
   */
  async getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_NOT_ACTIVATED);
    }

    return await response.json();
  }

  /**
   * Authorization Code로 사용자 정보 조회 (통합 메서드)
   */
  async exchangeCodeForUserInfo(code: string): Promise<GoogleUserInfo> {
    const accessToken = await this.exchangeCodeForAccessToken(code);
    return await this.getGoogleUserInfo(accessToken);
  }
} 