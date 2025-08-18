import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class ExternalApiKeyAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-external-api-key'] ?? req.query.api_key;
    if (!this.authService.validateExternalApiKey(key))
      throw new UnauthorizedException();
    return true;
  }
}
