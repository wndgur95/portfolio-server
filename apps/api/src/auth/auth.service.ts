import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@libs/common/constants/jwt.constants';
import { UserService } from '../user/user.service';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import { JwtService } from '@nestjs/jwt';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private apiKeys: string[] =
    NODE_ENV !== 'prod'
      ? [
          process.env.AUTH_KEY,
          'rvxuJW1J5XEJYo8+6d5ffR72QilBJC4FzvUYgVFxA8Fvi3z963RJQB4x3iZQUumqtAwh6keD/euzreWS+ewSmg==',
        ]
      : [
          'rvxuJW1J5XEJYo8+6d5ffR72QilBJC4FzvUYgVFxA8Fvi3z963RJQB4x3iZQUumqtAwh6keD/euzreWS+ewSmg==',
        ];

  private readonly externalApiKeys = [
    'vNA3sRMjTwgmE72v9cGDySKGK/wOIdfQVF0HMPM3lE72Upug3VLhOkYq+89D45gQZ7oHpatzRDdxuog8iFQgHw==',
  ];

  // api-key
  validateApiKey(apiKey: string): string {
    return this.apiKeys.find((key) => key === apiKey);
  }

  // external-api-key
  validateExternalApiKey(apiKey: string): string {
    return this.externalApiKeys.find((key) => key === apiKey);
  }

  validateUser(payload: JwtPayload): boolean {
    ContextProvider.setJwt(payload);
    if (payload.userDbId) ContextProvider.setUserDatabase(payload.database);
    return !!payload.activatedAt;
  }

  makeAuthToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  async login(email: string, password: string): Promise<User> {
    return await this.userService.signIn(email, password);
  }

  async kakaoLogin(
    kakaoId: string,
    name: string,
    provider: string,
    profileImage?: string,
  ): Promise<User> {
    return await this.userService.kakaoSignIn(
      kakaoId.toString(),
      name,
      provider,
      profileImage,
    );
  }

  async googleLogin(
    googleId: string,
    email: string,
    name: string,
    provider: string,
    profileImage?: string,
  ): Promise<User> {
    return await this.userService.googleSignIn(
      googleId.toString(),
      email,
      name,
      provider,
      profileImage,
    );
  }
}
