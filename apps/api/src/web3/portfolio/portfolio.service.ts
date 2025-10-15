import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class PortfolioService {
  async verifySignature(
    address: string,
    signedSignature: string,
    challenge: string,
  ): Promise<void> {
    const encodedMessage = `Welcome Portfolio\n\n challenge is : ${challenge}`;
    let verify = '';
    try {
      verify = ethers.utils.verifyMessage(encodedMessage, signedSignature);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_UNVERIFIED_SIGNATURE,
        'AUTH_UNVERIFIED_SIGNATURE',
      );
    }
    if (verify.toUpperCase() !== address.toUpperCase()) {
      throw new InternalServerErrorException(
        INTERNAL_ERROR_CODE.AUTH_UNVERIFIED_SIGNATURE_MISMATCH_ADDRESS,
        'AUTH_UNVERIFIED_SIGNATURE_MISMATCH_ADDRESS',
      );
    }
  }
}
