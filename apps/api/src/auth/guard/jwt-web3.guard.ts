import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtWeb3Guard extends AuthGuard('jwt-web3') {}
