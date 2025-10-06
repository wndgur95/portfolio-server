import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import JwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ImmutableJwtPayload } from '@libs/common/constants/jwt.constants';

@Injectable()
export class ImmutableService {
  private jwksClient;

  constructor() {
    this.jwksClient = JwksClient({
      jwksUri: process.env.IMMUTABLE_JWKS_URL,
      cache:
        (process.env.IMMUTABLE_JWKS_CACHE &&
          JSON.parse(process.env.IMMUTABLE_JWKS_CACHE)) ||
        false,
      cacheMaxAge: Number(process.env.IMMUTABLE_JWKS_CACHE_MAX_AGE),
      cacheMaxEntries: Number(process.env.IMMUTABLE_JWKS_CACHE_ENTRIES),
      rateLimit: true,
      jwksRequestsPerMinute: 1,
    });
  }

  async verifySignature(
    address: string,
    jwtToken: string,
    challenge: string,
  ): Promise<void> {
    // header, payload, signature
    const { header } = jwt.decode(jwtToken, {
      complete: true,
    });

    const publicKey = await this.getSigningKey(header.kid);
    try {
      const verify: ImmutableJwtPayload = jwt.verify(jwtToken, publicKey, {
        algorithms: ['RS256'],
      }) as ImmutableJwtPayload;

    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_UNVERIFIED_SIGNATURE,
        'AUTH_UNVERIFIED_SIGNATURE',
      );
    }
  }

  private async getSigningKey(kid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err);
        }
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  }
}
