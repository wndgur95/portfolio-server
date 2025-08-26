import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'apiKey') {
  private static readonly API_KEY_HEADER = 'X-API-KEY';

  constructor(private readonly authService: AuthService) {
    super(
      {
        header: ApiKeyStrategy.API_KEY_HEADER,
        prefix: ''
      },
      true,
      (apiKey: string, done: (error: Error | null, user?: any) => void) => {
        this.validateApiKey(apiKey, done);
      }
    );
  }

  /**
   * API 키 검증
   */
  private validateApiKey(
    apiKey: string,
    done: (error: Error | null, user?: any) => void
  ): void {
    try {
      if (!apiKey) {
        return done(new UnauthorizedException('API 키가 제공되지 않았습니다.'), null);
      }

      if (this.authService.validateApiKey(apiKey)) {
        return done(null, { apiKey, isValid: true });
      }

      return done(new UnauthorizedException('유효하지 않은 API 키입니다.'), null);
    } catch (error) {
      return done(
        new UnauthorizedException('API 키 검증 중 오류가 발생했습니다.'),
        null
      );
    }
  }

  /**
   * API 키 헤더명 반환
   */
  static getHeaderName(): string {
    return ApiKeyStrategy.API_KEY_HEADER;
  }
}