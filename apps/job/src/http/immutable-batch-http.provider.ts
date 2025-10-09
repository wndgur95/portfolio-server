import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BaseBatchHttpService } from './base-batch-http.service';
import { NETWORK } from '@libs/common/constants/web3.constants';

@Injectable()
export class ImmutableBatchHttpProvider extends BaseBatchHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(
      httpService,
      process.env.PORTFOLIO_BATCH_SERVER_HOST,
      Number(process.env.PORTFOLIO_BATCH_SERVER_PORT),
      process.env.PORTFOLIO_BATCH_SERVER_X_API_KEY,
      NETWORK.IMMUTABLE,
    );
  }
}
