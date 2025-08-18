import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  health(): Record<string, string> {
    return { environment: process.env.NODE_ENV };
  }
}
