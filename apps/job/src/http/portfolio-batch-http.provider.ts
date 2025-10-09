import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { BaseBatchHttpService } from './base-batch-http.service';

@Injectable()
export class PortfolioBatchHttpProvider extends BaseBatchHttpService {
  constructor(protected readonly httpService: HttpService) {
    super(
      httpService,
      process.env.PORTFOLIO_BATCH_SERVER_HOST,
      Number(process.env.PORTFOLIO_BATCH_SERVER_PORT),
      process.env.PORTFOLIO_BATCH_SERVER_X_API_KEY,
      NETWORK.PORTFOLIO,
    );
  }
}
