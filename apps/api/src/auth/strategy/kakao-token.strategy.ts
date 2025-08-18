import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import axios from 'axios';

@Injectable()
export class KakaoTokenStrategy extends PassportStrategy(
  Strategy,
  'kakao-token',
) {
  async validate(req: Request): Promise<any> {
    const accessToken = req.headers['authorization']
      ?.toString()
      .replace('Bearer ', '');

    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const kakaoAccount = response.data.kakao_account;

      return {
        kakaoId: response.data.id,
        name: kakaoAccount.profile?.nickname,
        profileImage: kakaoAccount.profile?.profile_image_url,
        provider: 'kakao',
      };
    } catch (error) {
      console.error(
        '❌ Kakao token validation failed:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException('Invalid Kakao token');
    }
  }
}
