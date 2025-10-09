import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private apiKeys: string[] = ['batch-super-user'];

  validateApiKey(apiKey: string): string {
    return this.apiKeys.find((key) => key === apiKey);
  }
}
